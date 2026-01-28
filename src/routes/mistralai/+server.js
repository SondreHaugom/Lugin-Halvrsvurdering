import { Mistral } from "@mistralai/mistralai";
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

const client = new Mistral({
    apiKey: env.MISTRAL_API_KEY
});

const tools = [
    {
        type: 'function',
        function: {
            name: 'chuck_norris_joke',
            description: 'Get a random Chuck Norris joke',
            parameters: {
                type: 'object',
                properties: {
                },
                required: [],
            },
        },
    },
];
console.log("Tools defined:", tools);

const chuck_norris_joke = async () => {

    const response = await fetch("https://api.chucknorris.io/jokes/random");
    const joke = await response.json();
    console.log("Joke fetched:", joke);
    return joke.value;
};

export async function POST({ request }) {
    try {
        const { message } = await request.json();
        const conversationHistory = [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message }
        ];

        
        console.log("Message received:", message);

        let response = await client.chat.complete({
            model: "mistral-large-2512",
            messages: conversationHistory,
            tools: tools
        });

        let assistantMessage = response.choices[0].message;

        let toolCalls = assistantMessage.tool_calls || [];

        while (toolCalls.length > 0) {

            conversationHistory.push(assistantMessage);

            for (const toolCall of toolCalls) {
                if (!toolCall.id) {
                    throw new Error("Mistral returned tool_call without id");
                } 

                if (toolCall.function.name === 'chuck_norris_joke') {

                    const toolResult = await chuck_norris_joke();
                    console.log("Tool result:", toolResult);

                    conversationHistory.push({
                        role: 'tool',
                        tool_call_id: toolCall.id,
                        content: toolResult
                    });
                }
            }

            response = await client.chat.complete({
                model: "mistral-large-2512",
                messages: conversationHistory,
                tools: tools
            });
            
            assistantMessage = response.choices[0].message;
            toolCalls = assistantMessage.tool_calls || [];
        }

        // Push final assistant message and return
        conversationHistory.push(assistantMessage);
        
        const finalContent = assistantMessage.content || 'Beklager, ingen respons mottatt.';
        return json({ response: finalContent });
        
    } catch (error) {
        console.error("Error:", error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
