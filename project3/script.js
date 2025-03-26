const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing fast requires a lot of practice and accuracy.",
    "JavaScript is a versatile programming language."
];

let startTime, endTime;
let textToType = document.getElementById("text");
let inputText = document.getElementById("inputText");
let result = document.getElementById("result");

function startTest() {
    textToType.textContent = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    inputText.value = "";
    inputText.focus();
    startTime = new Date().getTime();
}

inputText.addEventListener("input", function () {
    if (inputText.value === textToType.textContent) {
        endTime = new Date().getTime();
        let timeTaken = (endTime - startTime) / 1000; // in seconds
        let words = textToType.textContent.split(" ").length;
        let speed = Math.round((words / timeTaken) * 60);
        result.textContent = `Typing Speed: ${speed} WPM`;
    }
});

function resetTest() {
    textToType.textContent = "Loading...";
    inputText.value = "";
    result.textContent = "";
}