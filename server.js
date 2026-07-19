require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const geminiApiKey = process.env.GEMINI_API_KEY; 

app.post('/api/chat', async (req, res) => {
    try {
        const { systemContext, userPrompt } = req.body;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
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
        
        console.log("=== RESPONS DARI GEMINI ===");
        console.log(JSON.stringify(data, null, 2));
        console.log("===========================");

        res.json(data);
    } catch (error) {
        console.error("Error server:", error);
        res.status(500).json({ error: "Terjadi kesalahan di server." });
    }
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server Running`);
    });
}

module.exports = app;
