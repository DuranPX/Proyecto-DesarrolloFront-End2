import httpx

async def exchange_code(url: str, payload: dict, headers: dict = None) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=payload, headers=headers or {})
        return response.json()
    