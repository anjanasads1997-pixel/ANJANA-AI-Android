

/* ==========================================
   ANJANA AI - Android Assistant
   Main Application Script
   ========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  console.log("ANJANA AI initialized");

  // ------------------------------------------
  // Chat Interface
  // ------------------------------------------

  const chatInput = document.getElementById("chatInput");
  const sendButton = document.getElementById("sendButton");
  const chatMessages = document.getElementById("chatMessages");

  // Create interface if HTML elements are missing
  if (!chatInput || !sendButton || !chatMessages) {
    console.warn("ANJANA AI chat interface is not connected.");
    return;
  }

  // ------------------------------------------
  // Display Chat Messages
  // ------------------------------------------

  function addMessage(text, sender) {
    const message = document.createElement("div");

    message.className = "message " + sender;
    message.textContent = text;

    chatMessages.appendChild(message);

    chatMessages.scrollTop =
      chatMessages.scrollHeight;

    return message;
  }

  // ------------------------------------------
  // Send Message to AI Backend
  // ------------------------------------------

  async function sendMessage() {
    const text = chatInput.value.trim();

    if (!text) return;

    addMessage(text, "user");

    chatInput.value = "";
    sendButton.disabled = true;

    const loadingMessage =
      addMessage("ANJANA AI is thinking...", "assistant");

    try {

      /*
       * Connect this endpoint to your
       * ANJANA AI backend.
       *
       * Keep API keys on the backend.
       */

      const response = await fetch(
        "/v1/chat/completions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            model: "anjana-ai",
            messages: [
              {
                role: "user",
                content: text
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          "AI server error: " + response.status
        );
      }

      const data = await response.json();

      const answer =
        data.choices?.[0]?.message?.content ||
        data.reply ||
        "No response received.";

      loadingMessage.textContent = answer;

    } catch (error) {

      console.error("ANJANA AI error:", error);

      loadingMessage.textContent =
        "AI server connection failed. Please check your backend.";

    } finally {

      sendButton.disabled = false;
      chatInput.focus();

    }
  }

  // ------------------------------------------
  // Send Button
  // ------------------------------------------

  sendButton.addEventListener("click", sendMessage);

  // ------------------------------------------
  // Enter Key
  // ------------------------------------------

  chatInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }

  });

  // ------------------------------------------
  // Voice Recognition
  // ------------------------------------------

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  let recognition = null;

  if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "si-LK";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {

      const transcript =
        event.results[0][0].transcript;

      chatInput.value = transcript;

      sendMessage();

    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
    };

  }

  // ------------------------------------------
  // Voice Button
  // ------------------------------------------

  const voiceButton = document.getElementById("voiceButton");

  if (voiceButton && recognition) {

    voiceButton.addEventListener("click", () => {

      try {
        recognition.start();
      } catch (error) {
        console.log("Voice recognition already active.");
      }

    });

  }

  // ------------------------------------------
  // Text To Speech
  // ------------------------------------------

  function speakText(text) {

    if (!("speechSynthesis" in window)) {
      return;
    }

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.lang = "si-LK";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);

  }

  // ------------------------------------------
  // Global Voice Function
  // ------------------------------------------

  window.ANJANA_AI = {
    sendMessage,
    addMessage,
    speakText
  };

  console.log("ANJANA AI ready");

});
