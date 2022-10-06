

//Selectors -------------------------------------------------------------------------------------------------------
const body = document.getElementById('body');
const canvas = document.getElementById('gameCanvas');
const scoreOnScreen = document.getElementById('scoreValue');
const playPauseBtn = document.getElementById('pauseBtn');
const soundBtn = document.getElementById('soundBtn');
const gameInit = document.getElementById('gameInit');
const gameInitBtn = document.getElementById('gameInitBtnContainer');
const superPowerContainer = document.getElementById('superPowerContainer');

// Canvas setup
const ctx = canvas.getContext('2d');
canvas.height = 900;
canvas.width = 1750;

//Initializing game ------------------------------------------------------------------------------------------------
let score = 0;
let lifes = 3;
let gameFrame = 0;
let gameSpeed = 1; //How fast backgound moves - it will increase as game progresses
let gameOver = false;
let soundOn = true;
let play = true;


// Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
onresize = (event) => {
    canvasPosition = canvas.getBoundingClientRect();
};

const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
};

//Event Listeners -------------------------------------------------------------------------------------------------

canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener('mouseup', function(){
    mouse.click = false;
});


//Player character -----------------------------------------------------------------------------------------------

//Bubble animation spritesheet

class Player {
    constructor(){
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.speed = 40;
    }
    update() {
        //distance on the horizontal x-axis and on the vertical y-axis
        const dx = this.x - mouse.x; 
        const dy = this.y - mouse.y;

        //Move the character towards the mouse position
        if (this.x != mouse.x) {
            this.x -= dx/this.speed;
        } 
        if (this.y != mouse.y) {
            this.y -= dy/this.speed;
        }
    }

    draw() {
        // Draw a line representing the path the character is going to move on
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }

        // Draw a circle representing the character
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 50, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

    }
}

let player = new Player();


// Bubbles -----------------------------------------------------------------------------------------------------

const bubblesArray = [];
let bubbleFrequence = 50;

class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
    }
    update() { 
        //Distance betwen bubble and player
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
        //Move bubbles up
        this.y -= this.speed;
    }
    draw() {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2); //I'm defining the shape of the circle
        ctx.fill(); //to draw the circle
        ctx.closePath();
        ctx.stroke();
    }
}

function handleBubbles () {
    //Create a new bubble every 50 frames
    if (gameFrame % bubbleFrequence == 0) {  
        bubblesArray.push(new Bubble());
    }
    bubblesArray.map((bubble, index) => {
        bubble.draw();
        bubble.update();
    });
    bubblesArray.map((bubble, i) => {
        // Remove the bubble once it goes out of the canvas top
        if (bubble.y < 0 - bubble.radius*2) {
            bubblesArray.splice(i,1);
            i--;
        }
        //Pop the bubbles
        if (bubble.distance < player.radius + bubble.radius) {
                score++;
                bubblesArray.splice(i,1);
                i--;
        }
    });
}

//Repeating background ----------------------------------------------------------------------------------------------

const backgoundImage = new Image();
backgoundImage.src = 'images/background_waves.jpg';

const Background = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height/3.3
}

function handleBackground() {
    //First Image
    Background.x1 -= gameSpeed;
    if (Background.x1 <= -Background.width) {
        Background.x1 = Background.width;
    }
    ctx.drawImage(backgoundImage, Background.x1, Background.y, Background.width, Background.height);

    //Second Image
    Background.x2 -= gameSpeed;
    if (Background.x2 <= -Background.width) {
        Background.x2 = Background.width;
    }
    ctx.drawImage(backgoundImage, Background.x2, Background.y, Background.width, Background.height);
}


//Enemies -----------------------------------------------------------------------------------------------------------

let enemiesArray = [];

class Enemy {
    constructor() {
        this.movesTo = Math.random() < 0.5 ? 'right' : 'left';
        this.radius = 55;
        this.x = this.movesTo == 'right' ? 0 - this.radius*2 : canvas.width + this.radius*2;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 3 + 1;
        this.distance;
    }
    update() { 
        //move enemy left or right
        if (this.movesTo == 'right') {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }
        //Distance betwen enemy and player
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }
    draw() {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}

function handleEnemies () {
    //Create a new enemy every 400 frames
    if (gameFrame % 400 == 0) {  
        enemiesArray.push(new Enemy());
    }

    enemiesArray.map((enemy, i) => {
        enemy.draw();
        enemy.update();
    });

    enemiesArray.map((enemy, i) => {
        // Remove the enemy once it goes out of the canvas
        if (enemy.x < 0 - enemy.radius*2 || enemy.x > canvas.width + enemy.radius*2) {
            enemiesArray.splice(i,1);
            i--;
        }

        //Game over
        else if (enemy.distance < player.radius + enemy.radius) {
            handleGameOver();
        }
    });
}

//Game Over ----------------------------------------------------------------------------------------------------------

function handleGameOver () {
    gameOver = true;
    //Frame
    const gameOverFrame = document.createElement('div');
    gameOverFrame.classList.add('gameOverFrame');
    body.appendChild(gameOverFrame);
        //Content
        const gameOverContent = document.createElement('div');
        gameOverContent.classList.add('gameOverContent');
        gameOverFrame.appendChild(gameOverContent);
            //Title
            const gameOverTitle = document.createElement('h2');
            gameOverTitle.innerText = 'Game Over';
            gameOverTitle.classList.add('gameOverTitle');
            gameOverContent.appendChild(gameOverTitle);
}

// Animation loop ----------------------------------------------------------------------------------------------------
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    handleEnemies();
    //calculate player position
    player.update();
    //draw player
    player.draw();
    handleBubbles();
    scoreOnScreen.innerText = score;
    //increase game frame, it increases endlessly as the game runs. I'll use it to add periodic events to the game.
    gameFrame++;
    //Create animation loop though recursion
    if (!gameOver && play) requestAnimationFrame(animate); 
}

animate();
