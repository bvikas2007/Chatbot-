const input = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat-box");
const mainContainer = document.querySelector(".main-container");


// =====================================================
// SHOW CHAT MODE
// =====================================================

function startChat() {

    mainContainer.classList.add("chat-started");
}


// =====================================================
// SEND MESSAGE
// =====================================================

async function sendMessage() {

    const message = input.value.trim();


    // Don't send empty messages
    if (!message) {
        return;
    }


    // Switch to chat interface
    startChat();


    // Show user's message
    addMessage(message, "user");


    // Clear input
    input.value = "";


    // Disable send button while waiting
    sendButton.disabled = true;

    sendButton.textContent = "⋯";


    try {

        const response = await fetch(
            "http://localhost:3000/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );


        // Check if backend returned an error
        if (!response.ok) {
            throw new Error("Server error");
        }


        // Convert response into JavaScript object
        const data = await response.json();


        // Show AI response
        addMessage(data.reply, "ai");


    } catch (error) {

        console.error(error);


        addMessage(
            "Something went wrong. Please try again.",
            "ai"
        );


    } finally {

        // Enable button again
        sendButton.disabled = false;

        sendButton.textContent = "➤";
    }
}


// =====================================================
// ADD MESSAGE TO CHAT
// =====================================================

function addMessage(message, sender) {

    const messageElement =
        document.createElement("div");


    messageElement.classList.add(
        "message",
        sender
    );


    messageElement.textContent = message;


    chatBox.appendChild(messageElement);


    // Automatically scroll to newest message
    chatBox.scrollTop = chatBox.scrollHeight;
}


// =====================================================
// SEND BUTTON
// =====================================================

sendButton.addEventListener(
    "click",
    sendMessage
);


// =====================================================
// TYPING BEHAVIOR
// =====================================================

input.addEventListener("input", () => {

    /*
       As soon as the user starts typing,
       remove the welcome screen.
    */

    if (input.value.trim() !== "") {

        startChat();

    }
});


// =====================================================
// ENTER KEY
// =====================================================

input.addEventListener("keydown", (event) => {

    /*
       Enter = send
       Shift + Enter = new line
    */

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();
    }
});