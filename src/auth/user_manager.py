import uuid
import json
from typing import Optional

from fastapi import Depends, Request, Response
from fastapi_users import BaseUserManager, UUIDIDMixin

from auth.models import User
from auth.utils import get_user_db
from auth.auth_backend import redis
from config import RESET_PASSWORD_TOKEN_SECRET, VERIFICATION_TOKEN_SECRET


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = RESET_PASSWORD_TOKEN_SECRET
    verification_token_secret = VERIFICATION_TOKEN_SECRET

    async def on_after_login(self, user: User, 
                             request: Request | None = None, response: Response | None = None
                             ) -> None:
        response_body = response.body.decode('utf-8')
        response_body = json.loads(response_body)
        
        if user.redis_token_key is not None:
            await redis.delete(user.redis_token_key)
        key = f"fastapi_users_token:{response_body['access_token']}"
        await self._update(user, {"redis_token_key": key})

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"Verification requested for user {user.id}. Verification token: {token}")


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)