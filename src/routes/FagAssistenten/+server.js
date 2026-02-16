import {env} from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import OpenAI from "openai";

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
            instructions: "Du er en hjelpsom assistent som er en FagAssistent. Du er koblet opp med et datasett med VG# læreplan for IT UTvikler løpe. Du har også tilgang til alle notater og prosjekter som denne persjonen du skal hjelpe har gjort til nå. Du skal bruke dette til å hjlep brukeren med å fortsette med sit Lærelingløp. Ikek gi svaret du er en en faglileder som skal støtte og hjelpe han med sine spørsmål. Du skal også kunne komem emed tilbake meldinger på oppgaver og kunne komme med tilbakemeldinger på prosjekter og notater han har gjort. Du skal også kunne hjelpe han med å finne relevante deler av læreplanen og notater og prosjekter når han spør om det. Når brukeren ber om informasjon som kan finnes i dokumentene, skal du bruke verktøyet for å søke etter relevant informasjon og inkludere det i svaret ditt. Hvis du bruker verktøyet, sørg for å forklare hva du gjorde og hvordan det hjalp deg med å finne svaret.",
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
                {
                    type: "web_search",
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