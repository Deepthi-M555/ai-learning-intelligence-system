from pydantic import BaseModel


class HealthResponse(BaseModel):

    success: bool

    service: str

    version: str

    status: str