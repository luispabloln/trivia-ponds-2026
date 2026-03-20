import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDWK5PYq-swvsi9NPKUqVwKHRtHam683Sg",
    authDomain: "trivia-ponds-8d9ec.firebaseapp.com",
    databaseURL: "https://trivia-ponds-8d9ec-default-rtdb.firebaseio.com",
    projectId: "trivia-ponds-8d9ec",
    storageBucket: "trivia-ponds-8d9ec.firebasestorage.app",
    messagingSenderId: "686036490708",
    appId: "1:686036490708:web:83c3e4d5dfa579a5215e41"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const bancoPreguntas = [
    { q: "¿Cuál es el concepto o nombre de la campaña para esta innovación?", a: "Para ti", bad: ["Piel radiante", "Mi primer skincare", "Milagro UV"] },
    { q: "¿Qué porcentaje de mujeres busca alcanzar la piel deseada hoy en día?", a: "9 de cada 10", bad: ["5 de cada 10", "3 de cada 10", "Todas las mujeres"] },
    { q: "¿Cuál es el reto principal de cobertura en los puntos de venta?", a: "Pasar de 1 de cada 9 a 5 de cada 9", bad: ["Estar en todos los supermercados", "Vender solo online", "Eliminar a la competencia"] },
    { q: "¿Cuál es la meta de crecimiento del negocio de Pond's en esta campaña?", a: "Triplicar el negocio", bad: ["Duplicar el negocio", "Mantenerlo igual", "Crecer un 10%"] },
    { q: "¿Qué marcas de la competencia deben guiar la exhibición de Pond's?", a: "Garnier o Babaria", bad: ["Nivea o L'Oréal", "Cerave o Cetaphil", "Neutrogena o Eucerin"] },
    { q: "¿Cuántos productos nuevos lanza Pond's en este portafolio?", a: "12 productos nuevos", bad: ["4 productos nuevos", "8 productos nuevos", "16 productos nuevos"] },
    { q: "¿Cuántos productos conforman el portafolio total de Pond's tras este lanzamiento?", a: "16 productos", bad: ["12 productos", "20 productos", "10 productos"] },
    { q: "¿Cuál es una ventaja competitiva frente a países vecinos como Argentina?", a: "No tienen contrabando desde Argentina", bad: ["Son fabricados en Bolivia", "Son más baratos allá", "Son libres de impuestos"] },
    { q: "¿Qué canales deben tener un 100% de cobertura obligatoria?", a: "Mercados zonales y mayoristas", bad: ["Farmacias", "Supermercados", "Tiendas de barrio"] },
    { q: "¿En qué ciudades habrá impulsadoras en el canal tradicional?", a: "La Paz, Cochabamba y Santa Cruz", bad: ["Solo en Santa Cruz", "Tarija, Sucre y Potosí", "En todo el país"] },
    { q: "¿Qué frase resume la importancia de la ejecución en el punto de venta?", a: "Si no nos ven, no existimos", bad: ["El cliente siempre tiene la razón", "Lo bueno cuesta caro", "La belleza duele"] },
    { q: "¿Qué indica la capacitación sobre el nivel de precios vs la competencia (Garnier)?", a: "Están por debajo (más accesibles)", bad: ["Son el doble de caros", "Exactamente iguales", "Es la marca más cara del mercado"] },
    { q: "¿Qué instituto respalda el desarrollo de estos productos?", a: "Pond's Skin Institute", bad: ["Instituto Dermatológico", "Laboratorios Unilever", "Clínica de la Piel"] },
    { q: "¿Qué canales contarán con menciones publicitarias tradicionales?", a: "Televisión nacional (Red Uno, Unitel)", bad: ["Solo radio local", "Periódicos", "Revistas de belleza"] },
    { q: "¿Qué tipo de creadores de contenido (influencers) apoyarán la marca?", a: "Macro y micro influencers", bad: ["Actores de Hollywood", "Modelos internacionales", "Solo youtubers gamers"] },
    { q: "¿Cuántas capas principales tiene la piel?", a: "Tres (Epidermis, Dermis e Hipodermis)", bad: ["Dos (Epidermis y Dermis)", "Cinco capas", "Diez capas"] },
    { q: "¿Cuál es la capa más externa de la piel?", a: "Epidermis", bad: ["Dermis", "Hipodermis", "Subdermis"] },
    { q: "¿Cuántas subcapas tiene la Epidermis?", a: "5 subcapas", bad: ["2 subcapas", "10 subcapas", "3 subcapas"] },
    { q: "¿Qué son los radicales libres?", a: "Moléculas sin pareja que roban células sanas", bad: ["Células súper hidratantes", "Vitaminas puras", "Bacterias buenas de la piel"] },
    { q: "¿Cómo actúan los ingredientes antioxidantes en la piel?", a: "Como policías que protegen del daño de los radicales libres", bad: ["Como esponjas que absorben grasa", "Como exfoliantes químicos", "Aclarando el tono artificialmente"] },
    { q: "¿Cuántos pasos fundamentales tiene la rutina ideal de Pond's?", a: "5 pasos", bad: ["3 pasos", "4 pasos", "6 pasos"] },
    { q: "¿Cuál es el primer paso de la rutina facial?", a: "Desmaquillar", bad: ["Limpiar", "Tratar", "Hidratar"] },
    { q: "¿Cuál es el segundo paso de la rutina facial?", a: "Limpiar", bad: ["Exfoliar", "Desmaquillar", "Proteger"] },
    { q: "¿Cuál es el tercer paso de la rutina facial?", a: "Tratar (Sérum)", bad: ["Hidratar", "Desmaquillar", "Proteger"] },
    { q: "¿Cuál es el cuarto paso de la rutina facial?", a: "Hidratar", bad: ["Proteger", "Limpiar", "Tratar"] },
    { q: "¿Cuál es el quinto y último paso innegociable de la rutina?", a: "Proteger (Protección solar)", bad: ["Hidratar", "Desmaquillar", "El tónico"] },
    { q: "¿Qué pasa si se hace todo el tratamiento pero no se aplica protector solar?", a: "Todo el esfuerzo se va al tacho (se pierde)", bad: ["La piel brilla el doble", "No sucede nada malo", "El sérum actúa como protector"] },
    { q: "¿Cuál es el público objetivo de la variedad Fruity Hydra Fresh (Sandía)?", a: "15 a 24 años", bad: ["20 a 40 años", "30 a 50 años", "Más de 50 años"] },
    { q: "¿Cuál es el beneficio principal de la línea de Sandía?", a: "Piel naturalmente tonificada y luminosa", bad: ["Reducir manchas oscuras extremas", "Prevenir arrugas profundas", "Control severo de acné"] },
    { q: "¿Para qué tipo de piel es apta la línea de Sandía?", a: "Para todo tipo de piel", bad: ["Solo piel seca", "Solo piel muy grasa", "Piel madura"] },
    { q: "¿Cuántos productos conforman la variedad Fruity Hydra Fresh?", a: "3 productos", bad: ["4 productos", "2 productos", "5 productos"] },
    { q: "¿Qué productos conforman la rutina de Sandía?", a: "Agua micelar, Gel limpiador y Gel hidratante", bad: ["Sérum, Crema y Protector", "Jabón, Exfoliante y Tónico", "Agua micelar y Sérum"] },
    { q: "¿Cuál es el contenido neto del Gel Hidratante de Sandía?", a: "100g", bad: ["110g", "50g", "200g"] },
    { q: "¿Qué característica tiene la fórmula del Gel Hidratante de Sandía?", a: "Fórmula ligera de rápida absorción sin sensación grasosa", bad: ["Es una crema muy espesa", "Deja un residuo blanco", "Contiene aceites pesados"] },
    { q: "¿Cuál es la función principal de las micelas en las Aguas Micelares?", a: "Actúan como imanes que atrapan suciedad y maquillaje", bad: ["Eliminan manchas oscuras en un día", "Protegen del sol al instante", "Derriten la piel muerta"] },
    { q: "¿El agua micelar requiere enjuague?", a: "No requiere enjuague", bad: ["Sí, con agua y jabón", "Sí, con agua tibia obligatoria", "Solo si tienes piel mixta"] },
    { q: "¿Qué característica ecológica tienen las botellas de Pond's?", a: "Son de plástico 100% reciclado", bad: ["Son de vidrio soplado", "No usan plástico reciclado", "Usa plástico 50% reciclado"] },
    { q: "¿Cuál es el público objetivo de la variedad Vs Manchas?", a: "20 a 40 años", bad: ["15 a 24 años", "Más de 50 años", "Público infantil"] },
    { q: "¿Qué activo es el componente principal de la variedad Vs Manchas?", a: "Vitamina C (Ácido Ascórbico)", bad: ["Ácido Hialurónico", "Niacinamida pura", "Colágeno animal"] },
    { q: "¿Qué beneficios ofrece la Vitamina C?", a: "Es antioxidante, iluminadora y estimulante de colágeno", bad: ["Solo quita el acné", "Es un bloqueador solar físico", "Funciona como base de maquillaje"] },
    { q: "¿Cuántos productos tiene la variedad Vs Manchas?", a: "4 productos", bad: ["3 productos", "2 productos", "5 productos"] },
    { q: "¿Qué ingrediente de origen natural acompaña a la Vitamina C en el agua micelar?", a: "Extracto de limón", bad: ["Extracto de sandía", "Aloe vera", "Rosas"] },
    { q: "¿Qué porcentaje de maquillaje remueve el Agua Micelar Vs Manchas?", a: "Elimina el 99% del maquillaje", bad: ["Elimina el 50%", "Remueve solo sombras de ojos", "El 100% de la piel muerta"] },
    { q: "¿Por qué el Gel Limpiador Vs Manchas es catalogado '2 en 1'?", a: "Porque limpia e hidrata a la vez", bad: ["Porque es champú y jabón", "Porque limpia y es protector solar", "Porque remueve arrugas"] },
    { q: "¿Cuál es el tamaño del Gel Limpiador Vs Manchas?", a: "200ml", bad: ["300ml", "100ml", "50ml"] },
    { q: "¿Cuántas veces más potente es el Sérum Vs Manchas que la vitamina C normal?", a: "60 veces más potente", bad: ["10 veces más potente", "100 veces más potente", "El doble de potente"] },
    { q: "¿Cuál es el público objetivo de la variedad Hydra Active?", a: "20 a 40 años", bad: ["15 a 24 años", "Bebés", "Mayores de 60 años"] },
    { q: "¿Qué beneficio principal promete la variedad Hydra Active?", a: "Hidratación superior, elasticidad y firmeza", bad: ["Reducir el acné severo", "Aclarar manchas negras", "Exfoliación química"] },
    { q: "¿Cuántas horas de hidratación continua promete el Gel Hydra Active?", a: "24 horas de hidratación", bad: ["48 horas", "12 horas", "8 horas"] },
    { q: "¿Qué significa FPS 50 en los protectores Pond's?", a: "Permite exponerte al sol 50 veces más tiempo sin quemarte", bad: ["Bloquea el 50% de los rayos", "Dura 50 horas en la cara", "Tiene 50 extractos naturales"] },
    { q: "¿Qué activo exclusivo patentado en la línea UV Miracle?", a: "Niasorcinol", bad: ["Ácido hialurónico puro", "Vitamina C concentrada", "Triple Péptido"] },
    { q: "¿De qué está compuesto el Niasorcinol?", a: "Niacinamida + E-Resorcinol", bad: ["Vitamina C + Vitamina E", "Ácido Salicílico + Zinc", "Glutatión + Sandía"] },
    { q: "¿En el planograma ideal, en qué fila va la línea Vs Manchas (Vitamina C)?", a: "En la 1ª primera fila (superior)", bad: ["En la 2da fila", "En la 3ra fila", "En las cajas"] },
    { q: "¿Cuál es el orden de izquierda a derecha en el anaquel?", a: "Por orden de pasos (Limpiar, tratar, hidratar, proteger)", bad: ["Por precio", "Orden alfabético", "Por tamaño"] },
    { q: "¿De qué porcentaje es la meta de cobertura en micromercados y farmacias grandes?", a: "100%", bad: ["50%", "20%", "80%"] }
];

let nombreUsuario = "";
let score = 0;
let currentIdx = 0;
let timer;
let gameQuestions = [];

const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const optionsGrid = document.getElementById('options-grid');
const progressBar = document.getElementById('progress-bar');

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

document.getElementById('join-btn').onclick = () => {
    nombreUsuario = document.getElementById('player-name').value.trim().toUpperCase();
    if (!nombreUsuario) return alert("Ingresa tu nombre");

    set(ref(db, 'jugadores/' + nombreUsuario), { puntos: 0 });
    document.getElementById('join-btn').classList.add('hidden');
    document.getElementById('wait-msg').classList.remove('hidden');

    onValue(ref(db, 'estadoJuego'), (snap) => {
        if (snap.val() === "iniciado") startGame();
    });
};

function startGame() {
    score = 0; currentIdx = 0;
    gameQuestions = shuffle([...bancoPreguntas]).slice(0, 20);
    homeScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    optionsGrid.innerHTML = '';
    const qData = gameQuestions[currentIdx];
    document.getElementById('question-label').innerText = qData.q;
    document.getElementById('progress-text').innerText = `PREGUNTA ${currentIdx + 1}/20`;
    progressBar.style.width = `${((currentIdx) / 20) * 100}%`;

    const opts = shuffle([...qData.bad, qData.a]);
    opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn-option';
        btn.onclick = () => checkAnswer(btn, qData.a);
        optionsGrid.appendChild(btn);
    });
    startTimer();
}

function startTimer() {
    let t = 10;
    document.getElementById('timer-sec').innerText = t;
    clearInterval(timer);
    timer = setInterval(() => {
        t--;
        document.getElementById('timer-sec').innerText = t;
        if (t <= 0) { clearInterval(timer); nextQuestion(); }
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
        Array.from(optionsGrid.children).forEach(b => {
            if(b.innerText === correct) b.classList.add('correct');
        });
    }
    Array.from(optionsGrid.children).forEach(b => b.disabled = true);
    setTimeout(nextQuestion, 2000);
}

function nextQuestion() {
    currentIdx++;
    if (currentIdx < 20) {
        showQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    document.getElementById('final-score-msg').innerText = `${score} / 20 PUNTOS`;
    if(score >= 15) confetti({ particleCount: 150, spread: 70 });
}
