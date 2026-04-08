import requests
from bs4 import BeautifulSoup


def get_dolar_mep() -> dict:
    """Scrape dolarhoy.com for MEP buy/sell prices."""
    url = "https://dolarhoy.com/cotizaciondolarbolsa"
    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    compra = None
    venta = None

    values = soup.select(".value")
    if len(values) >= 2:
        compra = values[0].get_text(strip=True)
        venta = values[1].get_text(strip=True)

    return {"compra": compra, "venta": venta}
