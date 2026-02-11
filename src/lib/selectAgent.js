

export const selectAgent = async (message, agentType, previousResponseId = null) => {
    let endpoint = '/Mistralai';
    if (agentType === 'Openai') endpoint = '/Openai';

    if (!agentType) {
        console.error('Agent type is not specified.');
        return {response: 'Error: Agent type is not specified.', responseId: null};
    }

    console.log(`Sending message to ${agentType} endpoint:`);


    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            message: message, 
            previousResponseId: previousResponseId
        })
    });

    const payload = await response.json();

    const raw = payload.response ??
        payload.choices?.[0]?.message?.content ?? '';

    // Returner både svar og response ID
    return {
        response: raw || 'Beklager, ingen respons mottatt.',
        responseId: payload.responseId
    };
}