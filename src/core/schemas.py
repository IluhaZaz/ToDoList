from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ItemCreate(BaseModel):
    name: str
    comment: Optional[str]
    priority: int = Field(le=10, ge=0, default=0)
    do_till: Optional[datetime]
