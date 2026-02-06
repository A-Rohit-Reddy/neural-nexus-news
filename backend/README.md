# 🧠 The Neural Nexus - Backend

A Multi-Agent System (MAS) for autonomous AI news generation, powered by **LangGraph**, **Tavily**, and **OpenAI**.

## 📂 Project Structure

```
backend/
├── agents/             # 🤖 Independent Agent Logic
│   ├── scavenger.py    # Search (Tavily)
│   ├── skeptic.py      # Fact Checking (Rumor vs Fact)
│   ├── analyst.py      # Technical Extraction
│   ├── quant.py        # Market Metrics
│   ├── editor.py       # Tone & Strategy
│   ├── writer.py       # Blog Generation
│   └── guardian.py     # Compliance & Safety
├── core/
│   └── config.py       # Environment & API Key management
├── graph/
│   ├── state.py        # Shared State (TypedDict)
│   └── workflow.py     # Graph Definition (Nodes & Edges)
├── app.py              # 🖥️ Streamlit UI & Entry Point
├── requirements.txt    # Python dependencies
└── .env.example        # Environment variables template
```

## 🚀 Run Instructions

### 1. Prerequisites
- Python 3.10+
- OpenAI API Key
- Tavily API Key

### 2. Setup
```bash
cd backend
pip install -r requirements.txt
```

### 3. Configuration
Create a `.env` file in the `backend/` directory (copy from `.env.example`):
```bash
cp .env.example .env
```
Fill in your keys:
```env  
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...
MODEL_NAME=gpt-4o-mini
```

### 4. Run the Application
Start the Streamlit interface:
```bash
streamlit run app.py
```
Visit the URL displayed (usually `http://localhost:8501`).

## 🛠️ Developer Guide

### Agent Flow
The system uses a directed cyclic graph (DCG) where the **Guardian** agent can reject a draft and send it back to the **Writer**.

**Flow:**
`Scavenger` -> `Skeptic` -> `Analyst` -> `Quant` -> `Editor` -> `Writer` -> `Guardian` -> (Pass -> End) | (Fail -> Writer)

### Modifying Agents
- **Prompts**: Edit the `ChatPromptTemplate` in `backend/agents/<agent_name>.py`.
- **Logic**: Each agent is a pure function taking `AgentState` and returning a state update.

### Modifying the Graph
- Edit `backend/graph/workflow.py`.
- To add a step, define a new node function, add it with `workflow.add_node`, and define the edges.
