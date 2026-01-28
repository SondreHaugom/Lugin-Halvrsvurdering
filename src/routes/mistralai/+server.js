import { json } from '@sveltejs/kit';
import { Mistral } from "@mistralai/mistralai";
import { env } from '$env/dynamic/private';

const client = new Mistral({ apiKey: env.MISTRAL_API_KEY });

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        const { message } = await request.json();
        console.log("Message received on Mistral server:", message);
        
        // Use local messages array for each request to avoid conflicts
        const messages = [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message }
        ];

        const response = await client.chat.complete({
            model: "mistral-large-2512",
            messages: messages,
        });
        
        const assistantMessage = response.choices[0].message;
        console.log("Response from Mistral:", assistantMessage);
        
        return json({ response: assistantMessage.content });
    } catch (error) {
        console.error("Error in Mistral request:", error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
