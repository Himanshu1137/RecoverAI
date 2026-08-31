from app.tools.recovery_tools import (
    get_failed_payments,
    get_payment_by_id,
    get_recovery_summary,
)


TOOL_SCHEMAS = [
    {
        "name": "get_failed_payments",
        "description": (
            "Return failed payments with ML recovery recommendations "
            "for the logged-in merchant."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100
                }
            },
        },
    },
    {
        "name": "get_recovery_summary",
        "description": (
            "Return recovery analytics and revenue summary "
            "for the logged-in merchant."
        ),
        "parameters": {
            "type": "object",
            "properties": {}
        },
    },
    {
        "name": "get_payment_by_id",
        "description": (
            "Return one transaction and its recovery recommendation "
            "for the logged-in merchant."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "transaction_id": {
                    "type": "string"
                }
            },
            "required": [
                "transaction_id"
            ],
        },
    },
]


def execute_tool(
    name,
    arguments,
    db,
    merchant_id
):
    if name == "get_failed_payments":
        return get_failed_payments(
            db,
            merchant_id,
            limit=arguments.get("limit", 20)
        )

    if name == "get_recovery_summary":
        return get_recovery_summary(
            db,
            merchant_id
        )

    if name == "get_payment_by_id":
        return get_payment_by_id(
            db,
            merchant_id,
            arguments["transaction_id"]
        )

    raise ValueError(
        f"Unknown tool: {name}"
    )