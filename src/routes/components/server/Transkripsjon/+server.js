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
        const {audioFile} = await request.request.json();

        const response = await client.audio.transcriptions.create({
            file: audioFile,
            model: "gpt-4o-transcribe",

        });
        return json({
            transcription: output_text || 'Beklager, ingen transkripsjon mottatt.'
        });
    } catch (error) {
        console.error("Error in OpenAI API call:", error);
        return json({ error: "An error occurred while processing your request." }, { status: 500 });
    }
}