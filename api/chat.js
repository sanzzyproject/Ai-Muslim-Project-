import axios from "axios";

export default async function handler(req, res) {
  // 1. Setup CORS (Agar frontend bisa akses backend)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Handle Preflight Request (Browser cek koneksi dulu)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Pastikan method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    // 4. Panggil API AI (Sumber data)
    // Note: Jika server ini down, aplikasi kamu juga akan error.
    const response = await axios.post("https://vercel-server-psi-ten.vercel.app/chat", {
      "text": message,
      "array": [
        { "content": "What is Islam? Tell with reference to a Quran Ayat and Hadith", "role": "user" },
        { "content": "Islam means submission to the will of Allah...", "role": "assistant" }
      ]
    });

    // Cek apakah ada data result
    const replyText = response.data?.result;
    
    if (!replyText) {
      throw new Error("Tidak ada balasan dari server AI utama.");
    }

    return res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error("Backend Error:", error.message);
    // Kirim pesan error yang jelas ke frontend
    return res.status(500).json({ 
      error: 'Gagal memproses permintaan.', 
      details: error.message 
    });
  }
}
