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

start_rec.addEventListener('click', () => {
  if (!isRecording) {
    rec.start();
    console.log("recording started");
    isRecording = true;
    start_rec.textContent = "Stop Recording";
  } else {
    rec.stop();
    console.log("recording stopped");
    isRecording = false;
    start_rec.textContent = "Start Recording";

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
  console.log("Recording stopped. Prompt:", recordedText);
  genImage(recordedText);
});

const genImage = async (recordedText) => {
  const genImage = document.getElementById("gen-image");
  generatedImage.src = "public/images/loading.webp";

  const response = await fetch("http://localhost:4000/genImage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ "prompt": recordedText })
  });

  const data = await response.json();
  const image = `data:image/jpeg;base64,${data.img}`;
  generatedImage.src = image;
  downloadBtn.href = image;
};
