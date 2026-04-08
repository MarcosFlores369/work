"""Gemini function calling tool definition for Dolar MEP."""

DOLAR_MEP_TOOL = {
    "name": "get_dolar_mep",
    "description": (
        "Obtiene la cotizacion actual del Dolar MEP (compra y venta) desde dolarhoy.com. "
        "Usar cuando el usuario pregunta por el precio del dolar MEP, dolar bolsa o similar."
    ),
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
    },
}
