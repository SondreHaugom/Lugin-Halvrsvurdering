<script>
  // importerer onMount fra svelte
  import { onMount } from "svelte";
  import { selectAgent} from "../lib/selectAgent.js";


    // deklarerer globale variabler
    let chatbox, userInput, sendBtn, resetBtn, toggleBtn, selectBtn;
    let currentAgent = "mistralai"; // Standard agent

    // Lagre response ID per agent
    let agentResponseIds = {
        'Openai': null,
        'Mistralai': null
    };

    // variabel for å spore menyens tilstand
    let isMenuOpen = true;

    // vis menyen basert på skjermstørrelse
    if (typeof window !== 'undefined' && window.innerWidth < 600) {
        isMenuOpen = false;
    }

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
        // henter tidligere response ID for denne agenten
        const previousResponseId = agentResponseIds[selectedAgent];
        
        // sender melding til SelectAgent.js og venter på svar fra utvalgt agent
        selectAgent(inputmessage, selectedAgent, previousResponseId).then((result) => {
            // Lagre ny response ID for denne agenten
            agentResponseIds[selectedAgent] = result.responseId;
            
            createChatMessage(result.response, 'chat_incoming', true);
        });
        // tømmer inputfeltet etter sending
        userInput.value = "";
    }


    onMount((async () => {
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

        if (selectBtn) {
            selectBtn.addEventListener("change", () => {
                currentAgent = selectBtn.value;
            });
        }

    }
    ));

</script>

<head>

    <title>Lugin</title>
</head>


<main>
    <img class="logo" title="Lugin" src="/src/lib/logo/artificial intelligence - Logo2.png" alt="">
    <button class="sidebar-btn" title="Åpne/lukk meny" on:click={sidebar} type="button">☰</button>
    <button class="resetBtn" title="Ny Samtale" type="button">⟳</button>
    <div class="sidebar" class:open={isMenuOpen}>
        <h1>
            Lugin
        </h1>
        <select title="Velg agent" class="select-btn" name="" id="">
            <option value="Mistralai">MistralAI</option>
            <option value="Openai">OpenAI</option>
        </select>
    </div>

<div class="chatbot_wrapper" class:shifted={isMenuOpen}>
    <ul class="chatbox">
        <div class="current-agent">{currentAgent}</div>
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

:root {
  --color-fjord: #14828C;
  --color-fjord-10: #E7F2F3;
  --color-fjord-20: #D0E6E8;
  --color-fjord-30: #B8D9DC;
  --color-fjord-40: #A1CDD1;
  --color-fjord-50: #89C0C5;
  --color-fjord-60: #72B4BA;
  --color-fjord-70: #5AA7AE;
  --color-fjord-80: #439BA3;
  --color-fjord-90: #2B8E97;

  --color-himmel: #009BC2;
  --color-himmel-10: #E5F5F9;
  --color-himmel-20: #CCEBF3;
  --color-himmel-30: #B2E1ED;
  --color-himmel-40: #99D7E7;
  --color-himmel-50: #80CDE0;
  --color-himmel-60: #66C3DA;
  --color-himmel-70: #4CB9D4;
  --color-himmel-80: #33AFCE;
  --color-himmel-90: #19A5C8;

  --color-gress: #1F9562;
  --color-gress-10: #E9F4EF;
  --color-gress-20: #D2EAE0;
  --color-gress-30: #BCDFD0;
  --color-gress-40: #A5D5C0;
  --color-gress-50: #8FCAB0;
  --color-gress-60: #79BFA1;
  --color-gress-70: #62B591;
  --color-gress-80: #4CAA81;
  --color-gress-90: #35A072;

  --color-gran: #2F7542;
  --color-gran-10: #EAF1EC;
  --color-gran-20: #D5E3D9;
  --color-gran-30: #C1D6C6;
  --color-gran-40: #ACC8B3;
  --color-gran-50: #97BAA0;
  --color-gran-60: #82AC8E;
  --color-gran-70: #6D9E7B;
  --color-gran-80: #599168;
  --color-gran-90: #448355;

  --color-korn: #A5983A;
  --color-korn-10: #F6F5EB;
  --color-korn-20: #EDEAD8;
  --color-korn-30: #E4E0C4;
  --color-korn-40: #DBD6B0;
  --color-korn-50: #D2CB9C;
  --color-korn-60: #C9C189;
  --color-korn-70: #C0B775;
  --color-korn-80: #B7AD61;
  --color-korn-90: #AEA24E;

  --color-stein: #7B7B7A;
  --color-stein-10: #F2F2F2;
  --color-stein-20: #E5E5E4;
  --color-stein-30: #D7D7D7;
  --color-stein-40: #CACACA;
  --color-stein-50: #BDBDBC;
  --color-stein-60: #B0B0AF;
  --color-stein-70: #A3A3A2;
  --color-stein-80: #959595;
  --color-stein-90: #888887;

  --color-berg: #727062;
  --color-berg-10: #F1F1EF;
  --color-berg-20: #E3E2E0;
  --color-berg-30: #D5D4D0;
  --color-berg-40: #C7C6C0;
  --color-berg-50: #B8B7B0;
  --color-berg-60: #AAA9A1;
  --color-berg-70: #9C9B91;
  --color-berg-80: #8E8D81;
  --color-berg-90: #807E72;

  --color-strand: #8A6C3E;
  --color-strand-10: #F3F0EC;
  --color-strand-20: #E8E2D8;
  --color-strand-30: #DCD3C5;
  --color-strand-40: #D0C4B2;
  --color-strand-50: #C4B59E;
  --color-strand-60: #B9A78B;
  --color-strand-70: #AD9878;
  --color-strand-80: #A18965;
  --color-strand-90: #967B51;

  --color-siv: #BC7726;
  --color-siv-10: #F8F1E9;
  --color-siv-20: #F2E4D4;
  --color-siv-30: #EBD6BE;
  --color-siv-40: #E4C9A8;
  --color-siv-50: #DDBB92;
  --color-siv-60: #D7AD7D;
  --color-siv-70: #D0A067;
  --color-siv-80: #C99251;
  --color-siv-90: #C3853C;

  --color-bark: #996954;
  --color-bark-10: #F5F0EE;
  --color-bark-20: #EBE1DD;
  --color-bark-30: #E0D2CC;
  --color-bark-40: #D6C3BB;
  --color-bark-50: #CCB4A9;
  --color-bark-60: #C2A598;
  --color-bark-70: #B89687;
  --color-bark-80: #AD8776;
  --color-bark-90: #A37865;

  --color-nype: #B7173D;
  --color-nype-10: #F8E8EC;
  --color-nype-20: #F1D1D8;
  --color-nype-30: #E9B9C5;
  --color-nype-40: #E2A2B1;
  --color-nype-50: #DB8B9E;
  --color-nype-60: #D4748B;
  --color-nype-70: #CD5D77;
  --color-nype-80: #C54564;
  --color-nype-90: #BE2E50;

  --color-plomme: #5A2E61;
  --color-plomme-10: #EEEAEF;
  --color-plomme-20: #DED5DF;
  --color-plomme-30: #CDC0D0;
  --color-plomme-40: #BDABC0;
  --color-plomme-50: #AC96B0;
  --color-plomme-60: #9C82A0;
  --color-plomme-70: #8B6D90;
  --color-plomme-80: #7B5881;
  --color-plomme-90: #6A4371;

  --color-blaveis: #414681;
  --color-blaveis-10: #ECECF2;
  --color-blaveis-20: #D9DAE6;
  --color-blaveis-30: #C6C7D9;
  --color-blaveis-40: #B3B5CD;
  --color-blaveis-50: #A0A2C0;
  --color-blaveis-60: #8D90B3;
  --color-blaveis-70: #7A7DA7;
  --color-blaveis-80: #676B9A;
  --color-blaveis-90: #54588E;
}

main {
    background-color: var(--color-fjord-10);
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
    margin-top: 100px;
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
    left: 27%;
    width: 47.5%;
    overflow-y: auto;
    max-width: 50%;
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
    border-radius: 10px;
    border-style: solid;
    border-width: 1px;
    border-color: var(--color-stein-50);
    margin-left: 50px;
    display: block;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
}

.chatbot_wrapper.shifted {
    margin-left: 255px;
    width: calc(99% - 245px);
}
.input-container {
    position: absolute;
    top:92%;
    left: 27%;
    border-style: solid;
    border-width: 1px;
    border-color: var(--color-stein-50);
    border-radius: 20px;
    background-color: var(--color-himmel-10);
    width: 50%;
    max-width: 50%;
    height: 50px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    display: flex;
    align-items: center;
}
.user_input {
    width: 92%;
    margin-left: 5px;
    outline: none;
    border-style: solid;
    border-color: var(--color-stein-50);
    border-width: 1px;
    border-radius: 13px;
    padding: 10px;
    font-size: 16px;
    cursor: text;
    pointer-events: auto;
    z-index: 10000;
    position: relative;
    background-color: white;
    transition: box-shadow 0.3s;
}
.user_input:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

}
.sendBtn {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    border-style: solid;
    border-color: var(--color-stein-50);
    border-width: 1px;
    margin-left: 8px;
    margin-right: 8px;
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
        max-width: 40%;
        align-self: flex-end;
        display: block;
        margin-left: auto;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
    :global(.bot_message) {
        color: black;
        padding: 10px;
        margin: 10px;
        max-width: 60%;
        align-self: flex-end;
        display: block;
}

    .current-agent {
        background-color: var(  --color-himmel-10);
        width: 25%;
        text-align: center;
        font-size: 17px;
        border-radius: 5px;
        border-top-left-radius: 1px;
        border-top-right-radius: 1px;
        border-style: solid;
        border-width: 1px;
        border-color: #333;
        margin-left: auto;
        margin-right: auto;
        display: block;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


    @media (min-width: 300px) and (max-width: 600px) {
        .chatbox {
            left: 21%;
            max-height: 80%;
            max-width: 70%;
            overflow-y: auto;


        }
        .input-container {
            left: 5%;
            height: 40px;
            width: 90%;
            max-width: 90%;
        }
        .user_input {
            width: 85%;
            right: 3px;
            font-size: 14px;
        }
        .chatbot_wrapper {
            width: 85%;
        }
        .chatbot_wrapper.shifted {
            margin-left: 510px;
            width: calc(99% - 200px);
        }
        .current-agent {
            width: 50%;
        }
        .sendBtn {
            width: 30px;
            height: 30px; 
            margin-right: 2px;         
        }
         :global(.user_message) {
            font-size: 12px;
            margin-left: 50%;
        }  
        :global(.bot_message) {
            position: absolute;
            right: 80px;
            top: 80px;

    
        } 
}

@media (min-width: 601px) and (max-width: 1200px) {
            .chatbox {
            left: 21%;
            max-height: 80%;
            max-width: 70%;
            overflow-y: auto;


        }
        .input-container {
            left: 5%;
            height: 40px;
            width: 90%;
            max-width: 90%;
        }
        .user_input {
            width: 85%;
            right: 3px;
            font-size: 14px;
        }
        .chatbot_wrapper {
            width: 92%;
        }
        .chatbot_wrapper.shifted {
            margin-left: 200px;
            width: calc(99% - 200px);
        }
        .current-agent {
            width: 50%;
        }
        .sendBtn {
            width: 30px;
            height: 30px; 
            margin-right: 2px;         
        }
         :global(.user_message) {
            font-size: 12px;
            margin-left: 50%;
        }  
        :global(.bot_message) {
            position: absolute;
            right: 80px;
            top: 80px;

    
        } 
}
</style>