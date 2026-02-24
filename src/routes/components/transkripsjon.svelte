
<script>
import '$lib/global.css';
import { transcriptionClient } from '$lib/transcriptionClient.js';
export let audioFile = "";

function handleTranscribeClick() {

    console.log("Transkriber-knappen ble trykket!");

    if(audioFile && audioFile.length > 0) {
        transcriptionClient(audioFile[0]).then((transcribedText) => {
            const resultDiv = document.querySelector('.result');
            resultDiv.textContent = transcribedText.transcription;
            console.log("Transkripsjon fullført:", transcribedText);
        }).catch((error) => {
            console.error("Feil under transkripsjon:", error);
            alert("Det skjedde en feil under transkripsjonen. Prøv igjen senere.");
        });
    } else {
        alert("Velg en lydfil først!");
    }
}
</script>

<main>
    <div class="transkripsjon_section">
            <input class="audioFile" type="file" accept="audio/*" id="audioInput"  bind:files={audioFile}/>
            <div class="result">
                <p>Transkribert tekst vil vises her...</p>
            </div>
            <button class="transcribeBtn" title="Transkriber" type="button" on:click={handleTranscribeClick}>Transkriber</button>
    </div>
</main>

<style>
.transkripsjon_section {
    margin-top: 70px;
    margin-left: auto;
    margin-right: auto;
    display: block;
    width: 40%;
    padding: 20px;
    background-color: var(--color-himmel-10);
    border: 1px solid var(--color-stein-50);
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.result {
    margin-top: 20px;
    padding: 15px;
    background-color: white;
    border: 1px solid var(--color-stein-50);
    border-radius: 5px;
    min-height: 100px;
    font-size: 14px;
    color: var(--color-stein-80);
}  
</style>