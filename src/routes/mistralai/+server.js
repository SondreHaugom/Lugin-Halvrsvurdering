import { Mistral } from "@mistralai/mistralai";
import {env} from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { MISTRAL_API_KEY } from "$env/static/private";

const api_key = env.MISTRAL_API_KEY

const client = new Mistral({
    apiKey: api_key
});

let conversationHistory = [
    { role: "system", content: "You are a helpful assistant." }
]

let tools = [
    {
        type: 'function',
        function: {
            name: 'chuck_norris_joke',
            description: 'Get a random Chuck Norris joke',
            parameters: {
                type: 'object',
                properties: {
                    transactionId: {
                        type: 'string',
                        description: 'The ID of the transaction'
                    },
                },
                required: ['transactionId'],
            },
        },
    },
];


const huck_norris_joke = async (transactionId) => {
    const apiUrl = "https://api.chucknorris.io/jokes/random";
    if (!transactionId) {
        throw new Error("transactionId is required");
    } else {
        const response = await fetch(apiUrl);
        const joke = await response.json();
        return joke.value;
    }
};


/** @type {import('./$types').RequestHandler} */

export async function POST(request) {
    try {
        const {message} = await request.request.json();
        console.log("Message received on server:", message);

        conversationHistory.push({ role: "user", content: message });

        const respons = await client.chat.complete({
            model: "mistral-large-2512",
            messages: conversationHistory,

        });
        conversationHistory.push({ role: "assistant", content: respons.choices[0].message.content });
        let reply = respons.choices[0].message.content;

        while (assistantMessage.toolCalls && assistantMessage.toolCalls.length > 0) {
            const toolcalls = [];
        }
    } catch (error) {
        console.error("Error in MistralAI request:", error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
