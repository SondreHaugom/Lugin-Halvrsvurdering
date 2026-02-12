<script>
  // importerer onMount fra svelte
  import { onMount } from "svelte";
  import { selectAgent} from "../lib/selectAgent.js";
  import { marked } from 'marked';
  import { md } from "../lib/markdown.js";
  import '$lib/global.css';


    // deklarerer globale variabler
    let chatbox, userInput, sendBtn, resetBtn, toggleBtn, selectBtn;
    let currentAgent = "mistralai"; // Standard agent

    // Store response ID per agent
    let agentResponseIds = {
        'Openai': null,
        'Mistralai': null
    };

    let agentResponseIDHistory = {
        'Openai': [],
        'Mistralai': []
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
            // bruker markdown-funksjonen for å formatere botens svar
            messageDiv.innerHTML = md.render(message);
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
        console.log("Previous Response ID for " + selectedAgent + ": " + previousResponseId);
        
        // sender melding til SelectAgent.js og venter på svar fra utvalgt agent
        selectAgent(inputmessage, selectedAgent, previousResponseId).then((result) => {
            // Lagre ny response ID for denne agenten
            agentResponseIds[selectedAgent] = result.responseId;
            agentResponseIDHistory[selectedAgent].push(result.responseId);
            console.log("Response ID for " + selectedAgent + ": " + result.responseId);
            console.log("Response ID History for " + selectedAgent + ": " + agentResponseIDHistory[selectedAgent]);
            
            
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
                agentResponseIds = {
                    'Openai': null,
                    'Mistralai': null
                };
                agentResponseIDHistory = {
                    'Openai': [],
                    'Mistralai': []
                };
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
   <!-- Pråver å legge inn for samtale historikk-->
        <!--
        <h2>
            Samtale historikk 
        </h2>
    

        <div class="convHistory">
            <ul>
                {#each Object.entries(agentResponseIDHistory) as [agent, responseIds]}
                    <li><strong>{agent}:</strong></li>
                    {#each responseIds as responseId}
                        <li style="margin-left: 20px;">{responseId}</li>
                    {/each}
                {/each}
            </ul>
        </div>
        -->
    </div>

<div class="chatbot_wrapper" class:shifted={isMenuOpen}>
    <div class="current-agent">{currentAgent}</div>
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

 /* Global markdown-styling */
    :global(.bot_message h1), :global(.user_message h1) {
        color: #ffffff;
        margin: 1.2em 0 0.8em 0;
        font-size: 1.5em;
        font-weight: bold;
        border-bottom: 2px solid #f8f8f8;
        padding-bottom: 0.3em;
    }
    
    :global(.bot_message h2), :global(.user_message h2) {
        color: #ffffff;
        margin: 1em 0 0.6em 0;
        font-size: 1.3em;
        font-weight: bold;
    }
    
    :global(.bot_message h3), :global(.user_message h3) {
        color: #ffffff;
        margin: 0.8em 0 0.4em 0;
        font-size: 1.1em;
        font-weight: bold;
    }

    /* Kodeblokker (pre + code) */
    :global(.bot_message pre), :global(.user_message pre) {
        background: #484848;
        color: #ecf0f1;
        padding: 16px 20px;
        border-radius: 8px;
        margin: 12px 0;
        overflow-x: auto;
        font-size: 14px;
        line-height: 1.4;
        border-left: 4px solid #353434;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    }

    /* Inline kode */
    :global(.bot_message code), :global(.user_message code) {
        background: #34495e;
        color: #e74c3c;
        padding: 3px 6px;
        border-radius: 4px;
        font-size: 0.9em;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-weight: 500;
    }

    /* Unngå dobbel styling for kode inne i pre-tagger */
    :global(.bot_message pre code), :global(.user_message pre code) {
        background: transparent;
        color: inherit;
        padding: 0;
        border-radius: 0;
        font-size: inherit;
    }

    /* Tekst-formatting */
    :global(.bot_message strong), :global(.user_message strong) {
        font-weight: bold;
        color: #ffffff;
    }
    
    :global(.bot_message em), :global(.user_message em) {
        font-style: italic;
        color: #ffffff;
    }

    /* Lister */
    :global(.bot_message ul), :global(.user_message ul) {
        margin: 0.8em 0;
        padding-left: 1.5em;
    }
    
    :global(.bot_message ol), :global(.user_message ol) {
        margin: 0.8em 0;
        padding-left: 1.5em;
    }
    
    :global(.bot_message li), :global(.user_message li) {
        margin: 0.3em 0;
        line-height: 1.4;
    }

    /* Avsnitt */
    :global(.bot_message p), :global(.user_message p) {
        margin: 0.8em 0;
        line-height: 1.6;
    }

    /* Sitater */
    :global(.bot_message blockquote), :global(.user_message blockquote) {
        border-left: 4px solid #95a5a6;
        margin: 1em 0;
        padding: 0.5em 1em;
        background: rgba(149, 165, 166, 0.1);
        font-style: italic;
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
h2 {
    padding: 10px;
    font-family: Helvetica, Arial, sans-serif;
}
.convHistory {
    background-color: var(--color-gran-30);
    border-radius: 10px;
    padding: 10px;
    height: 500px;
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
    margin-left: 205px;
    width: calc(99% - 195px);
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