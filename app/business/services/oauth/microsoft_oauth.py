# app/business/services/oauth/microsoft_oauth.py

import os
from .. import Controller_oauth

MICROSOFT_CLIENT_ID = os.getenv("MICROSOFT_CLIENT_ID")
MICROSOFT_CLIENT_SECRET = os.getenv("MICROSOFT_CLIENT_SECRET")
MICROSOFT_REDIRECT_URI = os.getenv("MICROSOFT_REDIRECT_URI")
MICROSOFT_GRAPH_USER_URL = "https://graph.microsoft.com/v1.0/me"

async def get_microsoft_token(code: str):
    url = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
    payload = {
        "client_id": MICROSOFT_CLIENT_ID,
        "scope": "openid profile email",  # ajusta según tus permisos
        "code": code,
        "redirect_uri": MICROSOFT_REDIRECT_URI,
        "grant_type": "authorization_code",
        "client_secret": MICROSOFT_CLIENT_SECRET,
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    return await Controller_oauth.exchange_code(url, payload, headers)

async def get_microsoft_user_info(access_token: str) -> dict:
    headers = {"Authorization": f"Bearer {access_token}"}
    return await Controller_oauth.exchange_code(MICROSOFT_GRAPH_USER_URL, {}, headers)