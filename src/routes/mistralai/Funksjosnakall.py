from mistralai import Mistral
import requests
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")
client = Mistral(api_key=api_key)

tools = [
    {
        "type": "function",
        "function": {
            "name": "chuck_norris_joke",
            "description": "Get a random Chuck Norris joke",
            "parameters": {"type": "object", "properties": {}, "required": []},
        }
    }
]

def chuck_norris_joke():
    response = requests.get("https://api.chucknorris.io/jokes/random")
    if response.status_code == 200:
        return response.json()["value"]
    return "Could not fetch a joke at this time."

messages = [
    {"role": "system", "content": "You are a helpful assistant. Use chuck_norris_joke when needed."}
]

while True:
    user_input = input("User: ")
    if user_input.lower() in ["exit", "quit"]:
        break

    messages.append({"role": "user", "content": user_input})

    response = client.chat.complete(
        model="mistral-large-2512",
        messages=messages,
        tools=tools
    )

    assistant_message = response.choices[0].message

    # Loop over tool_calls
    while (assistant_message.tool_calls or []):
        messages.append(assistant_message)  # push assistant som ba om tool

        for tc in assistant_message.tool_calls:
            if not tc.id:
                raise Exception("tool_call mangler id!")
            if tc.function.name == "chuck_norris_joke":
                print("---> kaller funksjon:", tc.function.name)
                joke = chuck_norris_joke()
                messages.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": joke
                })

        # kall modellen på nytt med tool-resultatet
        response = client.chat.complete(
            model="mistral-large-2512",
            messages=messages,
            tools=tools
        )
        assistant_message = response.choices[0].message

    # push endelig assistant-message
    messages.append(assistant_message)

    print("Assistant:", assistant_message.content)
