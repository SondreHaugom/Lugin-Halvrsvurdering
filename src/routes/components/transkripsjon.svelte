
<script>
import '$lib/global.css';

export let audioFile = "";

function handleTranscribeClick() {
    console.log("Transkriber-knappen ble trykket!");
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

    top: 10%;
    left: 30%;
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