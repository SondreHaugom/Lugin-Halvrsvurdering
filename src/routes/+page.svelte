<script>
  import { onMount } from "svelte";

    let chatbox, userInput, sendBtn, resetBtn, toggleBtn;
    let isMenuOpen = true;

    const sidebar = () => {
        isMenuOpen = !isMenuOpen;
    }



    const sendtMessage = () => {
        const inputmessage = userInput.value.trim();
        if (inputMessage === "") return;
    }




    onMount(() => {
        chatbox = document.querySelector(".chatbox");
        userInput = document.querySelector(".user_input");
        sendBtn = document.querySelector(".sendBtn");
        resetBtn = document.querySelector(".resetBtn");
        toggleBtn = document.querySelector(".sidebar-btn");

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

    <div class="chatbox">
        <h2>Chat with us!</h2>
        <div class="messages">
            <!-- Messages will appear here -->
        </div>
        <input type="text" class="user_input" placeholder="Type your message..." />
        <button class="sendBtn">Send</button>
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
.resetBtn {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;

}

</style>