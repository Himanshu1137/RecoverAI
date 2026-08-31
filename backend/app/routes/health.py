from fastapi import APIRouter
router = APIRouter(tags=["Health"])

@router.get("/health")
def health():
    return {"status": "healthy", "service": "RecoverAI API", "version": "0.3.0"}
