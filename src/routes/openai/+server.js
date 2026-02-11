import {env} from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import OpenAI from "openai";

const openai_api_key = env.OPENAI_API_KEY;

const client = new OpenAI({
    apiKey: openai_api_key
});




/** @type {import('./$types').requestHandler} */

export async function POST(request) {
    try {
        const { message, previousResponseId} = await request.request.json();

        const response = await client.responses.create({
            model: "gpt-5.1",
            instructions: "Du er en hjelpsom assistent",
            input: [
                {
                    role: "user",
                    content: message,
                },
            ],
            previous_response_id: previousResponseId
        });

        return json({ 
            response: response.output_text,
            responseId: response.id 
    });
    } catch (error) {
        console.error("Error in OpenAI API call:", error);
        return json({ error: "An error occurred while processing your request." }, { status: 500 });
    }
    
}