const output = document.getElementById("output");
const start_rec = document.getElementById("record");
const generatedImage = document.querySelector(".gen-image");
const downloadBtn = document.querySelector(".download-btn");

const speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
const rec = new speechRecognition();

rec.lang = "en";
rec.interimResults = false;
rec.continuous = true;

let prompt = "";
let isRecording = false; 
let clickCount = 0;

start_rec.addEventListener('click', () => {
    if (!isRecording) {
        rec.start();
        console.log("recording started");
        isRecording = true;
    } else {
        rec.stop();
        console.log("recording stopped");
        isRecording = false;

        const event = new CustomEvent('recordingStopped', { detail: prompt }); 
        document.dispatchEvent(event); 
    }
});

rec.onresult = (e) => {
    prompt += e.results[e.results.length - 1][0].transcript;
    console.log(e);
};

document.addEventListener('recordingStopped', (event) => {
    const recordedText = event.detail; 
    genImageWithText(recordedText); 
});

const genImage = async () => {
    try {
        generatedImage.src = "images/loading.webp";
        const response = await fetch("http://localhost:4000/genImage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"prompt": prompt}),
        });

        const data = await response.json();
        const image = `data:image/jpeg;base64,${data.img}`;
        generatedImage.src = image;
        downloadBtn.href = image;
    } catch (error) {
        console.error("Image generation failed:", error);
        generatedImage.src = "images/error.webp";
    }
};

const genImageWithText = async (recordedText) => {
    prompt = recordedText;
    await genImage();
    prompt = "";
};

downloadBtn.addEventListener('click', () => {
    if (generatedImage.src && !generatedImage.src.includes('loading') && !generatedImage.src.includes('error')) {
        const link = document.createElement('a');
        link.href = generatedImage.src;
        link.download = `generated-image-${new Date().toISOString()}.jpg`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert("No image to download. Please generate an image first.");
    }
});

const downloadImage = async () => {
    try {
        const response = await fetch(generatedImage.src);
        const blob = await response.blob();
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `generated-image-${new Date().toISOString()}.jpg`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to download image");
    }
};

downloadBtn.href = '';
downloadBtn.download = 'generated-image.jpg';

document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.querySelector('.welcome-screen');
    const mainContainer = document.querySelector('.main');

    setTimeout(() => {
        mainContainer.classList.add('visible');
    }, 3500);
});
