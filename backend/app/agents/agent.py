from app.agents.prompts import SYSTEM_PROMPT
from app.agents.tool_registry import TOOL_SCHEMAS, execute_tool
from app.services.llm_service import call_llm


def format_tool_result(tool_name, result):
    if tool_name == "get_recovery_summary":
        return (
            f"Failed payments: {result['failed_payments']}. "
            f"At-risk revenue: INR {result['at_risk_revenue']:,.2f}. "
            f"Expected recovery: INR {result['expected_recovery']:,.2f}. "
            f"Recovered revenue: INR {result['recovered_revenue']:,.2f}. "
            f"Recovery rate: {result['recovery_rate']}%."
        )

    if tool_name == "get_failed_payments":
        if not result:
            return "I could not find any failed payments."

        items = sorted(
            result,
            key=lambda x: x["expected_recovery"],
            reverse=True
        )[:5]

        lines = []

        for item in items:
            lines.append(
                f"{item['transaction_id']}: "
                f"INR {item['amount']:,.2f}, "
                f"{item['recovery_probability']}% probability, "
                f"expected recovery INR {item['expected_recovery']:,.2f}, "
                f"action {item['recommended_action']}."
            )

        return "Top recovery opportunities:\n" + "\n".join(lines)

    if tool_name == "get_payment_by_id":
        if not result:
            return "I could not find that transaction."

        explanation = result.get("explanation", [])

        if explanation:
            reasons = "\n".join(
                f"- {reason}"
                for reason in explanation
            )
        else:
            reasons = "No explanation is available for this prediction."

        return (
            f"{result['transaction_id']}\n"
            f"Amount: INR {result['amount']:,.2f}\n"
            f"Payment method: {result['payment_method']}\n"
            f"Failure reason: {result['failure_reason']}\n"
            f"Recovery probability: {result['recovery_probability']}%\n"
            f"Priority: {result['priority']}\n"
            f"Expected recovery: INR {result['expected_recovery']:,.2f}\n"
            f"Recommended action: {result['recommended_action']}\n\n"
            f"Why this prediction?\n"
            f"{reasons}"
        )

    return str(result)


def run_agent(message, db, merchant_id):
    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role": "user",
            "content": message
        }
    ]

    response = call_llm(
        messages,
        TOOL_SCHEMAS
    )

    if response.requests_tool:
        try:
            result = execute_tool(
                response.tool_name,
                response.arguments,
                db,
                merchant_id
            )

            return format_tool_result(
                response.tool_name,
                result
            )

        except Exception as exc:
            print(
                f"Agent tool error [{response.tool_name}]: {exc}"
            )

            return (
                "I could not complete that recovery "
                "analysis right now."
            )

    return response.text
