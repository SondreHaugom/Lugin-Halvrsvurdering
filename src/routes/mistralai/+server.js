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
        return json({ response: respons.choices[0].message.content });
    } catch (error) {
        console.error("Error in MistralAI request:", error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
