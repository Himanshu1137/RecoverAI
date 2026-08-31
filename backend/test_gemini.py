from google import genai

from app.core.config import settings


client = genai.Client(
    api_key=settings.llm_api_key
)

response = client.models.generate_content(
    model=settings.llm_model,
    contents="Say: RecoverAI Gemini connection successful."
)

print(response.text)