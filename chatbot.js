(function() {
  // === CONFIG ===
  const logoUrl = "https://ste-construction.fr/wp-content/uploads/logo-ste.png"; // logo
  const signatureText = "STE Construction – Votre partenaire confiance en région parisienne 🏗️";

  // === API Render ===
  const API_URL = "https://ste-chatbot.onrender.com/api/chatbot"; // 💡 remplace ici par ton vrai lien Render

  // === HTML ===
  const root = document.createElement("div");
  root.innerHTML = `
    <style>
      #ste-chatbot-root{font-family:Arial,sans-serif;}
      #ste-chat-window{position:fixed;bottom:100px;right:25px;width:340px;background:#fff;border-radius:15px;box-shadow:0 8px 30px rgba(0,0,0,0.25);display:none;flex-direction:column;overflow:hidden;z-index:999999;}
      #ste-chat-header{background:#004aad;color:white;padding:12px;font-weight:bold;display:flex;align-items:center;gap:8px;}
      #ste-chat-header img{height:28px;width:auto;}
      #ste-chat-content{padding:12px;max-height:320px;overflow-y:auto;font-size:14px;color:#222;background:#fff;}
      .ste-msg{margin-bottom:10px;line-height:1.4;}
      .ste-msg.bot{text-align:left;}
      .ste-msg.user{text-align:right;}
      .ste-msg .bubble{display:inline-block;padding:8px 12px;border-radius:12px;max-width:85%;}
      .ste-msg.bot .bubble{background:#f1f5fb;color:#111;}
      .ste-msg.user .bubble{background:#004aad;color:#fff;}
      #ste-chat-input-area{display:flex;gap:8px;padding:12px;border-top:1px solid #eee;background:#fafafa;}
      #ste-chat-input{flex:1;padding:10px 12px;border-radius:8px;border:1px solid #ddd;}
      #ste-chat-send{background:#004aad;color:#fff;border:none;padding:10px 14px;border-radius:8px;cursor:pointer;}
      #ste-chat-button{position:fixed;bottom:25px;right:25px;background-color:#004aad;color:white;border:none;border-radius:50%;width:60px;height:60px;font-size:28px;cursor:pointer;box-shadow:0 8px 18px rgba(0,0,0,0.25);z-index:999999;}
    </style>
    <div id="ste-chat-window">
      <div id="ste-chat-header">
        <img src="${logoUrl}" alt="logo"/>
        <div>💬 STE Construction</div>
      </div>
      <div id="ste-chat-content">
        <div class="ste-msg bot"><div class="bubble">Bonjour 👋 Je suis l’assistant STE Construction ! Comment puis-je vous aider ? 😊</div></div>
      </div>
      <div id="ste-chat-input-area">
        <input id="ste-chat-input" type="text" placeholder="Tapez votre message..."/>
        <button id="ste-chat-send">Envoyer</button>
      </div>
      <div style="font-size:12px;text-align:center;color:#666;padding:8px;">${signatureText}</div>
    </div>
    <button id="ste-chat-button">💬</button>
  `;
  document.body.appendChild(root);

  const chatWindow = document.getElementById("ste-chat-window");
  const chatButton = document.getElementById("ste-chat-button");
  const chatContent = document.getElementById("ste-chat-content");
  const chatInput = document.getElementById("ste-chat-input");
  const chatSend = document.getElementById("ste-chat-send");

  // === Open / close ===
  chatButton.onclick = () => {
    chatWindow.style.display = chatWindow.style.display === "none" ? "flex" : "none";
  };

  // === Send message ===
  chatSend.onclick = async () => {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage("user", text);
    chatInput.value = "";
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: text })
    });
    const data = await res.json();
    addMessage("bot", data.answer || "Désolé, je n’ai pas pu répondre 😅");
  };

  function addMessage(role, text) {
    const msg = document.createElement("div");
    msg.className = "ste-msg " + role;
    msg.innerHTML = `<div class="bubble">${text}</div>`;
    chatContent.appendChild(msg);
    chatContent.scrollTop = chatContent.scrollHeight;
  }
})();