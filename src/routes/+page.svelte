<script>
  import { onMount } from "svelte";


    let chatbox, userInput, sendBtn, resetBtn, toggleBtn;
    let isMenuOpen = true;

    const sidebar = () => {
        isMenuOpen = !isMenuOpen;
    }


    const createChatMessage = (message, className ) => {
        let chatLi = document.createElement("li");

        chatLi.classList.add(className);

        let content = '';
        if (className === 'chat_incoming') {
            content = `<div class="bot_message"></div>`;
        } else {
            content = `<div class="user_message"></div>`;
        }
        chatLi.innerHTML = content;
        chatbox.appendChild(chatLi);

        const messageDiv = chatLi.querySelector(className === 'chat_incoming' ? '.bot_message' : '.user_message');


        if (className === 'chat_incoming') {
            messageDiv.innerHTML = message;
        } else {
            messageDiv.textContent = message;
        }
        chatbox.appendChild(chatLi);
    }


    const sendtMessage = () => {
        const inputmessage = userInput.value.trim();
        if (inputmessage === "") return;
        createChatMessage(inputmessage, 'chat_outgoing');
        createChatMessage('Genererer respons...', 'chat_incoming');
        

        const selectedAgent = toggleBtn.value;

        selectedAgent(inputmessage, selectedAgent).then((bot_response) => {
            createChatMessage(bot_response, 'chat_incoming', true);
        });
        userInput.value = "";
    }




    onMount(() => {
        chatbox = document.querySelector(".chatbox");
        userInput = document.querySelector(".user_input");
        sendBtn = document.querySelector(".sendBtn");
        resetBtn = document.querySelector(".resetBtn");
        toggleBtn = document.querySelector(".sidebar-btn");

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
            <option value="">Menyvalg 1</option>
            <option value="">Menyvalg 2</option>
            <option value="">Menyvalg 3</option>
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