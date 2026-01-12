// api/chat.js
import axios from "axios";

// Fungsi asli yang kamu berikan
async function muslimai(message) {
  try {
    const { data } = await axios.post("https://vercel-server-psi-ten.vercel.app/chat", {
      "text": message,
      "array": [
        {
          "content": "What is Islam? Tell with reference to a Quran Ayat and Hadith",
          "role": "user"
        },
        {
          "content": "\"Islam\" is an Arabic word that means \"submission\" or \"surrender\" to the will of Allah (SWT). It is the religion based on the belief in one God, Allah, and the teachings of Prophet Muhammad (peace be upon him) as revealed in the Quran. It was revealed to Prophet Muhammad (PBUH) through the Holy Quran.\n\nAllah (SWT) says in the Quran, \"This day I have perfected for you your religion and completed My favor upon you and have approved for you Islam as religion\" (Surah Al-Maidah, 5:3).\n\nProphet Muhammad (PBUH) said in a hadith, \"Islam is based on five pillars: bearing witness that there is no god but Allah and that Muhammad is His servant and final messenger, performing the five daily prayers (salah), giving charity (zakat), fasting during the month of Ramadan (swam), and performing pilgrimage (hajj) to the House of Allah for those who are able to do so.\" (Sahih Bukhari, Book 2, Hadith 7).",
          "role": "assistant"
        }
      ]
    });
    return data?.result;
  } catch (e) {
    console.error(e);
    return "Maaf, terjadi kesalahan saat menghubungi server.";
  }
}

// Handler untuk Vercel Serverless Function
export default async function handler(req, res) {
  // Setup CORS agar bisa diakses
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    const aiResponse = await muslimai(message);
    res.status(200).json({ reply: aiResponse });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
