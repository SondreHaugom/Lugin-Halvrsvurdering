import {env} from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import OpenAI from "openai";
import { saveConfig} from '/src/routes/+page.svelte';


const openai_api_key = env.OPENAI_API_KEY;

const VC_STORE_ID = env.VC_STORE_ID; // ID for Vector Store, hentet fra miljøvariabler

const client = new OpenAI({
    apiKey: openai_api_key
});




/** @type {import('./$types').requestHandler} */

export async function POST(request) {
    try {
        const { message, previousResponseId} = await request.request.json();

        const response = await client.responses.create({
            model: "gpt-5.1",
            instructions: saveConfig(),
            input: [
                {
                    role: "user",
                    content: message,
                },
            ],
            tools: [
                {
                    type: "file_search",
                    vector_store_ids: [VC_STORE_ID],
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