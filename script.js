let board = document.getElementById('board');
let airplane = document.getElementById('airplane');
let backgroundPositionY = 0;
let airplaneInitialLeft = board.offsetWidth / 2;
airplane.style.left = airplaneInitialLeft + 'px';
let obstacles = []; // Listează obstacolele
let bullets = []; // Listează gloantele
let score = 0;
let gameActive = true;
let obstacleGenerationInterval; //Variabilă pentru intervalul de generare de obstacole
let backgroundAnimationFrame; // Variabilă pentru animația de fundal

function moveBackground() {
    if (!gameActive) return;
    backgroundPositionY += 2; // Ajustează viteza de mișcare
    board.style.backgroundPositionY = backgroundPositionY + 'px';
    backgroundAnimationFrame = requestAnimationFrame(moveBackground);
    document.getElementById("message").textContent = "Score: " + score;
}

function restartGame() {
    gameActive = true;
    backgroundPositionY = 0;
    board.style.backgroundPositionY = backgroundPositionY + 'px';
    airplaneInitialLeft = board.offsetWidth / 2;
    airplane.style.left = airplaneInitialLeft + 'px';
    obstacles.forEach(obstacle => board.removeChild(obstacle)); // Elimină toate obstacolele
    obstacles = []; // Resetează lista de obstacolele
    bullets.forEach(bullet => board.removeChild(bullet)); // Elimină toate gloantele
    bullets = []; // Resetează lista de gloante
    score = 0;
    document.getElementById("message").textContent = "Score: " + score;

    cancelAnimationFrame(backgroundAnimationFrame); // Oprește animația veche
    moveBackground(); // Începe animația de fundal nouă

    // Oprește intervalul vechi și începe unul nou
    if (obstacleGenerationInterval) { // Verificăm dacă există un interval activ
        clearInterval(obstacleGenerationInterval); // Oprim intervalul vechi
    }
    startGeneratingObstacles(); // Începe generarea de obstacole
}

function createObstacle() {
    // Creează un nou element de tip imagine pentru obstacol 
    let obstacle = document.createElement('img'); 
    obstacle.src = 'https://www.shutterstock.com/image-illustration/airplane-1-top-view-white-260nw-2053856852.jpg'; // Înlocuiește cu imaginea ta
    obstacle.classList.add('obstacle');
    
    // Setează poziția inițială aleatoare pe axa X 
    let obstaclePosition = parseInt(Math.floor(Math.random() * (board.offsetWidth - airplane.offsetWidth)));
    obstacle.style.left = obstaclePosition + 'px'; 
    obstacle.style.top = '0px'; 
    board.appendChild(obstacle); 
    obstacles.push(obstacle); 
    moveObstacle(obstacle); 
}

function moveObstacle(obstacle) {
    let obstacleInterval = setInterval(() => {
        if (!gameActive) { // Oprește intervalul dacă jocul nu este activ
            clearInterval(obstacleInterval); 
            return; 
        }
        // Deplasează obstacolul în jos 
        let obstacleTop = parseInt(obstacle.style.top, 10);
        obstacle.style.top = (obstacleTop + 3) + 'px'; // Ajustează viteza de deplasare
        if (checkCollision(airplane, obstacle)) { // Verifică coliziunea
            endGame(); // Încheie jocul dacă există coliziune
        }

        // Verifică dacă obstacolul a ieșit din tabla de joc și elimină-l
        if (obstacleTop > board.offsetHeight) {
            ++score;
            clearInterval(obstacleInterval);
            board.removeChild(obstacle);
            obstacles = obstacles.filter(obs => obs !== obstacle);
        }

        // Verifică coliziunile cu gloantele
        bullets.forEach(bullet => {
            if (checkCollision(bullet, obstacle)) { // Verifică coliziunea între glonț și obstacol
                board.removeChild(obstacle); // Elimină obstacolul
                obstacles = obstacles.filter(obs => obs !== obstacle); // Elimină obstacolul din lista
                board.removeChild(bullet); // Elimină glonțul
                bullets = bullets.filter(bull => bull !== bullet); // Elimină glonțul din lista
                ++score; // Crește scorul
            }
        });
    }, 20); // Rata de actualizare la fiecare 20ms
}

function checkCollision(airplane, obstacle) { // Funcție pentru a verifica coliziunea 
    let airplaneRect = airplane.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    return !(
        airplaneRect.top > obstacleRect.bottom ||
        airplaneRect.bottom < obstacleRect.top ||
        airplaneRect.left > obstacleRect.right ||
        airplaneRect.right < obstacleRect.left
    ); // Returnează true dacă există coliziune
}

function createBullet() { // Funcție pentru a crea un glonț
    let bullet = document.createElement('div'); // Creează un nou element pentru glonț
    bullet.classList.add('bullet'); // Adaugă o clasă pentru stilizare
    bullet.style.left = parseInt(airplane.style.left, 10) - 5 + 'px'; // Setează poziția glonțului
    bullet.style.top = parseInt(window.getComputedStyle(airplane).top, 10) - 20 + 'px'; // Setează poziția glonțului
    board.appendChild(bullet); // Adaugă glonțul la tablă
    bullets.push(bullet); // Adaugă glonțul la lista de gloante
    moveBullet(bullet); // Începe mișcarea glonțului
}
 
function moveBullet(bullet) { // Funcție pentru a mișca glonțul
    let bulletInterval = setInterval(() => {
        if (!gameActive) { // Oprește intervalul dacă jocul nu este activ
            clearInterval(bulletInterval);
            return;
        } 
        let bulletTop = parseInt(bullet.style.top, 10);
        bullet.style.top = (bulletTop - 5) + 'px'; // Ajustează viteza de mișcare
        if (bulletTop < 0) { // Verifică dacă glonțul a ieșit din tablă
            clearInterval(bulletInterval);
            board.removeChild(bullet);
            bullets = bullets.filter(b => b !== bullet);
        }
    }, 10); // Rata de actualizare la fiecare 10ms
}

setInterval(() => {
    if (gameActive) {
        ++score;
    }
}, 1000);

function startGeneratingObstacles() {
    obstacleGenerationInterval = setInterval(() => { // Setează intervalul pentru generarea obstacolelor
        if (!gameActive) { // Oprește generarea obstacolelor dacă jocul nu este activ
            clearInterval(obstacleGenerationInterval);
            return;
        }
        createObstacle();
    }, 2000); // Creează un nou obstacol la fiecare 2 secunde
}

function endGame() { // Funcție pentru a încheia jocul
    gameActive = false; // Oprește jocul
    document.getElementById("message").textContent = "Game Over! Score: " + score; // Afișează mesajul de final
}

document.addEventListener('DOMContentLoaded', () => {
    moveBackground();
    startGeneratingObstacles();
    document.getElementById('restartButton').addEventListener('click', () => {
        restartGame(); // Repornim jocul
    });
    document.addEventListener('keydown', (event) => { 
        if (!gameActive) return; // Oprește mutarea avionului dacă jocul nu este activ
        let airplaneLeft = parseInt(airplane.style.left, 10);
        if (event.key === 'ArrowLeft' && airplaneLeft > airplane.offsetWidth) {
            airplaneLeft -= 50; // Mută avionul la stânga
            airplane.style.left = airplaneLeft + 'px';
        } else if (event.key === 'ArrowRight' && airplaneLeft < board.offsetWidth - airplane.offsetWidth) {
            airplaneLeft += 50; // Mută avionul la dreapta
            airplane.style.left = airplaneLeft + 'px';
        } else if (event.key === ' ') {
            createBullet(); // Creează un glonț
        }
    })
})
