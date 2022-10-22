

//Selectors -------------------------------------------------------------------------------------------------------
const body = document.getElementById('body');
const gameContainer = document.getElementById('gameContainer');
const gameInit = document.getElementById('gameInit');
const gameInitBtn = document.getElementById('gameInitBtnContainer');

// Canvas setup ---------------------------------------------------------------------------------------------------
let topController;
let playPauseBtnContainer;
let playPauseBtn;
let soundOnOffBtnContainer;
let soundOnOffBtn;
let canvasContainer;
let canvas;
let bottomController;
let scoreContainerBackground;
let scoreContainer;
let scoreValue;
let rightContainer;
let lifeBarContainer;
let powerUpsContainer;
let speedIcon;
let ctx;
let canvasPosition;
let mouse;


function canvasSetUp () {
    //Create canvas container
    canvasContainer = document.createElement('div');
    canvasContainer.classList.add('canvasContainer');
    gameContainer.appendChild(canvasContainer);
        //Create canvas element
        canvas = document.createElement('canvas');
        canvas.classList.add('gameCanvas');
        canvasContainer.appendChild(canvas);
        //Create top controller
        topController = document.createElement('div');
        topController.classList.add('topControllerContainer');
        canvasContainer.appendChild(topController);
            //Create play-pause btn container
            playPauseBtnContainer = document.createElement('div');
            playPauseBtnContainer.classList.add('btnContainer');
            topController.appendChild(playPauseBtnContainer);
                //Create play-pause btn
                playPauseBtn = document.createElement('img');
                playPauseBtn.classList.add('controllerBtn');
                playPauseBtn.src = 'images/btn_pause.png';
                playPauseBtnContainer.appendChild(playPauseBtn);
            //Create sound on-off btn container
            soundOnOffBtnContainer = document.createElement('div');
            soundOnOffBtnContainer.classList.add('btnContainer');
            topController.appendChild(soundOnOffBtnContainer);
                //Create sound on-off btn
                soundOnOffBtn = document.createElement('img');
                soundOnOffBtn.classList.add('controllerBtn');
                soundOnOffBtn.src = 'images/btn_soundOn.png';
                soundOnOffBtnContainer.appendChild(soundOnOffBtn);
        //Create bottom controller
        bottomController = document.createElement('div');
        bottomController.classList.add('bottomControllerContainer');
        canvasContainer.appendChild(bottomController);
            //Create score container
            scoreContainerBackground = document.createElement('div');
            scoreContainerBackground.classList.add('scoreContainerBackground');
            bottomController.appendChild(scoreContainerBackground);
                //Create score
                scoreContainer = document.createElement('div');
                scoreContainer.classList.add('scoreContainer');
                scoreContainerBackground.appendChild(scoreContainer);
                    //Create score text
                    scoreValue = document.createElement('p');
                    scoreValue.classList.add('scoreValue');
                    scoreContainer.appendChild(scoreValue);
            //Create right container
            rightContainer = document.createElement('div');
            rightContainer.classList.add('rightContainer');
            bottomController.appendChild(rightContainer);
                //Create life bar container
                lifeBarContainer = document.createElement('div');
                lifeBarContainer.classList.add('lifesContainer');
                bottomController.appendChild(lifeBarContainer);
                    //Create life bar container
                    lifesBar = document.createElement('img');
                    lifesBar.classList.add('lifesBar');
                    lifesBar.src = 'images/lifes_3.png';
                    lifeBarContainer.appendChild(lifesBar);
                //Create power-ups container
                powerUpsContainer = document.createElement('div');
                powerUpsContainer.classList.add('powerUpsContainer');
                bottomController.appendChild(powerUpsContainer);
    
    ctx = canvas.getContext('2d');
    canvas.height = 900;
    canvas.width = 1750;

    // Mouse interactivity
    canvasPosition = canvas.getBoundingClientRect();
    onresize = (event) => {
        canvasPosition = canvas.getBoundingClientRect();
    };

    mouse = {
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

    playPauseBtn.addEventListener('click', function(){
        play ? play = false : play = true;

        if (play) {
            animate();
        }
        
        //Change Btn Image
        if (play) {
            playPauseBtn.src = 'images/btn_pause.png';
        } else {
            playPauseBtn.src = 'images/btn_play.png';
        }
    });

    soundOnOffBtn.addEventListener('click', function(){
        soundOn ? soundOn = false : soundOn = true;

        //Change Btn Image
        if (soundOn) {
            soundOnOffBtn.src = 'images/btn_soundOn.png';
        } else {
            soundOnOffBtn.src = 'images/btn_soundOff.png';
        }
    });


//Repeating background ----------------------------------------------------------------------------------------------

class Background {
    constructor(backgoundSpeed, backgoundImage) {
        this.x1 = 0;
        this.x2 = canvas.width;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.backgoundSpeed = backgoundSpeed;
        this.backgoundImage = backgoundImage;
    }
    moveBackground() {
        //First Image
        this.x1 -= this.backgoundSpeed;
        if (this.x1 <= -this.width) {
            this.x1 = this.width;
        }
        ctx.drawImage(this.backgoundImage, this.x1, this.y, this.width, this.height);

        //Second Image
        this.x2 -= this.backgoundSpeed;
        if (this.x2 <= -this.width) {
            this.x2 = this.width;
        }
        ctx.drawImage(this.backgoundImage, this.x2, this.y, this.width, this.height);
    }
}

//Layer 1
const backgoundImageLayer1 = new Image();
backgoundImageLayer1.src = 'images/background_level1_paralax1.png';
let backgoundLayer1 = new Background (gameSpeed/1, backgoundImageLayer1);

//Layer 2
const backgoundImageLayer2 = new Image();
backgoundImageLayer2.src = 'images/background_level1_paralax2.png';
let backgoundLayer2 = new Background (gameSpeed/2.5, backgoundImageLayer2);

//Layer 3
const backgoundImageLayer3 = new Image();
backgoundImageLayer3.src = 'images/background_level1_paralax3.png';
let backgoundLayer3 = new Background (0, backgoundImageLayer3);

//Layer 4
const backgoundImageLayer4 = new Image();
backgoundImageLayer4.src = 'images/background_level1_paralax4.png';
let backgoundLayer4 = new Background (0, backgoundImageLayer4);

function handleBackground() {
    backgoundLayer1.moveBackground();
    backgoundLayer2.moveBackground();
    backgoundLayer3.moveBackground();
    backgoundLayer4.moveBackground();
}

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
        this.dx;
        this.dy;
    }

    update() {
        //Distance on the horizontal x-axis and on the vertical y-axis
        this.dx = this.x - mouse.x; 
        this.dy = this.y - mouse.y;

        //Move the character towards the mouse position
        if (this.x != mouse.x) {
            this.x -= this.dx/this.speed;
        } 
        if (this.y != mouse.y) {
            this.y -= this.dy/this.speed;
        }

        //calculate angle of movement
        let theta = Math.atan2(this.dy, this.dx)
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

//Bubble pop sound effect
const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'sounds/BubblePop1.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = 'sounds/BubblePop2.ogg';

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
        //random sound when bubble is popped
        this.sound = Math.random() < 0.5 ? 1 : 2;
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
        else if (!bubble.popped && bubble.distance < player.radius + bubble.radius) {
            if (soundOn) {
                bubble.sound == 1 ? bubblePop1.play() : bubblePop2.play();
            }
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


//Enemies -----------------------------------------------------------------------------------------------------------

let enemiesArray = [];

//Enemies animation spritesheets
const enemyLeft = new Image();
enemyLeft.src = 'images/enemy_swim_left.png';
const enemyRight = new Image();
enemyRight.src = 'images/enemy_swim_right.png';

//Enemies collision sound effect
const enemyCollisionSound = document.createElement('audio');
enemyCollisionSound.src = 'sounds/ouch0.mp3';

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
        //Change sprite every 5 frames
        if (gameFrame % 5 == 0) {
            this.frame++;
            if (this.frame > 11) {
                this.frame = 0;
            }
            //Setting frameX and frameY
            if (this.frame <= 3) {
                this.frameY = 0;
            } else if (this.frame <= 7) {
                this.frameY = 1;
            } else if (this.frame <= 11){
                this.frameY = 2;
            } else {
                this.frameY = 0;
            }
            if (this.movesTo == 'left') {
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

        //Loose a life
        else if (enemy.distance < player.radius + enemy.radius) {
            if (soundOn) { enemyCollisionSound.play(); }
            lifes--;
            uptadeLifes();
            enemiesArray.splice(i,1);
            i--;
            if (lifes == 0) {
                handleGameOver();
            }
        }
    });
}

//Lifes bar --------------------------------------------------------------------------------------------------------

function uptadeLifes () {
    if (lifes == 3) {
        lifesBar.src = 'images/lifes_3.png';
    } else if (lifes == 2) {
        lifesBar.src = 'images/lifes_2.png';
    } else if (lifes == 1) {
        lifesBar.src = 'images/lifes_1.png';
    } else {
        lifesBar.src = 'images/lifes_0.png';
    }
}

//Power-ups-------------------------------------------------------------------------------------------------------

class PowerUp {
    constructor(img) {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = 0;
        this.distance;
        this.img = img;
        this.PUSound = new Audio ('sounds/extra_life.flac');
    }
    update() { 
        //Move up
        this.y -= this.speed;
        //Distance betwen power-up and player
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }
    draw() {
        ctx.drawImage(this.img, this.x-50, this.y-50, this.radius*2, this.radius*2);
    }
    reset() {
        // Bring extra life back down once it goes out of the canvas top
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + this.radius*2;
            this.speed = 0;
    }
}

//Extra life 

//Extra life image
const extraLifeImage = new Image();
extraLifeImage.src = 'images/extra_life.png';

//Extra life sound effect
const extraLifeSound = document.createElement('audio');
extraLifeSound.src = 'sounds/extra_life.flac';

class ExtraLife extends PowerUp {
    constructor() {
        super(extraLifeImage);
    }
    handle() {
        //Push extra life up every 1300 frames
        if (lifes < 3 && this.speed == 0 && gameFrame % 1300 == 0) {  
            this.speed = Math.random() * 6 + 1;
        } else {
            this.draw();
            this.update();
            //Pick extra life and reset
            if (this.y < 0 - this.radius*2) {
                this.reset();
            } else if (this.distance < player.radius + this.radius) {
                if (soundOn) {
                    extraLifeSound.play();
                }
                lifes++;
                uptadeLifes();
                this.reset();
            }
        }
    }
}

const extraLife = new ExtraLife();

function handlePowerUps() {
    extraLife.handle();
    speedPU.handle();
}

//Speed power-up 

//Speed power-up image
const speedPUImage = new Image();
speedPUImage.src = 'images/speed_PU.png';

//Speed power-up sound effect
const speedPUSound = document.createElement('audio');
speedPUSound.src = 'sounds/speedPUSound.mp3';

class SpeedPU extends PowerUp {
    constructor() {
        super(speedPUImage);
        this.startingFrame;
        this.speedPUOn = false;
    }
    handle() {
        //Push speed power-up every 1300 frames
        if (!this.speedPUOn && gameFrame > 250 && gameFrame % 130 == 0) {  
            this.speed = Math.random() * 6 + 1;
        } else {
            this.draw();
            this.update();
            //Pick speed power-up and reset
            if (this.y < 0 - this.radius*2) {
                this.reset();
            } else if (this.distance < player.radius + this.radius) {
                if (soundOn) {
                    this.PUSound.play();
                }
                this.startingFrame = gameFrame;
                this.speedPUOn = true;
                player.speed = 10;
                this.reset();
                //Add speed icon to power-ups container
                speedIcon = document.createElement('img');
                speedIcon.classList.add('powerUp');
                speedIcon.src = speedPUImage.src;
                lifeBarContainer.appendChild(speedIcon);
            }
        }
        //Play speed power-up sound
        if (soundOn && this.speedPUOn && (player.dx > 2 || player.dy > 2)) {
            speedPUSound.play();
        } else {
            speedPUSound.pause();
        }
        //Stop speed power-up
        if (this.speedPUOn && gameFrame > this.startingFrame + 300) {
            player.speed = 40;
            this.speedPUOn = false;
            //Remove speed icon from power-ups container
            speedIcon.remove();
        }
    }
}

const speedPU = new SpeedPU();

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
    handlePowerUps();
    scoreValue.innerText = score;
    //increase game frame, it increases endlessly as the game runs. I'll use it to add periodic events to the game.
    gameFrame++;
    //Create animation loop though recursion
    if (!gameOver && play) requestAnimationFrame(animate); 
}

if (play) {
    animate();
}

}

//Initializing game ------------------------------------------------------------------------------------------------
let score = 0;
let lifes = 3;
let gameFrame = 0;
let gameSpeed = 1;
let gameOver = false;
let soundOn = true;
let play = false;

gameInitBtn.addEventListener('click', function(){
    play ? play = false : play = true;

    gameInit.remove();

    if (play) {
        canvasSetUp();
    }
    
})

