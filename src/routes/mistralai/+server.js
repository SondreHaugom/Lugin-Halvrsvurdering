import { Mistral } from "@mistralai/mistralai";
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

const client = new Mistral({
    apiKey: env.MISTRAL_API_KEY
});

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

        })
        message.push({ "role": "assistant", "content": (await response).choices[0].message.content });

        return json({ response: (await response).choices[0].message.content });
    } catch (error) {
        console.error('Error in Mistrakai +server.js:', error);
        return json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
};

