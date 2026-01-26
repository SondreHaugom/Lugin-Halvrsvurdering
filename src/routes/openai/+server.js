import {env} from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import OpenAI from "openai";

const openai_api_key = env.OPENAI_API_KEY;

const client = new OpenAI({
    apiKey: openai_api_key
});


let response_ID = null;

/** @type {import('./$types').requestHandler} */

export async function POST() {
    try {
        const {messages} = await request.request.json();
        console.log("Messages received on server:", messages);

        const response = await client.responses.create({
            model: "gpt-5.1",
            instructions: "You are a helpful assistant.",
            input: [
                {
                    role: "user",
                    content: messages
                }
            ],
            previous_response_id: response_ID

        });
        response_ID = response.id;
        console.log("Response from OpenAI:", response);

        return json({ response: response.output_text});
    } catch (error) {
        console.error("Error in OpenAI request:", error);
        if (error.response) {
            try {
                const errorDetails = await error.response.json();
                console.error("OpenAI API error details:", errorDetails);
                return json({ error: errorDetails }, { status: error.response.status });
            } catch (parseErr) {
                console.error("Error parsing OpenAI error response:", parseErr);
            }
        }
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
}
