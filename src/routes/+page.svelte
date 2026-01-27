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
        createChatMessage(selectBtn.value, 'chat_incoming');
        
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


        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                chatbox.innerHTML = '';
                alert("Ny samtale startet!");
            });
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


<main>
    <img class="logo" src="/src/lib/logo/artificial intelligence - Logo2.png" alt="">
    <button class="sidebar-btn" title="Åpne/lukk meny" on:click={sidebar} type="button">☰</button>
    <button class="resetBtn" title="Ny Samtale" type="button">⟳</button>
    <div class="sidebar" class:open={isMenuOpen}>
        <h1>
            Lugin
        </h1>
        <select class="select-btn" name="" id="">
            <option value="mistralai">MistralAI</option>
            <option value="openai">OpenAI</option>
        </select>
    </div>

<div class="chatbot_wrapper" class:shifted={isMenuOpen}>
    <ul class="chatbox">

        <li class="chat_incoming">

        </li>
        
    </ul>
    <div class="input-container">
        <input type="text" class="user_input" placeholder="Skriv meldingen din her...">
        <button class="sendBtn" title="Send melding" type="button">↑</button>
    </div>
</div>

</main>

<style>

main {
    background-color: var(--color-himmel-10);
    width: 100%;
    height: 100vh;
    overflow-x: hidden;
}
h1 {
    text-align: center;
    font-family: Helvetica, Arial, sans-serif;
    margin-top: 10px;
    margin-bottom: 20px;
}
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(.77,.2,.05,1.0); 
}
.sidebar.open {
    transform: translate(0);
}
.sidebar-btn {
    position: fixed;
    top: 60px;
    left: 10px;
    height: 30px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    background-color: var( --color-gran-30);
    color: black;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.logo {
    position: fixed;
    top: 20px;
    left: 10px;
    height: 30px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1000;

}
.sidebar-btn:hover {
    background-color: var( --color-gran-50);
}
.resetBtn {
    position: fixed;
    margin-top: 90px;
    left: 10px;
    height: 30px;
    width: 30px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    background-color: var( --color-gran-30);
    color: black;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.resetBtn:hover {
    background-color: var( --color-gran-50);
}
.select-btn {
    width: 100%;
    padding: 10px;
    margin-top: 65px;
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    background-color: var(--color-gran-30);
}

.chatbox {
    position: absolute;
    top: 30px;
    left: 30%;
    width: 38%;
    overflow-y: auto;
    max-width: 38%;
    height: 850px;
    z-index: 2000;
    

}

.chatbot_wrapper {
    transition: margin-left 0.4s cubic-bezier(.77,.2,.05,1.0), width 0.4s cubic-bezier(.77,.2,.05,1.0);
    position: absolute;
    top: 10px;
    width: 97.03%;
    max-width: 97.03%;
    height: 98%;
    border-radius: 5px;
    margin-left: 50px;
    display: block;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
}

.chatbot_wrapper.shifted {
    margin-left: 210px;
    width: calc(99% - 200px);
}
.input-container {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
.resetBtn {
    top: 10px;
    right: 10px;
    z-index: 1000;

}

.input-container {
    position: absolute;
    top:92%;
    left: 30%;
    border-style: solid;
    border-width: 1px;
    border-color: #333;
    border-radius: 5px;
    background-color: var(--color-gran-10);
    width: 40%;
    max-width: 40%;
    height: 40px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

}
.user_input {
    width: 90%;
    outline: none;
    border-style: none;

    background-color: var(--color-gran-10);
}
.sendBtn {
    width: 35px;
    height: 35px;
    border-radius: 100%;
    border-style: solid;
    border-width: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 3px;
    margin-left: 25px;
    background-color: var(--color-gran-30);
    transition: background-color 0.3s;
    }
    .sendBtn:hover {
        background-color: var(--color-gran-50);
    }
    :global(.chat_incoming), :global(.chat_outgoing) {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    :global(.user_message) {
        background-color: var(--color-himmel-10);
        text-align: left;
        color: black;
        padding: 10px;
        border-radius: 10px;
        border-bottom-right-radius: 1px;
        margin: 10px;
        width: auto;
        max-width: 60%;
        align-self: flex-end;
        display: block;
        margin-left: auto;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    :global(.bot_message) {
        color: black;
        padding: 10px;
        border-radius: 10px;
        margin: 10px;
        max-width: 60%;
        align-self: flex-start;
        display: block;
        margin-right: auto;
    }


</style>