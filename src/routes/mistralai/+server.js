import { json } from '@sveltejs/kit';
import { Mistral } from "@mistralai/mistralai";
import { env } from '$env/dynamic/private';

const client = new Mistral({ apiKey: env.MISTRAL_API_KEY });


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

const chuck_norris_joke = async () => {
    try {
        const res = await fetch("https://api.chucknorris.io/jokes/random");
        const data = await res.json();
        return data.value;
    } catch {
        return "Could not fetch joke at this time.";
    }
};



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

        });

        let assistantMessage = response.choices[0].message;

        // Loop over tool_calls
        while ((assistantMessage.toolCalls || []).length > 0) {
            messages.push(assistantMessage); // push assistant som ba om tool
            for (const tc of assistantMessage.toolCalls) {
                if (tc.function.name === "chuck_norris_joke") {
                    console.log("---> kaller funksjon:", tc.function.name);
                    const joke = await chuck_norris_joke();
                    messages.push({
                        role: "tool",
                        tool_call_id: tc.id,
                        name: tc.function.name,
                        content: joke
                    });
                }
            }

            response = await client.chat.complete({
                model: "mistral-large-2512",
                messages: messages,
                tools: tools
            });
            assistantMessage = response.choices[0].message;
            
        }
        console.log("Response from MistralAI:", assistantMessage);
        return json({ response: assistantMessage.content });
    } catch (error) {
        console.error("Error in Mistral request:", error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
