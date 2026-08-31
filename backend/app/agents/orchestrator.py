from app.agents.prompts import SYSTEM_PROMPT
from app.agents.tool_registry import TOOL_SCHEMAS, execute_tool
from app.services.llm_service import call_llm

def _format_tool_result(tool_name, result):
    if tool_name == "get_failed_payments":
        items = sorted(result, key=lambda x: x["expected_recovery"], reverse=True)[:5]
        if not items:
            return "No failed payments were found."
        lines = [
            f"{item['transaction_id']}: ₹{item['amount']:,.2f}, "
            f"{item['recovery_probability']}% probability, "
            f"expected recovery ₹{item['expected_recovery']:,.2f}, "
            f"action {item['recommended_action']}."
            for item in items
        ]
        return "Top recovery opportunities:\n" + "\n".join(lines)

    if tool_name == "get_recovery_summary":
        s = result
        return (
            f"Failed payments: {s['failed_payments']}. "
            f"At-risk revenue: ₹{s['at_risk_revenue']:,.2f}. "
            f"Expected recovery: ₹{s['expected_recovery']:,.2f}. "
            f"Recovered revenue: ₹{s['recovered_revenue']:,.2f}. "
            f"Recovery rate: {s['recovery_rate']}%."
        )

    if tool_name == "get_payment_by_id":
        if not result:
            return "Transaction not found."
        return (
            f"{result['transaction_id']}: amount ₹{result['amount']:,.2f}, "
            f"recovery probability {result['recovery_probability']}%, "
            f"priority {result['priority']}, "
            f"expected recovery ₹{result['expected_recovery']:,.2f}, "
            f"recommended action {result['recommended_action']}."
        )
    return str(result)

def run_llm_agent(user_message, db):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message},
    ]
    response = call_llm(messages, TOOL_SCHEMAS)
    if response.requests_tool:
        result = execute_tool(response.tool_name, response.arguments, db)
        return _format_tool_result(response.tool_name, result)
    return response.text
