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
        console.log("Incoming message:", message);

        const conversationHistory = [
            {
                role: "system",
                content: "You are a helpful assistant. WHENEVER the user asks for a joke, ALWAYS use the chuck_norris_joke function to get a Chuck Norris joke."
            },
            { role: "user", content: message }
        ];

        let response = await client.chat.complete({
            model: "mistral-large-2512",
            messages: conversationHistory,
            tools: tools
        });

        let assistantMessage = response.choices[0].message;
        let toolCalls = assistantMessage.toolCalls || [];

        while (toolCalls.length > 0) {
            conversationHistory.push(assistantMessage);

            for (const toolCall of toolCalls) {
                if (toolCall.function.name === 'chuck_norris_joke') {
                    const toolResult = await chuck_norris_joke();
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

        conversationHistory.push(assistantMessage);
        const finalContent = assistantMessage.content || 'No response received.';
        return json({ response: finalContent });

    } catch (error) {
        console.error("Error:", error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

