# backend/app/schemas/ask_schema.py
from pydantic import BaseModel
from typing import Any, List

class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    type: str
    cypher: str
    data: List[Any]
    explanation: str
