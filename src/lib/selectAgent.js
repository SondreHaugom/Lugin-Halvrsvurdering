export const selectAgent = async (message, agentType) => {
    let endpoint = '/mistralai';
    if (agentType === 'openai') endpoint = '/openai';

    console.log(`Sending message to ${agentType} endpoint:`);

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    })

    const payload = await response.json();

    const raw = payload.response ??
        payload.choices?.[0]?.message?.content ?? '';
    console.log('Extracted raw value:', raw);
    return raw || 'Beklager, ingen respons mottatt.';
}