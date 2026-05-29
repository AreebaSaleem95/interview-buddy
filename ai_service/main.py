import os
import json
import random
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
import google.generativeai as genai

gemini_key = os.getenv("GEMINI_API_KEY")
if gemini_key:
    genai.configure(api_key=gemini_key)
    print("Gemini API configured successfully.")
else:
    print("WARNING: GEMINI_API_KEY not found in environment. Running with local AI simulator.")

app = FastAPI(title="InterviewBuddy AI Intelligence Service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# Models
# -------------------------------------------------------------
class GenerateQuestionRequest(BaseModel):
    domain: str
    difficulty: str
    topic: Optional[str] = None

class GenerateQuestionResponse(BaseModel):
    question: str
    expectedTopics: List[str] = Field(default_factory=list)
    evaluationCriteria: List[str] = Field(default_factory=list)

class EvaluateAnswerRequest(BaseModel):
    question: str
    answer: str
    difficulty: str
    domain: str
    expectedTopics: List[str] = Field(default_factory=list)
    evaluationCriteria: List[str] = Field(default_factory=list)

class EvaluateAnswerResponse(BaseModel):
    score: int
    feedback: str
    strengths: List[str]
    improvements: List[str]
    accuracy: str
    clarity: str
    completeness: str
    ideal_answer: str

class QuestionReportItem(BaseModel):
    question: str
    answer: str
    score: int
    feedback: str

class GenerateReportRequest(BaseModel):
    questions: List[QuestionReportItem]

class RecommendationItem(BaseModel):
    topic: str
    resource: str
    url: str

class GenerateReportResponse(BaseModel):
    overallFeedback: str
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[RecommendationItem]

# -------------------------------------------------------------
# LLM Helpers
# -------------------------------------------------------------
def get_gemini_json(prompt: str, model_name: str = "gemini-1.5-flash") -> Optional[dict]:
    if not gemini_key:
        return None
    try:
        model = genai.GenerativeModel(
            model_name,
            generation_config={"response_mime_type": "application/json"}
        )
        response = model.generate_content(prompt)
        text = response.text.strip()
        return json.loads(text)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Let it return None so the fallback simulator handles it
        return None

# -------------------------------------------------------------
# Local Fallbacks (Simulator)
# -------------------------------------------------------------
MOCK_TOPICS = {
    "frontend": ["State Management", "DOM Performance", "SSR vs CSR", "CSS Grid & Flexbox", "Web Accessibility", "React Lifecycle Hooks"],
    "backend": ["REST API Design", "Database Query Optimization", "SQL vs NoSQL trade-offs", "JWT & Session Security", "Horizontal Scaling", "Caching Strategies"],
    "devops": ["Docker Containment", "CI/CD Deployment Pipelines", "Kubernetes Load Balancing", "Infrastructure as Code", "Log Monitoring", "Security Auditing"],
    "general": ["Algorithms & Time Complexity", "Design Patterns", "Clean Code Best Practices", "Git Branching Workflows", "SDLC Methodologies", "Debugging Techniques"]
}

MOCK_RESOURCES = {
    "frontend": [
        {"topic": "State Management", "resource": "React Redux Guide", "url": "https://redux.js.org/introduction/getting-started"},
        {"topic": "DOM Performance", "resource": "MDN Web Performance", "url": "https://developer.mozilla.org/en-US/docs/Web/Performance"},
        {"topic": "React Lifecycle Hooks", "resource": "React Hooks Reference", "url": "https://react.dev/reference/react"}
    ],
    "backend": [
        {"topic": "Database Query Optimization", "resource": "Use The Index, Luke", "url": "https://use-the-index-luke.com/"},
        {"topic": "REST API Design", "resource": "Microsoft API Design Guidelines", "url": "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design"},
        {"topic": "JWT Security", "resource": "Auth0 JWT Introduction", "url": "https://jwt.io/introduction"}
    ],
    "devops": [
        {"topic": "Docker Containment", "resource": "Docker Get Started", "url": "https://docs.docker.com/get-started/"},
        {"topic": "Kubernetes Load Balancing", "resource": "Kubernetes Service docs", "url": "https://kubernetes.io/docs/concepts/services-networking/service/"},
        {"topic": "Infrastructure as Code", "resource": "Terraform Intro", "url": "https://developer.hashicorp.com/terraform/intro"}
    ],
    "general": [
        {"topic": "Design Patterns", "resource": "Refactoring.Guru Patterns", "url": "https://refactoring.guru/design-patterns"},
        {"topic": "Algorithms", "resource": "GeeksForGeeks DSA Guide", "url": "https://www.geeksforgeeks.org/data-structures/"},
        {"topic": "Git Branching Workflows", "resource": "Atlassian Git Tutorials", "url": "https://www.atlassian.com/git/tutorials"}
    ]
}

def simulate_generate_question(domain: str, difficulty: str, topic: Optional[str] = None) -> dict:
    domain_clean = domain.lower()
    if domain_clean not in MOCK_TOPICS:
        domain_clean = "general"
        
    t = topic or random.choice(MOCK_TOPICS[domain_clean])
    
    questions_pool = {
        "frontend": [
            f"Explain how React's Virtual DOM works to optimize page rendering. What are the potential trade-offs of using SSR instead of pure CSR for a rich dashboard application?",
            f"How do you handle complex client-side state across deeply nested components? Compare React Context API with state libraries like Redux or Zustand under high-frequency updates.",
            f"Describe the steps to optimize the initial page load time of a Single Page Application (SPA). How would you audit and solve layout shifts (CLS)?"
        ],
        "backend": [
            f"Describe the system design for a rate-limiting middleware in a distributed Node.js/Express API. How do sliding-window algorithms protect databases from DDoS spikes?",
            f"Compare SQL and NoSQL database models for a high-traffic SaaS ledger system. Under what constraints does schema denaturation improve read speeds, and how do you prevent stale reads?",
            f"Explain how you would implement robust session authentication with JWT. How would you design a secure token rotation scheme to handle refresh tokens?"
        ],
        "devops": [
            f"Explain the configuration steps for containerizing a microservice package with Docker. How does multi-stage building reduce layer footprint size and minimize CVE exposure?",
            f"How do you configure a blue-green or canary release cycle in a Kubernetes cluster using ingress routing? Explain the rollback criteria in case of HTTP 5xx spikes.",
            f"How would you design a highly secure CI/CD pipeline using GitHub Actions or GitLab CI? What mechanisms prevent secret keys and ENV structures from leaking?"
        ],
        "general": [
            f"Explain the difference between Time and Space complexity using a practical code scenario. When does a recursive algorithm lead to memory leaks, and how do you optimize it?",
            f"Walk through the principles of SOLID design. How does Dependency Inversion promote testability and decoupled modular releases in large software projects?",
            f"Explain your debugging workflow when analyzing a memory leak in a production server application. What tools do you employ to track heap memory allocations?"
        ]
    }
    
    pool = questions_pool.get(domain_clean, questions_pool["general"])
    question = random.choice(pool)
    
    return {
        "question": f"[{difficulty.upper()} - {t}] {question}",
        "expectedTopics": [t, "performance", "trade-offs", "edge cases", "security"],
        "evaluationCriteria": ["Technical accuracy of definitions", "Use of correct technical keywords", "Description of trade-offs", "Inclusion of concrete architectural examples"]
    }

def simulate_evaluate_answer(question: str, answer: str, difficulty: str, domain: str) -> dict:
    word_count = len(answer.split())
    
    if word_count < 10:
        return {
            "score": 2,
            "feedback": "The answer is extremely brief and lacks technical depth. Please elaborate on architectural concepts.",
            "strengths": ["Recognized basic question context"],
            "improvements": ["Structure your answer with situation-action-results (STAR)", "Explain trade-offs and edge-cases", "Use specific domain keywords"],
            "accuracy": "low",
            "clarity": "low",
            "completeness": "low",
            "ideal_answer": "A comprehensive response should explain core definitions, implementation mechanics, scaling challenges, and specific framework syntax."
        }
        
    # Rate score based on answer length and some random variance
    base_score = 5
    if word_count > 30:
        base_score += 1
    if word_count > 80:
        base_score += 2
    if word_count > 150:
        base_score += 1
        
    score = min(10, max(3, base_score + random.randint(-1, 1)))
    
    accuracy = "high" if score >= 8 else ("medium" if score >= 6 else "low")
    clarity = "high" if score >= 7 else ("medium" if score >= 5 else "low")
    completeness = "high" if score >= 8 else ("medium" if score >= 5 else "low")
    
    return {
        "score": score,
        "feedback": f"Your response demonstrates a solid {accuracy} level understanding of the concepts. You clearly state the implementation patterns, though there is minor room to mention specific testing or logging practices.",
        "strengths": ["Addressed the core conceptual question", "Well-structured response format", "Used accurate framework terms"],
        "improvements": ["Provide a concrete code or layout syntax example", "Mention scalability and deployment challenges"],
        "accuracy": accuracy,
        "clarity": clarity,
        "completeness": completeness,
        "ideal_answer": f"Ideal response to: {question[:80]}...\nTo answer this successfully, one must detail: 1) Core mechanism and definitions, 2) Design constraints and edge cases, 3) Real-world application example, and 4) Optimization/security protocols."
    }

def simulate_generate_report(questions: list) -> dict:
    avg_score = sum(q["score"] for q in questions) / len(questions) if questions else 5.0
    
    strengths = [
        "Consistent conceptual clarity in explanations.",
        "Good understanding of standard software patterns.",
        "Good awareness of security considerations like JWT validation or CVEs."
    ]
    
    weaknesses = [
        "Lacks detailed trade-off analysis on advanced scenarios.",
        "Could include more specific command-line or code syntax examples."
    ]
    
    # Extract topics from questions
    recs = []
    domains_referred = ["general"]
    
    recs = MOCK_RESOURCES["general"]
    if avg_score < 7:
        recs = recs + MOCK_RESOURCES.get("backend", [])[:2]
        
    return {
        "overallFeedback": f"Overall performance was solid, averaging {avg_score:.1f}/10. You display strong fundamental knowledge. Focus on structural explanations (STAR method) and architectural scaling constraints to qualify for senior engineering positions.",
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": recs
    }

# -------------------------------------------------------------
# Endpoints
# -------------------------------------------------------------
@app.post("/generate-question", response_model=GenerateQuestionResponse)
async def generate_question(req: GenerateQuestionRequest):
    if gemini_key:
        topic_str = f"focusing on the topic '{req.topic}'" if req.topic else "focusing on a key technical concept in this domain"
        prompt = f"""
        Generate a highly professional technical interview question for a {req.difficulty} level {req.domain} engineering position, {topic_str}.
        The question should be scenario-based or design-based (like Linear/Notion/Vercel standard) encouraging candidates to write complete paragraphs.
        
        Provide the output in JSON format with the following keys:
        - "question": string, the full question text
        - "expectedTopics": list of strings, 3 to 6 key technical terms, design trade-offs, or protocols that the candidate's answer should reference.
        - "evaluationCriteria": list of strings, 3 to 4 grading points for evaluating the response.
        
        Ensure you return ONLY the raw JSON object. Do not wrap it in markdown code blocks.
        """
        data = get_gemini_json(prompt)
        if data and "question" in data:
            return GenerateQuestionResponse(
                question=data["question"],
                expectedTopics=data.get("expectedTopics", []),
                evaluationCriteria=data.get("evaluationCriteria", [])
            )
            
    # Fallback/simulation
    res = simulate_generate_question(req.domain, req.difficulty, req.topic)
    return GenerateQuestionResponse(**res)


@app.post("/evaluate-answer", response_model=EvaluateAnswerResponse)
async def evaluate_answer(req: EvaluateAnswerRequest):
    if gemini_key:
        prompt = f"""
        You are an expert technical interviewer. Evaluate the candidate's response to the following {req.domain} interview question (Difficulty: {req.difficulty}).
        
        Question: {req.question}
        Candidate's Answer: {req.answer}
        Expected Topics to reference: {req.expectedTopics}
        Evaluation Criteria: {req.evaluationCriteria}
        
        Grade the response rigorously. Provide a JSON response containing:
        - "score": integer from 0 to 10.
        - "feedback": a qualitative summary of their answer, pointing out what was correct and what was missing.
        - "strengths": list of strings, specific things they explained correctly.
        - "improvements": list of strings, specific concepts or details they should have added.
        - "accuracy": string, either "low", "medium", or "high" indicating technical correctness.
        - "clarity": string, either "low", "medium", or "high" indicating explanation structure.
        - "completeness": string, either "low", "medium", or "high" indicating topic coverage.
        - "ideal_answer": string, a model expert answer for this question.
        
        Ensure you return ONLY the raw JSON object. Do not wrap it in markdown code blocks.
        """
        data = get_gemini_json(prompt)
        if data and "score" in data:
            return EvaluateAnswerResponse(
                score=int(data["score"]),
                feedback=data.get("feedback", "Evaluated."),
                strengths=data.get("strengths", []),
                improvements=data.get("improvements", []),
                accuracy=data.get("accuracy", "medium"),
                clarity=data.get("clarity", "medium"),
                completeness=data.get("completeness", "medium"),
                ideal_answer=data.get("ideal_answer", "Model response.")
            )
            
    # Fallback/simulation
    res = simulate_evaluate_answer(req.question, req.answer, req.difficulty, req.domain)
    return EvaluateAnswerResponse(**res)


@app.post("/generate-report", response_model=GenerateReportResponse)
async def generate_report(req: GenerateReportRequest):
    if gemini_key:
        questions_str = json.dumps([q.dict() for q in req.questions], indent=2)
        prompt = f"""
        Analyze the candidate's performance across the following mock interview sessions:
        {questions_str}
        
        Provide a comprehensive final evaluation report in JSON format:
        - "overallFeedback": string, executive summary of their overall coding level, communication, and system design capability.
        - "strengths": list of strings, their primary areas of strength.
        - "weaknesses": list of strings, their primary architectural or coding deficiencies.
        - "recommendations": list of objects, each containing "topic" (string), "resource" (string), and "url" (string) pointing to official, high-quality developer resources (such as MDN, React Docs, Nodejs docs, Kubernetes docs, standard specs).
        
        Ensure you return ONLY the raw JSON object. Do not wrap it in markdown code blocks.
        """
        data = get_gemini_json(prompt)
        if data and "overallFeedback" in data:
            return GenerateReportResponse(
                overallFeedback=data["overallFeedback"],
                strengths=data.get("strengths", []),
                weaknesses=data.get("weaknesses", []),
                recommendations=[RecommendationItem(**rec) for rec in data.get("recommendations", []) if "topic" in rec]
            )
            
    # Fallback/simulation
    questions_list = [q.dict() for q in req.questions]
    res = simulate_generate_report(questions_list)
    return GenerateReportResponse(**res)

@app.get("/health")
async def health():
    return {"status": "healthy", "gemini_configured": bool(gemini_key)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
