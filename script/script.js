window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

document.addEventListener("DOMContentLoaded", () => {
    if (!window.SpeechRecognition) {
        alert("Tu navegador no soporta reconocimiento de voz. Usa Google Chrome.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    const btnHablar = document.getElementById("btnHablar");
    const texto = document.getElementById("texto");
    const log = document.getElementById("log");
    const imgGato = document.getElementById("imgGato");

    btnHablar.addEventListener("click", () => {
        recognition.start();
        texto.textContent = " Escuchando...";
        btnHablar.disabled = true;
        imgGato.style.display = "none";
        leerTexto("Te escucho");
    });

    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        texto.textContent = `Lo que dijiste: ${speechToText}`;

        const li = document.createElement("li");
        li.textContent = speechToText;
        log.appendChild(li);

        if (speechToText.toLowerCase().includes("gato")) {
            imgGato.src = "https://www.miau.com.mx/wp-content/uploads/2014/09/gatito.jpg";
            imgGato.alt = "Gato";
            imgGato.style.display = "block";
        } else {
            imgGato.style.display = "none";
            leerTexto(speechToText);
        }

        enviarAESP32(speechToText);
    };

    recognition.onend = () => {
        btnHablar.disabled = false;
    };

    recognition.onerror = (event) => {
        texto.textContent = "Error: " + event.error;
        btnHablar.disabled = false;
    };
});

function leerTexto(textoALeer) {
    if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(textoALeer);
        speech.lang = "es-ES";
        speech.rate = 0.9;
        speech.pitch = 1;
        speech.volume = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
    }
}

function enviarAESP32(mensaje) {
    fetch("/texto", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ texto: mensaje })
    })
    .then(res => console.log("Enviado a ESP32:", mensaje))
    .catch(err => console.error("Error al enviar:", err));
}