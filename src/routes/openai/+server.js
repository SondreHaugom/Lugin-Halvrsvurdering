import {env} from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import OpenAI from "openai";

const openai_api_key = env.OPENAI_API_KEY;

const client = new OpenAI({
    apiKey: openai_api_key
});

