# app/business/services/oauth/google_oauth.py

import os
from .. import Controller_oauth

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

async def get_google_token(code: str):
    payload = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI,
    }
    url = "https://oauth2.googleapis.com/token"
    return await Controller_oauth.exchange_code(url, payload)

async def get_google_user_info(access_token: str) -> dict:
    headers = {"Authorization": f"Bearer {access_token}"}
    url = "https://api.github.com/user"
    return await Controller_oauth.exchange_code(url, {}, headers)