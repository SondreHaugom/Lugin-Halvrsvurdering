import { json } from '@sveltejs/kit';
import { Mistral } from "@mistralai/mistralai";
import { env } from '$env/dynamic/private';

// oppretter klient for MistralAI med API-nøkkel fra miljøvariabler
const client = new Mistral({ apiKey: env.MISTRAL_API_KEY });

// deklarerer verktøy som MistralAI kan bruke, i dette tilfellet en funksjon for å hente en Chuck Norris-vits
const tools = [
  {
    type: "function",
    function: {
      name: "chuck_norris_joke",
      description: "Get a random Chuck Norris joke",
      parameters: { type: "object", properties: {}, required: [] }
    }
  }
];

// Legger til funksjonen som MistralAI bruker for å kjøre funksjonskall når den ønsker å hente en Chuck Norris-vits
const chuck_norris_joke = async () => {
    try {
        const res = await fetch("https://api.chucknorris.io/jokes/random");
        const data = await res.json();
        console.log("Fetched joke from Chuck Norris API:", data.value);
        return data.value;
    } catch {
        return "Could not fetch joke at this time.";
    }
};


// skjekker hvilke type funksjon som blir kalt
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        const { message } = await request.json();
        console.log("Message received on Mistral server:", message);
        
        // Use local messages array for each request to avoid conflicts
        const messages = [
            { role: "system", content: "Du er en hjelpsom assistent. Du ska svare på generelle sprøsmål fra bruker og vis brukeren ber om en vits, skal du svare med funksjonskall og bruke chuck_norris_joke funksjonen " },
            { role: "user", content: message }
        ];

        const response = await client.chat.complete({
            model: "mistral-large-2512",
            messages: messages,
            tools: tools
        });

        // variabel for generelle svar fra assistent
        let assistantMessage = response.choices[0].message;

        // Loop over tool_calls
        while ((assistantMessage.tool_calls || []).length > 0) {
            console.log("Assistant requested tool call:", assistantMessage.tool_calls);
            messages.push(assistantMessage); // push assistant som ba om tool
            for (const tc of assistantMessage.tool_calls) {
                if (tc.function.name === "chuck_norris_joke") {
                    console.log("---> kaller funksjon:", tc.function.name);
                    const joke = await chuck_norris_joke();
                    messages.push({
                        role: "tool",
                        tool_call_id: tc.id,
                        name: tc.function.name,
                        content: joke
                    });
                    console.log("Joke fetched from chuck_norris_joke function:", joke);
                }
            }

            const newResponse = await client.chat.complete({
                model: "mistral-large-2512",
                messages: messages,
                tools: tools
            });
            console.log("Messages", messages)
            console.log("Tools:", tools)
            let assistantMessage = newResponse.choices[0].message;
        }
        console.log("Response from MistralAI:", assistantMessage, "Tools:", chuck_norris_joke());
        return json({ response: assistantMessage.content });
    } catch (error) {
        console.error("Error in Mistral request:", error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
