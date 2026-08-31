from fastapi import Request
from fastapi.responses import JSONResponse

async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Unexpected server error.", "path": str(request.url.path)},
    )
