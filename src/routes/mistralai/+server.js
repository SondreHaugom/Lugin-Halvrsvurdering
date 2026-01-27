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
                    transactionId: {
                        type: 'string',
                        description: 'The ID of the transaction'
                    }
                },
                required: ['transactionId']
            }
        }
    }
];

const chuck_norris_joke = async (transactionId) => {
    if (!transactionId) throw new Error("transactionId is required");

    const response = await fetch("https://api.chucknorris.io/jokes/random");
    const joke = await response.json();
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

        conversationHistory.push({ role: "user", content: message });

        let response = await client.chat.complete({
            model: "mistral-large-2512",
            messages: conversationHistory,
            tools: tools
        });

        let assistantMessage = response.choices[0].message;

        while (assistantMessage.toolCalls?.length) {
            for (const toolCall of assistantMessage.toolCalls) {
                if (toolCall.function.name === 'chuck_norris_joke') {
                    const args = JSON.parse(toolCall.function.arguments);

                    const toolResult = await chuck_norris_joke(args.transactionId);

                    conversationHistory.push({
                        role: 'tool',
                        tool_call_id: toolCall.id,
                        name: toolCall.function.name,
                        content: toolResult
                    });
                }
            }

            response = await client.chat.complete({
                model: "mistral-large-2512",
                messages: conversationHistory,
                tools
            });

            assistantMessage = response.choices[0].message;
        }

        conversationHistory.push({
            role: "assistant",
            content: assistantMessage.content
        });
        const finalContent =
         assistantMessage.content ?? 'Agenten fullførte uten tekstlig svar.';

return json({ response: finalContent });

    } catch (error) {
        console.error("Error:", error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
