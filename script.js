import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDWK5PYq-swvsi9NPKUqVwKHRtHam683Sg",
    authDomain: "trivia-ponds-8d9ec.firebaseapp.com",
    databaseURL: "https://trivia-ponds-8d9ec-default-rtdb.firebaseio.com",
    projectId: "trivia-ponds-8d9ec",
    storageBucket: "trivia-ponds-8d9ec.firebasestorage.app",
    messagingSenderId: "686036490708",
    appId: "1:686036490708:web:83c3e4d5dfa579a5215e41",
    measurementId: "G-PPXRG9M594"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- BANCO DE PREGUNTAS (Simplificado para el ejemplo, usa el tuyo completo) ---
const bancoPreguntas = [
    { q: "¿Cuál es el concepto de la campaña?", a: "Para ti", bad: ["Piel radiante", "Mi primer skincare", "Milagro UV"] },
    { q: "¿Cuántas capas tiene la piel?", a: "Tres", bad: ["Dos", "Cinco", "Diez"] },
    // ... añade el resto de tus preguntas aquí ...
];

let nombreUsuario = "";
let score = 0;
let currentIdx = 0;
let timer;
let gameQuestions = [];

// Elementos UI
const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const optionsGrid = document.getElementById('options-grid');

// UNIRSE AL JUEGO
document.getElementById('join-btn').onclick = () => {
    nombreUsuario = document.getElementById('player-name').value.trim();
    if (!nombreUsuario) return alert("Escribe tu nombre");

    set(ref(db, 'jugadores/' + nombreUsuario), { puntos: 0 });
    document.getElementById('join-btn').classList.add('hidden');
    document.getElementById('wait-msg').classList.remove('hidden');

    // Escuchar cuando el admin de "START"
    onValue(ref(db, 'estadoJuego'), (snap) => {
        if (snap.val() === "iniciado") startNewGame();
    });
};

function startNewGame() {
    score = 0; currentIdx = 0;
    gameQuestions = bancoPreguntas.slice(0, 20); // O usa shuffle
    homeScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    optionsGrid.innerHTML = '';
    const qData = gameQuestions[currentIdx];
    document.getElementById('question-label').innerText = qData.q;
    document.getElementById('progress-text').innerText = `P ${currentIdx + 1}/20`;
    
    const opts = [...qData.bad, qData.a].sort(() => Math.random() - 0.5);
    opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn-option';
        btn.onclick = () => checkAnswer(btn, qData.a);
        optionsGrid.appendChild(btn);
    });
    iniciarReloj();
}

function iniciarReloj() {
    let t = 10;
    document.getElementById('timer-sec').innerText = t;
    clearInterval(timer);
    timer = setInterval(() => {
        t--;
        document.getElementById('timer-sec').innerText = t;
        if (t <= 0) { clearInterval(timer); nextStep(); }
    }, 1000);
}

function checkAnswer(btn, correct) {
    clearInterval(timer);
    const esCorrecto = btn.innerText === correct;
    if (esCorrecto) {
        score++;
        btn.classList.add('correct');
        update(ref(db, 'jugadores/' + nombreUsuario), { puntos: score });
    } else {
        btn.classList.add('wrong');
    }
    document.getElementById('score-text').innerText = `Pts: ${score}`;
    Array.from(optionsGrid.children).forEach(b => b.disabled = true);
    setTimeout(nextStep, 1500);
}

function nextStep() {
    currentIdx++;
    if (currentIdx < 20 && currentIdx < gameQuestions.length) {
        showQuestion();
    } else {
        quizScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        document.getElementById('final-score-msg').innerText = `Finalizaste con ${score} puntos.`;
        if(score > 15) confetti();
    }
}