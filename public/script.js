const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Fungsi untuk menambahkan pesan ke layar
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const content = document.createElement('div');
    content.classList.add('content');
    
    // Format teks agar baris baru terbaca
    content.innerText = text; 

    if (sender === 'user') {
        messageDiv.appendChild(avatar); // Avatar dikanan
        messageDiv.appendChild(content);
    } else {
        messageDiv.appendChild(avatar); // Avatar dikiri
        messageDiv.appendChild(content);
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fungsi Loading
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing';
    typingDiv.classList.add('typing-indicator');
    typingDiv.innerText = 'Muslim AI sedang mengetik...';
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
    const typingDiv = document.getElementById('typing');
    if (typingDiv) typingDiv.remove();
}

// Event Listener Submit Form
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();

    if (!message) return;

    // 1. Tampilkan pesan user
    addMessage(message, 'user');
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;

    // 2. Tampilkan indikator loading
    showTyping();

    try {
        // 3. Kirim ke Backend API kita sendiri (/api/chat)
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        removeTyping();

        // 4. Tampilkan balasan AI
        if (data.reply) {
            addMessage(data.reply, 'bot');
        } else {
            addMessage("Maaf, saya tidak mengerti. Coba pertanyaan lain.", 'bot');
        }

    } catch (error) {
        removeTyping();
        console.error(error);
        addMessage("Terjadi kesalahan koneksi. Silakan coba lagi.", 'bot');
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
});
