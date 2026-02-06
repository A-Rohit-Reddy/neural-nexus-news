import { BlogPost } from '@/types/agent';

export const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'GPT-5 Turbo: OpenAI Unveils Next-Gen Reasoning Engine',
    summary: 'OpenAI has officially released GPT-5 Turbo with unprecedented reasoning capabilities, 128K context window, and 40% reduced latency.',
    content: `# GPT-5 Turbo: A New Era of AI Reasoning

OpenAI has just dropped what might be the most significant update to their flagship model since GPT-4. The new **GPT-5 Turbo** brings substantial improvements across the board.

## Key Highlights

### Enhanced Reasoning
The model now demonstrates "System 2" thinking capabilities, allowing for multi-step logical reasoning that previous models struggled with. Internal benchmarks show a **47% improvement** on complex math problems.

### Technical Specifications
- **Context Window**: 128,000 tokens (2x increase)
- **Latency**: 40% reduction in time-to-first-token
- **Cost**: $0.01/1K input, $0.03/1K output

### Real-World Applications
Early adopters report significant improvements in:
- Code generation accuracy
- Multi-document analysis
- Long-form content creation

## What This Means for Developers

The API is backward compatible, meaning existing applications can immediately benefit from the upgrade with minimal changes.

\`\`\`python
# Example usage
response = openai.chat.completions.create(
    model="gpt-5-turbo",
    messages=[{"role": "user", "content": "Your prompt"}]
)
\`\`\`

---
*Sources verified by The Skeptic. Technical specs confirmed via official documentation.*`,
    marketPulse: {
      metric: 'MSFT Stock Impact',
      value: '+2.3%',
      trend: 'up',
    },
    sources: ['OpenAI Blog', 'TechCrunch', 'ArXiv'],
    publishedAt: new Date('2024-01-15T10:30:00'),
    status: 'published',
  },
  {
    id: '2',
    title: 'NVIDIA Blackwell B200: The 1000W Monster Reshaping AI Infrastructure',
    summary: 'NVIDIA reveals Blackwell architecture with unprecedented 20 petaflops of FP4 performance, but the 1000W TDP raises serious data center concerns.',
    content: `# NVIDIA Blackwell B200: Power Meets Performance

NVIDIA's latest announcement has sent shockwaves through the AI infrastructure world. The Blackwell B200 GPU represents a quantum leap—but at what cost?

## The Numbers That Matter

### Raw Performance
- **20 Petaflops** FP4 performance
- **208 billion transistors** (largest chip ever made)
- **8x faster** than H100 for LLM inference

### The Power Question
The 1000W TDP has raised eyebrows across the industry. Data centers are scrambling to:
- Upgrade cooling systems
- Reassess power budgets
- Consider liquid cooling solutions

## Market Implications

Cloud providers are expected to absorb costs initially, but the TCO question remains:

| Metric | H100 | B200 |
|--------|------|------|
| TDP | 700W | 1000W |
| Inference Speed | 1x | 8x |
| $/token | baseline | ~0.4x |

## Industry Reactions

*"This changes everything for real-time AI applications"* — Jensen Huang, CEO

The efficiency gains at scale may offset the power requirements, but smaller operations might find themselves priced out.

---
*Market data verified. GitHub repos for benchmarks show 15.2K stars in 48 hours.*`,
    marketPulse: {
      metric: 'NVDA Pre-Market',
      value: '+5.7%',
      trend: 'up',
    },
    sources: ['NVIDIA GTC', 'Reuters', 'AnandTech'],
    publishedAt: new Date('2024-01-14T14:00:00'),
    status: 'published',
  },
  {
    id: '3',
    title: 'Llama 3.2 Goes Multimodal: Meta Opens the Vision-Language Floodgates',
    summary: 'Meta releases Llama 3.2 with native vision capabilities, matching GPT-4V performance while remaining fully open-source.',
    content: `# Llama 3.2: Open-Source Vision-Language Model

Meta has just released Llama 3.2, and it's a game-changer for the open-source AI community. For the first time, a fully open-weights model matches proprietary vision-language models.

## What's New

### Vision Capabilities
- Native image understanding
- Multi-image reasoning
- Chart and diagram analysis
- Real-time video frame processing

### Model Variants
- **Llama 3.2 11B Vision**: Consumer GPU friendly
- **Llama 3.2 90B Vision**: Enterprise grade
- **Llama 3.2 1B/3B**: Mobile deployment ready

## Benchmark Comparisons

The 90B variant achieves:
- **MMMU**: 68.4 (GPT-4V: 69.1)
- **ChartQA**: 85.2 (GPT-4V: 78.5)
- **DocVQA**: 92.1 (GPT-4V: 88.4)

## Deployment Considerations

\`\`\`bash
# Quick start with Ollama
ollama pull llama3.2-vision
ollama run llama3.2-vision
\`\`\`

The 11B model runs comfortably on a single RTX 4090, making vision AI accessible to individual developers for the first time.

---
*All benchmarks independently verified. GitHub: 42.3K stars.*`,
    marketPulse: {
      metric: 'GitHub Stars (24h)',
      value: '+8.2K',
      trend: 'up',
    },
    sources: ['Meta AI Blog', 'Hugging Face', 'GitHub'],
    publishedAt: new Date('2024-01-13T09:00:00'),
    status: 'published',
  },
];
