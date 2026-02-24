export const transcriptionClient = async (audioFile) => {
    let endpoint = '/components/server/Transkripsjon';

    if (!endpoint) {
        console.log("Error: Endpoint for transcription is not defined.");
        return 'Error: Endpoint for transcription is not defined.';
    }

    console.log(`Sending audio file to Transcription endpoint: ${endpoint}`);

    const formData = new FormData();
        formData.append('audio', audioFile);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData // 
        });
        const payload = await response.json();
        return {
            transcription: payload.transcription || 'No transcription found in response.',
        };
    } catch (error) {
        console.error("Error during transcription request:", error);
        return 'Error during transcription request: ' + error.message;
    }
}