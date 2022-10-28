
// Selectors -------------------------------------------------------------------------------------------------------
const body = document.querySelector('body')
const gameContainer = document.querySelector('.gameContainer')
const gameInit = document.querySelector('.gameInit')
const gameInitBtn = document.querySelector('.gameInitBtnContainer')

// Initializing game ------------------------------------------------------------------------------------------------
const gameConfig = deepSeal(config)
let score = 0
let gameOver = false
let play = false
let soundOn = true

gameInitBtn.addEventListener('click', () => {
  play = !play

  gameInit.remove()

  if (play) {
    canvasSetUp()
  }
})

//  Canvas setup ---------------------------------------------------------------------------------------------------
let boostIcon
let bottomController
let bubblesArray = []
let canvas
let canvasContainer
let canvasPosition
let ctx
let lifeBarContainer
let lifesBar
let magnetIcon
let mouse
let playPauseBtn
let playPauseBtnContainer
let powerUpsContainer
let rightContainer
let scoreContainer
let scoreContainerBackground
let scoreValue
let soundOnOffBtn
let soundOnOffBtnContainer
let speedIcon
let topController

const canvasSetUp = () => {
  const playPause = () => {
    play = !play

    if (play) {
      animate()
    }

    // Change Btn Image
    if (play) {
      playPauseBtn.src = 'images/btn_pause.png'
    } else {
      playPauseBtn.src = 'images/btn_play.png'
    }
  }

  const soundOnOff = () => {
    soundOn = !soundOn

    // Change Btn Image
    if (soundOn) {
      soundOnOffBtn.src = 'images/btn_soundOn.png'
    } else {
      soundOnOffBtn.src = 'images/btn_soundOff.png'
    }
  }

  // Keys capture
  // Space key: Pause game
  // Ctrl + M: Sound On/Off
  body.addEventListener('keypress', (event) => {
    event.preventDefault()

    switch (event.code) {
      case 'KeyM':
        if (event.ctrlKey) {
          soundOnOff()
        }

        break

      case 'Space':
        playPause()

        break
    }
  })

  // Create canvas container
  canvasContainer = createElement('div', { className: 'canvasContainer' })
  gameContainer.appendChild(canvasContainer)

  // Create canvas element
  canvas = createElement('canvas', { className: 'gameCanvas' })
  canvasContainer.appendChild(canvas)

  // Create top controller
  topController = createElement('div', { className: 'topControllerContainer' })
  canvasContainer.appendChild(topController)

  // Create play-pause btn container
  playPauseBtnContainer = createElement('div', { className: 'btnContainer' })
  topController.appendChild(playPauseBtnContainer)

  // Create play-pause btn
  playPauseBtn = createElement('img', {
    className: 'controllerBtn',
    src: 'images/btn_pause.png'
  })
  playPauseBtnContainer.appendChild(playPauseBtn)

  // Create sound on-off btn container
  soundOnOffBtnContainer = createElement('div', { className: 'btnContainer' })
  topController.appendChild(soundOnOffBtnContainer)

  // Create sound on-off btn
  soundOnOffBtn = createElement('img', {
    className: 'controllerBtn',
    src: 'images/btn_soundOn.png'
  })
  soundOnOffBtnContainer.appendChild(soundOnOffBtn)

  // Create bottom controller
  bottomController = createElement('div', { className: 'bottomControllerContainer' })
  canvasContainer.appendChild(bottomController)

  // Create score container
  scoreContainerBackground = createElement('div', { className: 'scoreContainerBackground' })
  bottomController.appendChild(scoreContainerBackground)

  // Create score
  scoreContainer = createElement('div', { className: 'scoreContainer' })
  scoreContainerBackground.appendChild(scoreContainer)

  // Create score text
  scoreValue = createElement('p', { className: 'scoreValue' })
  scoreContainer.appendChild(scoreValue)

  // Create right container
  rightContainer = createElement('div', { className: 'rightContainer' })
  bottomController.appendChild(rightContainer)

  // Create life bar container
  lifeBarContainer = createElement('div', { className: 'lifesContainer' })
  bottomController.appendChild(lifeBarContainer)

  // Create life bar container
  lifesBar = createElement('img', {
    className: 'lifesBar',
    src: 'images/lifes_3.png'
  })
  lifeBarContainer.appendChild(lifesBar)

  // Create power-ups container
  powerUpsContainer = createElement('div', { className: 'powerUpsContainer' })
  bottomController.appendChild(powerUpsContainer)

  ctx = canvas.getContext('2d')
  canvas.height = config.canvas.height
  canvas.width = config.canvas.width

  //  Mouse interactivity
  canvasPosition = canvas.getBoundingClientRect()
  // onresize = (event) => {
  //   canvasPosition = canvas.getBoundingClientRect()
  // }

  mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
  }

  // Event Listeners -------------------------------------------------------------------------------------------------

  canvas.addEventListener('mousedown', (event) => {
    mouse.click = true
    mouse.x = event.x - canvasPosition.left
    mouse.y = event.y - canvasPosition.top
  })

  canvas.addEventListener('mouseup', () => {
    mouse.click = false
  })

  playPauseBtn.addEventListener('click', playPause)

  soundOnOffBtn.addEventListener('click', soundOnOff)

  // Repeating background ----------------------------------------------------------------------------------------------

  class Background {
    constructor (backgoundSpeed, backgoundImage) {
      this.x1 = 0
      this.x2 = canvas.width
      this.y = 0
      this.width = canvas.width
      this.height = canvas.height
      this.backgoundSpeed = backgoundSpeed
      this.backgoundImage = backgoundImage
    }

    moveBackground () {
      // First Image
      this.x1 -= this.backgoundSpeed
      if (this.x1 <= -this.width) {
        this.x1 = this.width
      }
      ctx.drawImage(this.backgoundImage, this.x1, this.y, this.width, this.height)

      // Second Image
      this.x2 -= this.backgoundSpeed
      if (this.x2 <= -this.width) {
        this.x2 = this.width
      }
      ctx.drawImage(this.backgoundImage, this.x2, this.y, this.width, this.height)
    }
  }

  // Layer 1
  const backgoundImageLayer1 = new Image()
  backgoundImageLayer1.src = 'images/background_level1_paralax1.png'
  const backgoundLayer1 = new Background(gameConfig.game.speed / 1, backgoundImageLayer1)

  // Layer 2
  const backgoundImageLayer2 = new Image()
  backgoundImageLayer2.src = 'images/background_level1_paralax2.png'
  const backgoundLayer2 = new Background(gameConfig.game.speed / 2.5, backgoundImageLayer2)

  // Layer 3
  const backgoundImageLayer3 = new Image()
  backgoundImageLayer3.src = 'images/background_level1_paralax3.png'
  const backgoundLayer3 = new Background(0, backgoundImageLayer3)

  // Layer 4
  const backgoundImageLayer4 = new Image()
  backgoundImageLayer4.src = 'images/background_level1_paralax4.png'
  const backgoundLayer4 = new Background(0, backgoundImageLayer4)

  const handleBackground = () => {
    backgoundLayer1.moveBackground()
    backgoundLayer2.moveBackground()
    backgoundLayer3.moveBackground()
    backgoundLayer4.moveBackground()
  }

  // Player character -----------------------------------------------------------------------------------------------

  // Player spritesheets
  const playerLeft = new Image()
  playerLeft.src = 'images/fish_swim_left.png'

  const playerRight = new Image()
  playerRight.src = 'images/fish_swim_right.png'

  class Player {
    constructor () {
      this.x = canvas.width / 2
      this.y = canvas.height / 2
      this.radius = 50
      this.angle = 0
      this.speed = 40
      this.frameX = 0
      this.frameY = 0
      this.frame = 0
      this.spriteWidth = 498
      this.spriteHeight = 327
      this.dx = 0
      this.dy = 0
    }

    update () {
      // Distance on the horizontal x-axis and on the vertical y-axis
      this.dx = this.x - mouse.x
      this.dy = this.y - mouse.y

      // Move the character towards the mouse position
      if (this.x !== mouse.x) {
        this.x -= this.dx / this.speed
      }
      if (this.y !== mouse.y) {
        this.y -= this.dy / this.speed
      }

      // calculate angle of movement
      const theta = Math.atan2(this.dy, this.dx)
      this.angle = theta

      // Change sprite every 5 frames
      if (gameConfig.game.frame % 5 === 0) {
        this.frame++
        if (this.frame > 11) {
          this.frame = 0
        }

        // Setting frameY
        if (this.frame >= 8) {
          this.frameY = 2
        } else if (this.frame >= 4) {
          this.frameY = 1
        } else {
          this.frameY = 0
        }

        // Setting frameX
        if (this.x >= mouse.x) {
          if (this.frame === 0 || this.frame === 4 || this.frame === 8) {
            this.frameX = 0
          } else if (this.frame === 1 || this.frame === 5 || this.frame === 9) {
            this.frameX = 1
          } else if (this.frame === 2 || this.frame === 6 || this.frame === 10) {
            this.frameX = 2
          } else if (this.frame === 3 || this.frame === 7 || this.frame === 11) {
            this.frameX = 3
          } else {
            this.frameX = 0
          }
        } else {
          if (this.frame === 0 || this.frame === 4 || this.frame === 8) {
            this.frameX = 3
          } else if (this.frame === 1 || this.frame === 5 || this.frame === 9) {
            this.frameX = 2
          } else if (this.frame === 2 || this.frame === 6 || this.frame === 10) {
            this.frameX = 1
          } else {
            this.frameX = 0
          }
        }
      }
    }

    draw () {
      //  Draw a line representing the path the character is going to move on
      if (mouse.click) {
        ctx.lineWidth = 0.2
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.stroke()
      }

      // Rotate the character towards moving direction
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(this.angle)

      //  Animate the character
      if (this.x >= mouse.x) {
        ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth / 4, this.spriteHeight / 4)
      } else {
        ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth / 4, this.spriteHeight / 4)
      }

      ctx.restore()
    }
  }

  const player = new Player()

  //  Bubbles -----------------------------------------------------------------------------------------------------

  let bubbleFrequence = 50

  // Bubble animation spritesheet
  const bubbleImage = new Image()
  bubbleImage.src = 'images/bubble_pop_under_water_spritesheet.png'

  // Bubble pop sound effect
  const bubblePop1 = createElement('audio', { src: 'sounds/BubblePop1.ogg' })
  const bubblePop2 = createElement('audio', { src: 'sounds/BubblePop2.ogg' })

  class Bubble {
    constructor () {
      this.x = Math.random() * canvas.width
      this.y = canvas.height + 100
      this.radius = 50
      this.speed = Math.random() * 5 + 1
      this.distance = 0
      this.frameX = 0
      this.frameY = 0
      this.frame = 0
      this.spriteWidth = 394
      this.spriteHeight = 511
      this.popped = false

      // random sound when bubble is popped
      this.sound = Math.random() < 0.5 ? 1 : 2
    }

    update () {
      // Distance betwen bubble and player
      const dx = this.x - player.x
      const dy = this.y - player.y
      this.distance = Math.sqrt(dx * dx + dy * dy)

      // Magnet power-up: move bubbles towards player
      if (magnetPU.magnetPUOn) {
        if (this.x !== player.x) {
          this.x > player.x ? this.x -= this.speed : this.x += this.speed
        }
        if (this.y !== player.y) {
          this.y > player.y ? this.y -= this.speed : this.y += this.speed
        }
      } else {
        // Move bubbles up
        this.y -= this.speed
      }
    }

    draw () {
      ctx.drawImage(bubbleImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 54, this.y - 83, this.spriteWidth / 3.7, this.spriteHeight / 3.7)
    }
  }

  const handleBubbles = () => {
    // Create a new bubble every 50 frames
    if (gameConfig.game.frame % bubbleFrequence === 0) {
      bubblesArray.push(new Bubble())
    }

    bubblesArray.forEach((bubble) => {
      bubble.draw()
      bubble.update()
    })

    bubblesArray.forEach((bubble, index) => {
      //  Remove the bubble once it goes out of the canvas top
      if (bubble.y < 0 - bubble.radius * 2) {
        bubblesArray.splice(index, 1)
        index--
      } else if (!bubble.popped && bubble.distance < player.radius + bubble.radius) {
        // Pop the bubbles
        if (play && soundOn) {
          bubble.sound === 1 ? bubblePop1.play() : bubblePop2.play()
        }

        bubble.popped = true
      }

      // Animate pop
      if (bubble.popped) {
        if (bubble.frame <= 5) {
          // Change sprite every 5 frames
          if (gameConfig.game.frame % 5 === 0) {
            bubble.frame++

            // Setting frameY
            bubble.frame >= 3 ? bubble.frameY = 1 : bubble.frameY = 0

            // Setting frameX
            if (bubble.frame === 2 || bubble.frame === 5) {
              bubble.frameX = 2
            } else if (bubble.frame === 1 || bubble.frame === 4) {
              bubble.frameX = 1
            } else {
              bubble.frameX = 0
            }
          }
        } else {
          score++
          bubblesArray.splice(index, 1)
          index--
        }
      }
    })
  }

  // Enemies -----------------------------------------------------------------------------------------------------------

  const enemiesArray = []

  // Enemies animation spritesheets
  const enemyLeft = new Image()
  enemyLeft.src = 'images/enemy_swim_left.png'
  const enemyRight = new Image()
  enemyRight.src = 'images/enemy_swim_right.png'

  // Enemies collision sound effect
  const enemyCollisionSound = createElement('audio', { src: 'sounds/ouch0.mp3' })

  class Enemy {
    constructor () {
      this.movesTo = Math.random() < 0.5 ? 'right' : 'left'
      this.radius = 55
      this.x = this.movesTo === 'right' ? 0 - this.radius * 2 : canvas.width + this.radius * 2
      this.y = Math.random() * canvas.height
      this.speed = Math.random() * 3 + 1
      this.distance = 0
      this.image = this.movesTo === 'right' ? enemyRight : enemyLeft
      this.frameX = 0
      this.frameY = 0
      this.frame = 0
      this.spriteWidth = 418
      this.spriteHeight = 397
    }

    update () {
      // move enemy left or right
      if (this.movesTo === 'right') {
        this.x += this.speed
      } else {
        this.x -= this.speed
      }

      // Distance betwen enemy and player
      const dx = this.x - player.x
      const dy = this.y - player.y
      this.distance = Math.sqrt(dx * dx + dy * dy)

      // Change sprite every 5 frames
      if (gameConfig.game.frame % 5 === 0) {
        this.frame++
        if (this.frame > 11) {
          this.frame = 0
        }

        // Setting frameX and frameY
        if (this.frame <= 3) {
          this.frameY = 0
        } else if (this.frame <= 7) {
          this.frameY = 1
        } else if (this.frame <= 11) {
          this.frameY = 2
        } else {
          this.frameY = 0
        }

        if (this.movesTo === 'left') {
          if (this.frame === 0 || this.frame === 4 || this.frame === 8) {
            this.frameX = 0
          } else if (this.frame === 1 || this.frame === 5 || this.frame === 9) {
            this.frameX = 1
          } else if (this.frame === 2 || this.frame === 6 || this.frame === 10) {
            this.frameX = 2
          } else if (this.frame === 3 || this.frame === 7 || this.frame === 11) {
            this.frameX = 3
          } else {
            this.frameX = 0
          }
        } else {
          if (this.frame === 0 || this.frame === 4 || this.frame === 8) {
            this.frameX = 3
          } else if (this.frame === 1 || this.frame === 5 || this.frame === 9) {
            this.frameX = 2
          } else if (this.frame === 2 || this.frame === 6 || this.frame === 10) {
            this.frameX = 1
          } else {
            this.frameX = 0
          }
        }
      }
    }

    draw () {
      ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.movesTo === 'right' ? this.x - 70 : this.x - 60, this.y - 60, this.spriteWidth / 3.3, this.spriteHeight / 3.3)
    }
  }

  const handleEnemies = () => {
    // Create a new enemy every 400 frames
    if (gameConfig.game.frame % 400 === 0) {
      enemiesArray.push(new Enemy())
    }

    enemiesArray.forEach((enemy) => {
      enemy.draw()
      enemy.update()
    })

    enemiesArray.forEach((enemy, index) => {
      //  Remove the enemy once it goes out of the canvas
      if (enemy.x < 0 - enemy.radius * 2 || enemy.x > canvas.width + enemy.radius * 2) {
        enemiesArray.splice(index, 1)
        index--
      } else if (enemy.distance < player.radius + enemy.radius) {
        // Loose a life
        if (play && soundOn) {
          enemyCollisionSound.play()
        }

        gameConfig.game.lifes--

        uptadeLifes()

        enemiesArray.splice(index, 1)

        index--

        if (gameConfig.game.lifes === 0) {
          handleGameOver()
        }
      }
    })
  }

  // Lifes bar --------------------------------------------------------------------------------------------------------

  const uptadeLifes = () => {
    if (gameConfig.game.lifes > 0) {
      lifesBar.src = `images/lifes_${gameConfig.game.lifes}.png`

      return
    }

    lifesBar.src = 'images/lifes_0.png'
  }

  // Power-ups-------------------------------------------------------------------------------------------------------

  class PowerUp {
    constructor (img) {
      this.x = Math.random() * canvas.width
      this.y = canvas.height + 100
      this.radius = 50
      this.speed = 0
      this.distance = 0
      this.img = img
      this.PUSound = new Audio('sounds/extra_life.flac')
    }

    update () {
      // Move up
      this.y -= this.speed

      // Distance betwen power-up and player
      const dx = this.x - player.x
      const dy = this.y - player.y
      this.distance = Math.sqrt(dx * dx + dy * dy)
    }

    draw () {
      ctx.drawImage(this.img, this.x - 50, this.y - 50, this.radius * 2, this.radius * 2)
    }

    reset () {
      //  Bring extra life back down once it goes out of the canvas top
      this.x = Math.random() * canvas.width
      this.y = canvas.height + this.radius * 2
      this.speed = 0
    }
  }

  // Extra life ------------------------------------------------------

  // Extra life image
  const extraLifeImage = new Image()
  extraLifeImage.src = 'images/extra_life.png'

  // Extra life sound effect
  const extraLifeSound = createElement('audio', { src: 'sounds/extra_life.flac' })

  class ExtraLife extends PowerUp {
    constructor () {
      super(extraLifeImage)
    }

    handle () {
      // Push extra life up every 1300 frames
      if (gameConfig.game.lifes < 3 && this.speed === 0 && gameConfig.game.frame % 1300 === 0) {
        this.speed = Math.random() * 6 + 1
      } else {
        this.draw()
        this.update()

        // Pick extra life and reset
        if (this.y < 0 - this.radius * 2) {
          this.reset()
        } else if (this.distance < player.radius + this.radius) {
          if (play && soundOn) {
            extraLifeSound.play()
          }
          gameConfig.game.lifes++
          uptadeLifes()
          this.reset()
        }
      }
    }
  }

  const extraLife = new ExtraLife()

  // Speed power-up ------------------------------------------------------

  // Speed power-up image
  const speedPUImage = new Image()
  speedPUImage.src = 'images/speed_PU.png'

  // Speed power-up sound effect
  const speedPUSound = createElement('audio', { src: 'sounds/speedPUSound.mp3' })

  class SpeedPU extends PowerUp {
    constructor () {
      super(speedPUImage)
      this.startingFrame = 0
      this.speedPUOn = false
    }

    handle () {
      // Push speed power-up every 1300 frames
      if (!this.speedPUOn && this.speed === 0 && gameConfig.game.frame > 250 && gameConfig.game.frame % 130 === 0) {
        this.speed = Math.random() * 6 + 1
      } else {
        this.draw()
        this.update()

        // Pick speed power-up and reset
        if (this.y < 0 - this.radius * 2) {
          this.reset()
        } else if (this.distance < player.radius + this.radius) {
          if (play && soundOn) {
            this.PUSound.play()
          }
          this.startingFrame = gameConfig.game.frame
          this.speedPUOn = true
          player.speed = 10
          this.reset()

          // Add speed icon to power-ups container
          speedIcon = createElement('img', {
            className: 'powerUp',
            src: speedPUImage.src
          })
          lifeBarContainer.appendChild(speedIcon)
        }
      }

      // Play speed power-up sound
      if (play && soundOn && this.speedPUOn && (player.dx > 2 || player.dy > 2)) {
        speedPUSound.play()
      } else {
        speedPUSound.pause()
      }

      // Stop speed power-up
      if (this.speedPUOn && gameConfig.game.frame > this.startingFrame + 300) {
        player.speed = 40
        this.speedPUOn = false

        // Remove speed icon from power-ups container
        speedIcon.remove()
      }
    }
  }

  const speedPU = new SpeedPU()

  // Boost power-up ------------------------------------------------------

  // Boost power-up image
  const boostPUImage = new Image()
  boostPUImage.src = 'images/boost_PU.png'

  // boost power-up sound effect
  const boostPUSound = createElement('audio', { src: 'sounds/boostPUSound.wav' })

  class BoostPU extends PowerUp {
    constructor () {
      super(boostPUImage)
      this.startingFrame = 0
      this.boostPUOn = false
    }

    handle () {
      // Push boost power-up every 1300 frames
      if (!this.boostPUOn && this.speed === 0 && gameConfig.game.frame > 350 && gameConfig.game.frame % 230 === 0) {
        this.speed = Math.random() * 6 + 1
      } else {
        this.draw()
        this.update()

        // Pick boost power-up and reset
        if (this.y < 0 - this.radius * 2) {
          this.reset()
        } else if (this.distance < player.radius + this.radius) {
          if (play && soundOn) {
            this.PUSound.play()
          }
          this.startingFrame = gameConfig.game.frame
          this.boostPUOn = true
          bubbleFrequence = 2
          this.reset()

          // Add boost icon to power-ups container
          boostIcon = createElement('img', {
            className: 'powerUp',
            src: boostPUImage.src
          })
          lifeBarContainer.appendChild(boostIcon)
        }
      }

      // Play boost power-up sound
      if (play && soundOn && this.boostPUOn) {
        boostPUSound.play()
      } else {
        boostPUSound.pause()
      }

      // Stop boost power-up
      if (this.boostPUOn && gameConfig.game.frame > this.startingFrame + 300) {
        this.boostPUOn = false
        bubbleFrequence = 50

        // Remove boost icon from power-ups container
        boostIcon.remove()
      }
    }
  }

  const boostPU = new BoostPU()

  // Magnet power-up ------------------------------------------------------

  // Magnet power-up image
  const magnetPUImage = new Image()
  magnetPUImage.src = 'images/magnet_PU.png'

  class MagnetPU extends PowerUp {
    constructor () {
      super(magnetPUImage)
      this.startingFrame = 0
      this.magnetPUOn = false
    }

    handle () {
      // Push magnet power-up every 1300 frames
      if (!this.magnetPUOn && this.speed === 0 && gameConfig.game.frame > 350 && gameConfig.game.frame % 230 === 0) {
        this.speed = Math.random() * 6 + 1
      } else {
        this.draw()
        this.update()

        // Pick magnet power-up and reset
        if (this.y < 0 - this.radius * 2) {
          this.reset()
        } else if (this.distance < player.radius + this.radius) {
          if (play && soundOn) {
            this.PUSound.play()
          }
          this.startingFrame = gameConfig.game.frame
          this.magnetPUOn = true
          this.reset()

          // Add magnet icon to power-ups container
          magnetIcon = createElement('img', {
            className: 'powerUp',
            src: magnetPUImage.src
          })
          lifeBarContainer.appendChild(magnetIcon)
        }
      }

      // Stop magnet power-up
      if (this.magnetPUOn && gameConfig.game.frame > this.startingFrame + 1200) {
        this.magnetPUOn = false

        // Remove magnet icon from power-ups container
        magnetIcon.remove()
      }
    }
  }

  const magnetPU = new MagnetPU()

  // Handle power-ups ------------------------------------------------------

  const handlePowerUps = () => {
    extraLife.handle()
    speedPU.handle()
    boostPU.handle()
    magnetPU.handle()
  }

  // Game Over ----------------------------------------------------------------------------------------------------------

  const handleGameOver = () => {
    gameOver = true

    // Game Over Alert
    const gameOverAlert = createElement('div', { className: 'gameOverAlert' })
    canvasContainer.appendChild(gameOverAlert)

    // Fog effect
    const fogEffect = createElement('div', { className: 'fogEffect' })
    gameOverAlert.appendChild(fogEffect)

    // Frame
    const gameOverFrame = createElement('div', { className: 'gameOverFrame' })
    fogEffect.appendChild(gameOverFrame)

    // Content
    const gameOverContent = createElement('div', { className: 'gameOverContent' })
    gameOverFrame.appendChild(gameOverContent)

    // Content Dashed Border
    const gameOverContentBorder = createElement('div', { className: 'gameOverContentBorder' })
    gameOverContent.appendChild(gameOverContentBorder)

    // Title
    const gameOverTitle = createElement('h2', {
      innerText: 'Game Over',
      className: 'gameOverTitle'
    })
    gameOverContentBorder.appendChild(gameOverTitle)

    // Score Title
    const gameOverScoreTitle = createElement('p', {
      innerText: 'Score: ',
      className: 'gameOverScoreTitle'
    })
    gameOverContentBorder.appendChild(gameOverScoreTitle)

    // Score Value
    const gameOverScoreValue = createElement('p', {
      innerText: formatScore(score, false),
      className: 'gameOverScoreValue'
    })
    gameOverContentBorder.appendChild(gameOverScoreValue)

    // Button
    const restartBtnFrame = createElement('div', { className: 'restartBtnFrame' })
    gameOverContentBorder.appendChild(restartBtnFrame)

    // Button
    const restartBtn = createElement('h2', {
      innerText: 'Try again',
      className: 'restartBtn'
    })
    restartBtnFrame.appendChild(restartBtn)

    // Restart ------------------------------------------------------------------------------------------------------------
    restartBtn.addEventListener('click', () => {
      gameOverAlert.remove()

      // Reset power-ups
      speedPU.reset()

      if (speedPU.speedPUOn) {
        player.speed = 40
        speedPU.speedPUOn = false
        speedIcon.remove()
      }

      boostPU.reset()

      if (boostPU.boostPUOn) {
        bubbleFrequence = 50
        boostPU.boostPUOn = false
        boostIcon.remove()
      }

      magnetPU.reset()

      if (magnetPU.magnetPUOn) {
        magnetPU.magnetPUOn = false
        magnetIcon.remove()
      }

      // Reset initial values
      score = 0
      gameConfig.game.lifes = 3
      gameConfig.game.frame = 0
      gameConfig.game.speed = 1
      bubblesArray = []

      uptadeLifes()

      gameOver = false
      play = true

      animate()
    })
  }

  //  Animation loop ----------------------------------------------------------------------------------------------------
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    handleBackground()
    handleEnemies()

    // calculate player position
    player.update()

    // draw player
    player.draw()
    handleBubbles()
    handlePowerUps()
    scoreValue.innerText = formatScore(score)

    // increase game frame, it increases endlessly as the game runs. I'll use it to add periodic events to the game.
    gameConfig.game.frame++

    // Create animation loop though recursion
    if (!gameOver && play) {
      window.requestAnimationFrame(animate)
    }
  }

  if (play) {
    animate()
  }
}
