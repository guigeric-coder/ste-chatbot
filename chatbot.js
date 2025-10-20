/*
  chatbot.js - STE Construction
  Version Greg (GPT-4 + avatar + sons + animation + bulle d’accueil + réflexion)
*/

(function () {
  const API_URL = "https://ste-chatbot.onrender.com/api/chatbot";
  const logoUrl = "https://www.ste-construction.fr/wp-content/uploads/logo-ste.png";
  const gregAvatar = "https://www.ste-construction.fr/wp-content/uploads/2025/10/greg-avatar.png"; // mets ici ton image générée
  const signatureText = "Greg – Assistant STE Construction 🏗️";

  // === SONS ===
  const audioOpen = new Audio("https://www.ste-construction.fr/wp-content/uploads/2025/10/ping.mp3");
  const audioBot = new Audio("https://www.ste-construction.fr/wp-content/uploads/2025/10/pop.mp3");
  const audioUser = new Audio("https://www.ste-construction.fr/wp-content/uploads/2025/10/not.mp3");
  const safePlay = (a) => { try { a.currentTime = 0; a.play().catch(()=>{}); } catch {} };

  // === CSS ===
  const css = `
  @keyframes ste-slide-in {0%{transform:scale(0.8) translateY(40px);opacity:0;}100%{transform:scale(1) translateY(0);opacity:1;}}
  @keyframes ste-slide-out{0%{transform:scale(1) translateY(0);opacity:1;}100%{transform:scale(0.8) translateY(40px);opacity:0;}}
  @keyframes bubble-fade-in {0%{transform:translateY(10px);opacity:0;}100%{transform:translateY(0);opacity:1;}}
  @keyframes thinking {0%,80%,100%{transform:scale(1);}40%{transform:scale(1.3);}}

  #ste-chat-window{position:fixed;bottom:100px;right:25px;width:340px;max-width:calc(100% - 50px);background:#fff;border-radius:15px;
    box-shadow:0 8px 30px rgba(0,0,0,0.25);display:none;flex-direction:column;overflow:hidden;z-index:999999;transform-origin:bottom right;}
  #ste-chat-window.show{display:flex;animation:ste-slide-in .35s ease forwards;}
  #ste-chat-window.hide{animation:ste-slide-out .25s ease forwards;}
  #ste-chat-header{background:#004aad;color:#fff;padding:12px;font-weight:bold;display:flex;align-items:center;gap:8px;}
  #ste-chat-header img{height:28px;width:auto;}
  #ste-chat-content{padding:12px;max-height:320px;overflow-y:auto;font-size:14px;color:#222;background:#fff;}
  .ste-msg{display:flex;align-items:flex-start;margin-bottom:10px;line-height:1.4;}
  .ste-msg.bot img{width:34px;height:34px;border-radius:50%;margin-right:8px;}
  .ste-msg.user{text-align:right;justify-content:flex-end;}
  .ste-msg.user .bubble{background:#004aad;color:#fff;}
  .ste-msg .bubble{display:inline-block;padding:8px 12px;border-radius:12px;max-width:80%;}
  .ste-msg.bot .bubble{background:#f1f5fb;color:#111;}
  .thinking-dots{display:inline-block;width:30px;text-align:center;}
  .thinking-dots span{display:inline-block;width:6px;height:6px;margin:0 1px;background:#004aad;border-radius:50%;animation:thinking 1.4s infinite ease-in-out both;}
  .thinking-dots span:nth-child(2){animation-delay:-0.16s;} .thinking-dots span:nth-child(3){animation-delay:-0.32s;}

  #ste-chat-input-area{display:flex;gap:8px;padding:12px;border-top:1px solid #eee;background:#fafafa;}
  #ste-chat-input{flex:1;padding:10px 12px;border-radius:8px;border:1px solid #ddd;}
  #ste-chat-send{background:#004aad;color:#fff;border:none;padding:10px 14px;border-radius:8px;cursor:pointer;}
  #ste-chat-send:hover{opacity:0.95;}
  #ste-chat-button{position:fixed;bottom:25px;right:25px;background:#004aad;color:#fff;border:none;border-radius:50%;width:60px;height:60px;font-size:28px;
    cursor:pointer;box-shadow:0 8px 18px rgba(0,0,0,0.25);z-index:999999;transition:transform .15s ease;}
  #ste-chat-button:hover{transform:scale(1.1);}
  #ste-chat-signature{font-size:12px;color:#666;padding:8px 12px;background:#fff;text-align:center;}
  #ste-chat-welcome{position:fixed;bottom:95px;right:95px;background:#004aad;color:#fff;padding:10px 14px;border-radius:16px;font-size:14px;
    box-shadow:0 5px 15px rgba(0,0,0,0.25);opacity:0;animation:bubble-fade-in .5s ease forwards;z-index:999998;cursor:pointer;user-select:none;}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // === HTML ===
  const root = document.createElement("div");
  root.id = "ste-chatbot-root";
  root.innerHTML = `
    <div id="ste-chat-window">
      <div id="ste-chat-header">
        <img src="${logoUrl}" alt="STE Construction"/>
        <div>Greg – Assistant STE Construction</div>
      </div>
      <div id="ste-chat-content">
        <div class="ste-msg bot">
          <img src="${gregAvatar}" alt="Greg"/>
          <div class="bubble">Bonjour 👋 Je suis Greg, l’assistant de STE Construction. Comment puis-je vous aider aujourd’hui ?</div>
        </div>
      </div>
      <div id="ste-chat-input-area">
        <input id="ste-chat-input" type="text" placeholder="Tapez votre question ici..."/>
        <button id="ste-chat-send">Envoyer</button>
      </div>
      <div id="ste-chat-signature">${signatureText}</div>
    </div>
    <button id="ste-chat-button">💬</button>`;
  document.body.appendChild(root);

  const chatButton = document.getElementById("ste-chat-button");
  const chatWindow = document.getElementById("ste-chat-window");
  const chatContent = document.getElementById("ste-chat-content");
  const chatInput = document.getElementById("ste-chat-input");
  const chatSend = document.getElementById("ste-chat-send");

  // === MESSAGES ===
  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `ste-msg ${sender}`;
    if (sender === "bot") {
      msg.innerHTML = `<img src="${gregAvatar}" alt="Greg"/><div class="bubble">${text}</div>`;
    } else {
      msg.innerHTML = `<div class="bubble">${text}</div>`;
    }
    chatContent.appendChild(msg);
    chatContent.scrollTop = chatContent.scrollHeight;
  }

  // === ENVOI MESSAGE ===
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage("user", text);
    safePlay(audioUser);
    chatInput.value = "";

    const loading = document.createElement("div");
    loading.className = "ste-msg bot";
    loading.innerHTML = `<img src="${gregAvatar}" alt="Greg"/><div class="bubble"><div class="thinking-dots"><span></span><span></span><span></span></div></div>`;
    chatContent.appendChild(loading);
    chatContent.scrollTop = chatContent.scrollHeight;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text })
      });
      const data = await response.json();
      loading.querySelector(".bubble").innerText = data.answer;
      safePlay(audioBot);
    } catch {
      loading.querySelector(".bubble").innerText =
        "❌ Désolé, une erreur est survenue. Vous pouvez me joindre au 01 23 45 67 89.";
    }
  }

  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => e.key === "Enter" && sendMessage());
  chatButton.addEventListener("click", () => {
    const visible = chatWindow.classList.contains("show");
    if (visible) {
      chatWindow.classList.remove("show");
      chatWindow.classList.add("hide");
      setTimeout(() => (chatWindow.style.display = "none"), 250);
    } else {
      chatWindow.classList.remove("hide");
      chatWindow.style.display = "flex";
      setTimeout(() => chatWindow.classList.add("show"), 10);
      safePlay(audioOpen);
    }
  });

  // === BULLE D’ACCUEIL ===
  setTimeout(() => {
    if (document.getElementById("ste-chat-welcome")) return;
    const bubble = document.createElement("div");
    bubble.id = "ste-chat-welcome";
    bubble.textContent = "👋 Bonjour ! Je suis Greg de STE Construction.";
    bubble.onclick = () => {
      chatButton.click();
      bubble.remove();
    };
    document.body.appendChild(bubble);
    safePlay(audioOpen);
    setTimeout(() => bubble.remove(), 7000);
  }, 5000);
})();
