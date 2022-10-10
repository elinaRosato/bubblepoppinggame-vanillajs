

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

//Player spritesheets
const playerLeft = new Image();
playerLeft.src = 'images/fish_swim_left.png';
const playerRight = new Image();
playerRight.src = 'images/fish_swim_right.png';

class Player {
    constructor(){
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.speed = 40;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }
    update() {
        //Distance on the horizontal x-axis and on the vertical y-axis
        const dx = this.x - mouse.x; 
        const dy = this.y - mouse.y;

        //Move the character towards the mouse position
        if (this.x != mouse.x) {
            this.x -= dx/this.speed;
        } 
        if (this.y != mouse.y) {
            this.y -= dy/this.speed;
        }

        //calculate angle of movement
        let theta = Math.atan2(dy, dx)
        this.angle = theta;

        //Change sprite every 5 frames
        if (gameFrame % 5 == 0) {
            this.frame++;
            if (this.frame > 11) {
                this.frame = 0;
            }
            //Setting frameY
            if (this.frame >= 8) {
                this.frameY = 2;
            } else if (this.frame >= 4) {
                this.frameY = 1;
            } else {
                this.frameY = 0;
            }
            //Setting frameX
            if (this.x >= mouse.x) {
                if (this.frame == 0 || this.frame == 4 || this.frame == 8) {
                    this.frameX = 0;
                } else if (this.frame == 1 || this.frame == 5 || this.frame == 9) {
                    this.frameX = 1;
                } else if (this.frame == 2 || this.frame == 6 || this.frame == 10) {
                    this.frameX = 2;
                } else if(this.frame == 3 || this.frame == 7 || this.frame == 11){
                    this.frameX = 3;
                } else {
                    this.frameX = 0;
                }
            } else {
                if (this.frame == 0 || this.frame == 4 || this.frame == 8) {
                    this.frameX = 3;
                } else if (this.frame == 1 || this.frame == 5 || this.frame == 9) {
                    this.frameX = 2;
                } else if (this.frame == 2 || this.frame == 6 || this.frame == 10) {
                    this.frameX = 1;
                } else {
                    this.frameX = 0;
                }
            }
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

        //Rotate the character towards moving direction
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Animate the character
        if (this.x >= mouse.x) {
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth/4, this.spriteHeight/4);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth/4, this.spriteHeight/4);
        }

        ctx.restore();

    }
}

let player = new Player();


// Bubbles -----------------------------------------------------------------------------------------------------

const bubblesArray = [];
let bubbleFrequence = 50;

//Bubble animation spritesheet
const bubbleImage = new Image();
bubbleImage.src = 'images/bubble_pop_under_water_spritesheet.png';

class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 394;
        this.spriteHeight = 511;
        this.popped = false;
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
        ctx.drawImage(bubbleImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 54, this.y - 83, this.spriteWidth/3.7, this.spriteHeight/3.7);
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
        else if (bubble.distance < player.radius + bubble.radius) {
            bubble.popped = true;
        }
        //Animate pop
        if (bubble.popped) {
            if (bubble.frame <= 5) {
                //Change sprite every 5 frames
                if (gameFrame % 5 == 0) {
                    bubble.frame++;
                    //Setting frameY
                    bubble.frame >= 3 ? bubble.frameY = 1 : bubble.frameY = 0;
                    //Setting frameX
                    if (bubble.frame == 2 || bubble.frame == 5) {
                        bubble.frameX = 2;
                    } else if (bubble.frame == 1 || bubble.frame == 4) {
                        bubble.frameX = 1;
                    } else {
                        bubble.frameX = 0;
                    }
                }
            } else {
                score++;
                bubblesArray.splice(i,1);
                i--;
            }
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

//Enemies animation spritesheets
const enemyLeft = new Image();
enemyLeft.src = 'images/enemy_swim_left.png';
const enemyRight = new Image();
enemyRight.src = 'images/enemy_swim_right.png';

class Enemy {
    constructor() {
        this.movesTo = Math.random() < 0.5 ? 'right' : 'left';
        this.radius = 55;
        this.x = this.movesTo == 'right' ? 0 - this.radius*2 : canvas.width + this.radius*2;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 3 + 1;
        this.distance;
        this.image = this.movesTo == 'right' ? enemyRight : enemyLeft;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 418;
        this.spriteHeight = 397;
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
        ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.movesTo == 'right' ? this.x - 70 : this.x -60, this.y - 60, this.spriteWidth/3.3, this.spriteHeight/3.3);
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
