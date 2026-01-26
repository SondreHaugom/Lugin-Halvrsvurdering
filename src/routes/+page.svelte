<script>
  // importerer onMount fra svelte
  import { onMount } from "svelte";
  import { selectAgent} from "../lib/selectAgent.js";


    // deklarerer globale variabler
    let chatbox, userInput, sendBtn, resetBtn, toggleBtn, selectBtn;

    // variabel for å spore menyens tilstand
    let isMenuOpen = true;

    // funksjon for å åpne/lukke menyen
    const sidebar = () => {
        isMenuOpen = !isMenuOpen;
    }

    // funksjo|n for å opprette og legge til meldinger i chatboksen
    const createChatMessage = (message, className ) => {
        // oppretter en listeelement for meldingen
        let chatLi = document.createElement("li");

        // legger til riktig klasse basert på om meldingen er fra brukeren eller boten
        chatLi.classList.add(className);

        // legger til et tomt div for meldingsinnholdet
        let content = '';
        // sjekker om meldingen er fra boten eller brukeren og legger til riktig div
        if (className === 'chat_incoming') {
            content = `<div class="bot_message"></div>`;
        } else {
            content = `<div class="user_message"></div>`;
        }
        // legger til innholdet i listeelementet
        chatLi.innerHTML = content;
        // legger til listeelementet i chatboksen
        chatbox.appendChild(chatLi);
        // henter meldingsdiven
        const messageDiv = chatLi.querySelector(className === 'chat_incoming' ? '.bot_message' : '.user_message');

        // setter meldingsinnholdet
        if (className === 'chat_incoming') {
            messageDiv.innerHTML = message;
        } else {
            messageDiv.textContent = message;
        }
        // legger til listeelementet i chatboksen
        chatbox.appendChild(chatLi);
    }


    // funksjon for å sende meldinger og motta svar fra Valgte KI-agent
    function sendtMessage() {

        // henter og skjekker brukerdata fra inputfeltet
        const inputmessage = userInput.value.trim();
        // Skjekker om motat melding er tom
        if (inputmessage === "") return;
        // viser brukerens melding i chatboksen
        createChatMessage(inputmessage, 'chat_outgoing');
        createChatMessage('Genererer respons...', 'chat_incoming');
        
        // henter valgt agent fra dropdown-menyen
        const selectedAgent = selectBtn.value;
        // sender melding til valgt agent og håndterer responsen
        selectAgent(inputmessage, selectedAgent).then((bot_response) => {
            createChatMessage(bot_response, 'chat_incoming', true);
        });
        // tømmer inputfeltet etter sending
        userInput.value = "";
    }




    onMount(() => {
        chatbox = document.querySelector(".chatbox");
        userInput = document.querySelector(".user_input");
        sendBtn = document.querySelector(".sendBtn");
        resetBtn = document.querySelector(".resetBtn");
        toggleBtn = document.querySelector(".sidebar-btn");
        selectBtn = document.querySelector(".select-btn");

        if (sendBtn) {
            sendBtn.addEventListener("click", sendtMessage);
        }

        if (userInput) {
            userInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    sendtMessage();
                }
            })
        }

    }
    );

</script>

<head>
    <title>Lugin</title>
</head>
    <button class="sidebar-btn" title="Åpne/lukk meny" type="button">☰</button>
    <button class="resetBtn" title="Ny Samtale" type="button">⟳</button>
    <div class="sidebar">
        <select class="select-btn" name="" id="">
            <option value="mistralai">MistralAI</option>
            <option value="openai">OpenAI</option>
        </select>
    </div>
    <ul class="chatbox">
        <li class="chat_incoming">

        </li>
    </ul>
    <div class="input-container">
        <input type="text" class="user_input" placeholder="Skriv meldingen din her...">
        <button class="sendBtn" title="Send melding" type="button">➤</button>
    </div>



<style>
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    background-color: #f4f4f4;
    border-right: 1px solid #ccc;
    padding: 10px;
    box-sizing: border-box; 
}
.sidebar-btn {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 1000;
    background-color: #007BFF;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
}
.select-btn {
    width: 100%;
    padding: 10px;
    margin-top: 40px;
    box-sizing: border-box;
}

.chatbox {
    background-color: aqua;
    width: 300px;
    height: 400px;
    margin-left: auto;
    margin-right: auto;
    display: block;
}
.input-container {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
.resetBtn {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;

}

</style>