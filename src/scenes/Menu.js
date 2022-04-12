class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Stencil Std, fantasy',
            fontSize: '48px',
            backgroundColor: '#000',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - 3 * borderUISize - 3 * borderPadding, 'Sniper Wars', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '28px';
        //  menuConfig.backgroundColor = '#F3B141';
        menuConfig.color = '#9999FF';
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Use ←→ arrows or mouse control to move', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'and', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, '(F) to fire or click to fire', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '36px';
        menuConfig.backgroundColor = '#FF0000';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + 4 * borderUISize + 4 * borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // Novice mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // Expert mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
      }
}