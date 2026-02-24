import {env} from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import OpenAI from "openai";

const openai_api_key = env.OPENAI_API_KEY;

const client = new OpenAI({
    apiKey: openai_api_key
});


/** @type {import('./$types').requestHandler} */

export async function POST({ request }) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio');

        if (!audioFile) {
            return json({ error: 'No audio file provided.' }, { status: 400 });
        }

        const response = await client.audio.transcriptions.create({
            model: "whisper-1",
            file: audioFile,
            response_format: "json",
        });
        return json({
            transcription: response.text || 'Beklager, ingen transkripsjon mottatt.'
        });
    } catch (error) {
        console.error("Error in OpenAI API call:", error);
        return json({ error: "An error occurred while processing your request." }, { status: 500 });
    }
}