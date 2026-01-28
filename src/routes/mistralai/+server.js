import { Mistral } from "@mistralai/mistralai";
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

const client = new Mistral({
    apiKey: env.MISTRAL_API_KEY
});


const tools = [
  {
    type: "function",
    function: {
      name: "chuck_norris_joke",
      description: "Get a random Chuck Norris joke",
      parameters: {type: "object", properties: {}, required: []}
    }
  }
];

const chuck_norris_joke = () => {
    const apiUrl = fetch("https://api.chucknorris.io/jokes/random");
    return apiUrl.then(response => response.json())
        .then(data => data.value)
        .catch(error => "Could not fetch joke at this time.");
}

let message = [
    {"role": "system", "content": "You are a helpful assistant. Use chuck_norris_joke when needed."}
];

export async function POST({ request }) {
    try {
        const { message: userMessage } = await request.json();
        message.push({ "role": "user", "content": userMessage });

        const response = client.chat.complete({
            model: "mistral-large-2512",
            messages: message,
            tools: tools,

        });

        let assistantMessage = (await response).choices[0].message.content;

        while (assistantMessage.tool_calls.length > 0) {
            message.push({assistantMessage})

            for (const tc of assistantMessage.tool_calls) {
                if (!tc.id) {
                    throw new Error("tool_call mangler id!");
                }
                if (tc.function.name === "chuck_norris_joke") {
                    console.log("---> kaller funksjon:", tc.function.name);
                    const joke = chuck_norris_joke();
                    message.push({
                        "role": "tool",
                        "name": "chuck_norris_joke",
                        "content": await joke
                    })
                }
            }
            const response = client.chat.complete({
                model: "mistral-large-2512",
                messages: message,
                tools: tools,
            })
            assistantMessage = (await response).choices[0].message;

        }

        message.push(assistantMessage);
        return json({ response: assistantMessage.content } );


    } catch (error) {
        console.error('Error in Mistralai +server.js:', error);
        return json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
};

