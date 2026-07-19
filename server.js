require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
// Menyuruh Express untuk melayani file statis di dalam folder yang sama
app.use(express.static(__dirname));

const geminiApiKey = process.env.GEMINI_API_KEY; 

app.post('/api/chat', async (req, res) => {
    try {
        const { systemContext, userPrompt } = req.body;

        // KODE BARU (Sudah di-update modelnya)
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { 
                        role: 'user', 
                        parts: [{ text: `${systemContext}\n\nPertanyaan User: ${userPrompt}` }] 
                    }
                ]
            })
        });

        const data = await response.json();
        
        // Logger untuk melihat respons asli dari Google Gemini
        console.log("=== RESPONS DARI GEMINI ===");
        console.log(JSON.stringify(data, null, 2));
        console.log("===========================");

        res.json(data);
    } catch (error) {
        console.error("Error server:", error);
        res.status(500).json({ error: "Terjadi kesalahan di server." });
    }
});

app.listen(PORT, () => {
    console.log(`Server SavingPocket berjalan di http://localhost:${PORT}`);
});