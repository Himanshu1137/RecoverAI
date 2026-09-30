from app.core.config import settings


class LLMResponse:
    def __init__(self, text="", tool_name=None, arguments=None):
        self.text = text
        self.tool_name = tool_name
        self.arguments = arguments or {}

    @property
    def requests_tool(self):
        return bool(self.tool_name)


def call_gemini(messages, tool_schemas=None):
    try:
        from google import genai
        from google.genai import types
    except ImportError as exc:
        raise RuntimeError(
            "Gemini provider requires the google-genai package."
        ) from exc

    tool_schemas = tool_schemas or []

    client = genai.Client(
        api_key=settings.llm_api_key
    )

    system_message = (
        "You are RecoverAI, an intelligent revenue recovery assistant. "
        "Help analyze failed payments and select appropriate recovery tools."
    )

    user_message = ""

    for message in messages:
        if message.get("role") == "system":
            system_message = message.get("content", "")

        elif message.get("role") == "user":
            user_message = message.get("content", "")

    function_declarations = []

    for tool in tool_schemas:
        function_declarations.append(
            types.FunctionDeclaration(
                name=tool["name"],
                description=tool.get("description", ""),
                parameters=tool.get(
                    "parameters",
                    {
                        "type": "object",
                        "properties": {}
                    }
                )
            )
        )

    tools = None

    if function_declarations:
        tools = [
            types.Tool(
                function_declarations=function_declarations
            )
        ]

    config = types.GenerateContentConfig(
        system_instruction=system_message,
        temperature=0.2,
        tools=tools
    )

    chat = client.chats.create(
        model=settings.llm_model,
        config=config
    )

    response = chat.send_message(
        user_message
    )

    if response.function_calls:
        function_call = response.function_calls[0]

        return LLMResponse(
            tool_name=function_call.name,
            arguments=dict(function_call.args or {})
        )

    return LLMResponse(
        text=response.text or "No response generated."
    )


def call_llm(messages, tool_schemas=None):

    if settings.llm_provider == "gemini":
        return call_gemini(
            messages,
            tool_schemas
        )

    if settings.llm_provider == "mock":
        return LLMResponse(
            text="RecoverAI is running with mock LLM provider."
        )

    raise RuntimeError(
        f"Unsupported LLM provider: {settings.llm_provider}"
    )
