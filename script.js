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
downloadBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    if (generatedImage.src && !generatedImage.src.includes('loading') && !generatedImage.src.includes('error')) {
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
    } else {
      alert("No image to download. Please generate an image first.");
    }
  });
  
  downloadBtn.href = '#';
  downloadBtn.download = 'generated-image.jpg';

document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.querySelector('.welcome-screen');
    const mainContainer = document.querySelector('.main');

    setTimeout(() => {
        mainContainer.classList.add('visible');
    }, 3500);
});

const popupForm = document.getElementById("popupForm");
const overlay = document.getElementById("overlay");
const closeButton = document.getElementById("closeButton");
const form = document.querySelector("#popupForm form");
let hasPopupShown = false;
let lastScrollTop = window.scrollY;

function showPopup() {
  if (!hasPopupShown) {
    popupForm.style.display = "block";
    hasPopupShown = true; 
  }
}

closeButton.addEventListener("click", () => {
  popupForm.style.display = "none";
  overlay.style.display = "none";
});

function closePopup() {
    popupForm.style.display = "none"; 
    overlay.style.display = "none";
  }

closeButton.addEventListener("click", closePopup);

setTimeout(showPopup, 6000);

form.addEventListener("submit", function(event) {
    event.preventDefault(); 
    
    closePopup();
    
    alert("Form Submitted!"); 
  });

  const themeToggle = document.getElementById('theme-toggle');
const prefersLightMode = window.matchMedia('(prefers-color-scheme: light)');

function toggleTheme() {
  document.body.classList.toggle('light-mode');
}

themeToggle.addEventListener('click', toggleTheme);

if (prefersLightMode.matches) {
  document.body.classList.add('light-mode');
}
