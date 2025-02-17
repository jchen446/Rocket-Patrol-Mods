class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('bullet', './assets/bullet.png');
        this.load.image('car', './assets/rover.png');
        this.load.image('tank', './assets/tank.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('gg', './assets/gameover.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'bullet').setOrigin(0.5, 0);

        // add Spaceships (x3)
        if (game.settings.easy){
            this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'tank', 0, 30).setOrigin(0, 0);
          this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'tank', 0, 20).setOrigin(0,0);
            this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'tank', 0, 10).setOrigin(0,0);
        }else{
            this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'car', 0, 50).setOrigin(0, 0);
            this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'car', 0, 30).setOrigin(0,0);
            this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'car', 0, 15).setOrigin(0,0);
        }

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        //cursor
        
        this.input.on('pointerdown', function (pointer) {
            this.p1Rocket.isFiring = true;
            this.p1Rocket.sfxRocket.play();
        }, this);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let settingConfig = {
            fontFamily: 'Stencil Std, fantasy',
            fontSize: '28px',
            backgroundColor: '#9999FF',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 'SCORE: ' + this.p1Score, settingConfig);
        // GAME OVER flag
        this.gameOver = false;
        settingConfig.fixedWidth = 0;
        this.clockRight = this.add.text(game.config.width/2 + borderUISize*2.5 + borderPadding*2.5, borderUISize + borderPadding*2,'TIMER: ' + game.settings.gameTimer/1000 + ' SECS', settingConfig);
        this.clockInterval = setInterval(myTimer, 1000);
        function myTimer() {
            game.settings.gameTimer -= 1000;
          }
    }

    update() {
        //update cursor position
        this.input.on('pointermove', function (pointer) {
            if(this.p1Rocket.isFiring == false){
                this.p1Rocket.x = pointer.x;
            }
        }, this);

        let gameoverConfig = {
            fontFamily: 'Stencil Std, fantasy',
            fontSize: '80px',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        // play clock
       if(game.settings.gameTimer <= 0){
            clearInterval(this.clockInterval);
            this.gameover = this.add.tileSprite(0, 0, 640, 480, 'gg').setOrigin(0, 0);
            this.add.text(game.config.width/2, game.config.height/6, 'GOOD JOB!', gameoverConfig).setOrigin(0.5);
            gameoverConfig.fontSize = '100px';
            this.add.text(game.config.width/2, game.config.height/2, 'SCORE: ' + this.p1Score, gameoverConfig).setOrigin(0.5);
            gameoverConfig.fontSize = '45px';
            this.add.text(game.config.width/2, game.config.height - 64, 'Press (R) to Restart or ← to Menu', gameoverConfig).setOrigin(0.5);
            this.gameOver = true;

        }

        this.clockRight.text = 'TIMER: ' + this.timer/1000 + ' SECS';
       // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;  // update tile sprite

        if(!this.gameOver) {
            this.clockRight.text = 'TIMER: ' + game.settings.gameTimer/1000 + ' SECS';
            this.p1Rocket.update();             // update p1
            this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
        }else{
            this.clockRight.text = 'TIMER: ' + 0 + ' SECS';
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            if (game.settings.easy){
                game.settings.gameTimer += 1000;
            }else{
                game.settings.gameTimer += 2000;
            }
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            if (game.settings.easy){
                game.settings.gameTimer += 3000;
            }else{
                game.settings.gameTimer += 5000;
            }
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            if (game.settings.easy){
                game.settings.gameTimer += 5000;
            }else{
                game.settings.gameTimer += 8000;
            }
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = 'SCORE: ' + this.p1Score; 
        
        this.sound.play('sfx_explosion');
      }
}