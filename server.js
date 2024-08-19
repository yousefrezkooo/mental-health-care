const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo', // or 'gpt-4' if available
            messages: [{ role: 'user', content: userMessage }],
            max_tokens: 150,
        }, {
            headers: {
                'Authorization': `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`, // Replace with your actual API key
                'Content-Type': 'application/json',
            },
        });

        console.log('API Response:', response.data); // Log the full API response

        const botReply = response.data.choices[0].message.content.trim();
        res.json({ reply: botReply });
    } catch (error) {
        console.error('Error fetching response from OpenAI:', error.response ? error.response.data : error.message);
        res.status(500).json({ reply: 'Sorry, something went wrong. Please try again later.' });
    }
});

// Catch-all route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
