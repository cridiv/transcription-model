const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});

const genImage = async (prompt) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            {
                prompt: "A man propsing to his woman",
                n: 1,
                size: "1024x1024",
                response_format: "b64_json",
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const img = response.data.data[0].b64_json;
        return img;
    } catch (error) {
        console.error("Error generating image:", error.response?.data || error.message);
        throw new Error("Image generation failed");
    }
};

app.post("/genImage", async (req, res) => {
    try {
        const img = await genImage(req.body.prompt);
        console.log("Generated Image:", img);
        res.send({ img });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
