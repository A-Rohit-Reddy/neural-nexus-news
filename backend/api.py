from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel
from pymongo import MongoClient
from cryptography.fernet import Fernet, InvalidToken
import os
import httpx
from urllib.parse import urlencode

load_dotenv()

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
MEDIUM_CLIENT_ID = os.getenv('MEDIUM_CLIENT_ID')
MEDIUM_CLIENT_SECRET = os.getenv('MEDIUM_CLIENT_SECRET')
MEDIUM_REDIRECT_URI = os.getenv('MEDIUM_REDIRECT_URI', 'http://localhost:3000/settings/integrations')
OAUTH_ENCRYPTION_KEY = os.getenv('OAUTH_ENCRYPTION_KEY')
USER_STORE_ID = os.getenv('USER_STORE_ID', 'default-user')

if not MEDIUM_CLIENT_ID or not MEDIUM_CLIENT_SECRET or not OAUTH_ENCRYPTION_KEY:
    raise RuntimeError('MEDIUM_CLIENT_ID, MEDIUM_CLIENT_SECRET, and OAUTH_ENCRYPTION_KEY must be set.')

fernet = Fernet(OAUTH_ENCRYPTION_KEY.encode())
client = MongoClient(MONGO_URI)
db = client['neural_nexus']
connections = db['medium_connections']
articles = db['articles']

app = FastAPI(title='Neural Nexus Backend API')

class MediumPublishRequest(BaseModel):
    title: str
    content: str
    canonicalUrl: str
    tags: list[str] = []
    publishStatus: str = 'draft'

class MediumAuthResponse(BaseModel):
    authUrl: str


@app.get('/integrations/medium/status')
async def medium_status():
    record = connections.find_one({'userId': USER_STORE_ID})
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='No Medium account connected')

    try:
        token = fernet.decrypt(record['encryptedAccessToken'].encode()).decode()
    except InvalidToken:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Stored OAuth token is invalid')

    return {
        'mediumUserId': record['mediumUserId'],
        'connectedAt': record['connectedAt'].isoformat(),
        'tokenStatus': 'available' if token else 'missing',
    }


@app.post('/integrations/medium/auth-url', response_model=MediumAuthResponse)
async def medium_auth_url():
    query = {
        'client_id': MEDIUM_CLIENT_ID,
        'scope': 'basicProfile,publishPost',
        'response_type': 'code',
        'redirect_uri': MEDIUM_REDIRECT_URI,
    }
    auth_url = f'https://medium.com/m/oauth/authorize?{urlencode(query)}'
    return {'authUrl': auth_url}


@app.get('/integrations/medium/callback')
async def medium_callback(code: str | None = None, state: str | None = None):
    if not code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Missing authorization code')

    async with httpx.AsyncClient() as http_client:
        response = await http_client.post(
            'https://api.medium.com/v1/tokens',
            data={
                'code': code,
                'client_id': MEDIUM_CLIENT_ID,
                'client_secret': MEDIUM_CLIENT_SECRET,
                'grant_type': 'authorization_code',
                'redirect_uri': MEDIUM_REDIRECT_URI,
            },
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            timeout=15,
        )

    if response.status_code != 200:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail='Medium token exchange failed')

    payload = response.json()
    access_token = payload.get('access_token')
    if not access_token:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail='Medium did not return an access token')

    async with httpx.AsyncClient() as http_client:
        profile_response = await http_client.get(
            'https://api.medium.com/v1/me',
            headers={'Authorization': f'Bearer {access_token}'},
            timeout=15,
        )

    if profile_response.status_code != 200:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail='Medium profile lookup failed')

    user_data = profile_response.json().get('data', {})
    medium_user_id = user_data.get('id')
    if not medium_user_id:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail='Medium user id could not be determined')

    encrypted_token = fernet.encrypt(access_token.encode()).decode()
    connections.update_one(
        {'userId': USER_STORE_ID},
        {
            '$set': {
                'userId': USER_STORE_ID,
                'mediumUserId': medium_user_id,
                'encryptedAccessToken': encrypted_token,
                'connectedAt': datetime.utcnow(),
            },
        },
        upsert=True,
    )

    redirect_url = f'{MEDIUM_REDIRECT_URI}?medium_connected=true'
    return RedirectResponse(url=redirect_url)


@app.post('/integrations/medium/disconnect')
async def medium_disconnect():
    connections.delete_one({'userId': USER_STORE_ID})
    return JSONResponse({'message': 'Medium disconnected'})


@app.post('/articles/{article_id}/publish-medium')
async def publish_to_medium(article_id: str, body: MediumPublishRequest):
    record = connections.find_one({'userId': USER_STORE_ID})
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Medium account not connected')

    try:
        access_token = fernet.decrypt(record['encryptedAccessToken'].encode()).decode()
    except InvalidToken:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Stored Medium token invalid')

    async with httpx.AsyncClient() as http_client:
        create_response = await http_client.post(
            f"https://api.medium.com/v1/users/{record['mediumUserId']}/posts",
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            json={
                'title': body.title,
                'contentFormat': 'markdown',
                'content': body.content,
                'canonicalUrl': body.canonicalUrl,
                'tags': body.tags[:5],
                'publishStatus': body.publishStatus,
            },
            timeout=20,
        )

    if create_response.status_code not in (200, 201):
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail='Medium publish failed')

    response_data = create_response.json().get('data', {})
    return {
        'postUrl': response_data.get('url', ''),
        'message': 'Published to Medium successfully',
    }


def normalize_article_payload(article: dict) -> dict:
    return {
        'id': article.get('id'),
        'title': article.get('title'),
        'summary': article.get('summary'),
        'author': article.get('author'),
        'category': article.get('category'),
        'tags': article.get('tags', []),
        'featuredImage': article.get('featuredImage'),
        'content': article.get('content'),
        'marketPulse': article.get('marketPulse', {}),
        'sources': article.get('sources', []),
        'publishedAt': article.get('publishedAt').isoformat() if isinstance(article.get('publishedAt'), datetime) else article.get('publishedAt'),
        'status': article.get('status', 'draft'),
    }


@app.post('/workflow/start')
async def workflow_start():
    workflow_article = {
        'id': str(int(datetime.utcnow().timestamp() * 1000)),
        'title': 'Breaking: NVIDIA H200 Redefines AI Training Performance',
        'summary': 'The latest GPU from NVIDIA promises 2x faster training times with improved memory bandwidth.',
        'author': 'AI Multi-Agent System',
        'category': 'AI Infrastructure',
        'tags': ['NVIDIA', 'AI', 'GPU', 'H200'],
        'featuredImage': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
        'content': '# NVIDIA H200: The Next Generation of AI Compute\n\nNVIDIA has officially announced the H200, the successor to the wildly successful H100 GPU.\n\n## Key Specifications\n- **Memory**: 141GB HBM3e\n- **Bandwidth**: 4.8 TB/s\n- **Performance**: 2x H100 for large language models\n\n## Market Impact\nEarly adopters are already pre-ordering in bulk...\n\n### Technical Notes\n- 141GB HBM3e enables far larger context windows\n- 4.8 TB/s memory bandwidth supports faster training loops\n\n## Quick Reference Table\n| Metric | H100 | H200 |\n|--------|------|------|\n| Memory | 80GB HBM3 | 141GB HBM3e |\n| Bandwidth | 3.2 TB/s | 4.8 TB/s |\n| Performance | Baseline | 2x |\n\n> The H200 is positioned as the new workhorse for large language model training.\n\n*Full technical analysis coming soon.*',
        'marketPulse': {
            'metric': 'NVDA Pre-Market',
            'value': '+3.2%',
            'trend': 'up',
        },
        'sources': ['NVIDIA Press Release', 'TechCrunch', 'AnandTech'],
        'publishedAt': datetime.utcnow().isoformat(),
        'status': 'draft',
    }

    articles.update_one({'id': workflow_article['id']}, {'$set': workflow_article}, upsert=True)

    logs = [
        {'id': 'log-1', 'agentId': 'manager', 'agentName': 'The Orchestrator', 'message': 'Initiating backend workflow run.', 'timestamp': datetime.utcnow().isoformat(), 'type': 'info'},
        {'id': 'log-2', 'agentId': 'scavenger', 'agentName': 'The Scavenger', 'message': 'Gathered relevant AI news items.', 'timestamp': datetime.utcnow().isoformat(), 'type': 'success'},
        {'id': 'log-3', 'agentId': 'skeptic', 'agentName': 'The Skeptic', 'message': 'Verified source credibility.', 'timestamp': datetime.utcnow().isoformat(), 'type': 'success'},
        {'id': 'log-4', 'agentId': 'writer', 'agentName': 'The Writer', 'message': 'Drafted the article content.', 'timestamp': datetime.utcnow().isoformat(), 'type': 'success'},
        {'id': 'log-5', 'agentId': 'guardian', 'agentName': 'The Guardian', 'message': 'Performed final content quality checks.', 'timestamp': datetime.utcnow().isoformat(), 'type': 'success'},
    ]

    news_items = [
        {'id': 'news-1', 'headline': 'GPT-5 to be released next month', 'source': 'Twitter @aibreaking', 'status': 'unverified'},
        {'id': 'news-2', 'headline': 'NVIDIA announces new H200 GPU', 'source': 'NVIDIA Press Release', 'status': 'confirmed'},
        {'id': 'news-3', 'headline': 'Anthropic raises $2B Series D', 'source': 'TechCrunch', 'status': 'confirmed'},
    ]

    return {
        'article': workflow_article,
        'logs': logs,
        'newsItems': news_items,
    }


@app.get('/articles')
async def get_articles():
    all_articles = list(articles.find().sort('publishedAt', -1))
    return [normalize_article_payload(article) for article in all_articles]


@app.get('/articles/{article_id}')
async def get_article(article_id: str):
    article = articles.find_one({'id': article_id})
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Article not found')
    return normalize_article_payload(article)
