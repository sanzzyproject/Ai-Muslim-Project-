// ... (kode atas tetap sama) ...

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();

    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;
    showTyping();

    try {
        // Panggil Backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        // Cek status response (Bukan 200 OK berarti error)
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        removeTyping();

        if (data.reply) {
            addMessage(data.reply, 'bot');
        } else {
            addMessage("Maaf, respon kosong.", 'bot');
        }

    } catch (error) {
        removeTyping();
        console.error("Error Detail:", error); // Cek Console browser (F12) untuk lihat ini
        addMessage("Maaf, ada gangguan sistem. Coba refresh halaman.", 'bot');
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
});
