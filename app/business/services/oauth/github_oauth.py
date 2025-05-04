import os
from .. import Controller_oauth

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

async def get_github_token(code: str):
    payload = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": code,
    }
    headers = {"Accept": "application/json"}
    url = "https://github.com/login/oauth/access_token"
    return await Controller_oauth.exchange_code(url, payload, headers)

async def get_github_user_info(access_token: str) -> dict:
    headers = {"Authorization": f"Bearer {access_token}"}
    url = "https://api.github.com/user"
    return await Controller_oauth.exchange_code(url, {}, headers)