class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }
  preload() {
    this.load.image("bg", "/assets/sprites/background.png");
    this.load.image("card", "/assets/sprites/card.png");

    this.load.image("card1", "/assets/sprites/card1.png");
    this.load.image("card2", "/assets/sprites/card2.png");
    this.load.image("card3", "/assets/sprites/card3.png");
    this.load.image("card4", "/assets/sprites/card4.png");
    this.load.image("card5", "/assets/sprites/card5.png");
    this.load.audio("theme", "./assets/sounds/theme.mp3");
    this.load.audio("card", "./assets/sounds/card.mp3");
    this.load.audio("complete", "./assets/sounds/complete.mp3");
    this.load.audio("timeout", "./assets/sounds/timeout.mp3");
    this.load.audio("success", "./assets/sounds/success.mp3");
  }
  createText() {
    this.timeoutText = this.add.text(10, 300, "Time: 15", {
      font: "36px CurseCasual",
      fill: "#fff",
    });
  }
  onTimerTick() {
    this.timeoutText.setText("Time: " + this.timeout);

    if (this.timeout <= 0) {
      this.timer.paused = true;
      this.sounds.timeout.play();
      this.restart();
    } else {
      --this.timeout;
    }
  }
  createTimer() {
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true,
    });
  }
  createSounds() {
    this.sounds = {
      card: this.sound.add("card"),
      theme: this.sound.add("theme"),
      success: this.sound.add("success"),
      timeout: this.sound.add("timeout"),
      complete: this.sound.add("complete"),
    };
    this.sounds.theme.play({ volume: 0.1 });
  }
  create() {
    this.createSounds();
    this.timeout = config.timeout;
    this.createTimer();
    this.createBackground();
    this.createCards();
    this.start();
    this.createText();
  }
  restart() {
    let count = 0;
    let onCardMoveComplete = () => {
      ++count;
      if (count >= this.cards.length) {
        this.start();
      }
    };
    this.cards.forEach((card) => {
      card.move({
        x: this.sys.game.config.width + card.width,
        y: this.sys.game.config.height + card.height,
        delay: card.position.delay,
        callback: onCardMoveComplete,
      });
    });
  }
  start() {
    this.timeout = config.timeout;
    this.openedCard = null;
    this.openedCardsCount = 0;
    this.timer.paused = false;
    this.initCards();
    this.showCards();
  }
  initCards() {
    let positions = this.getCardPisitions();

    this.cards.forEach((card) => {
      card.init(positions.pop());
    });
  }
  showCards() {
    this.cards.forEach((card) => {
      card.depth = card.position.delay;
      card.move({
        x: card.position.x,
        y: card.position.y,
        delay: card.position.delay,
      });
    });
  }
  createBackground() {
    this.add.sprite(0, 0, "bg").setOrigin(0, 0);
  }
  createCards() {
    this.cards = [];

    for (let value of config.cards) {
      for (let i = 0; i < 2; i++) {
        this.cards.push(new Card(this, value));
      }
    }
    this.input.on("gameobjectdown", this.onCardClicked, this);
  }
  onCardClicked(pointer, card) {
    this.sounds.card.play();
    if (card.opened) {
      return false;
    }
    if (this.openedCard) {
      if (this.openedCard.value === card.value) {
        this.sounds.success.play({ volume: 0.3 });
        this.openedCard = null;
        ++this.openedCardsCount;
      } else {
        this.openedCard.close();
        this.openedCard = card;
      }
    } else {
      this.openedCard = card;
    }

    card.open(() => {
      if (this.openedCardsCount === this.cards.length / 2) {
        this.sounds.complete.play();
        this.restart();
      }
    });
  }
  getCardPisitions() {
    let positions = [];
    let cardTextures = this.textures.get("card").getSourceImage();
    let cardWidth = cardTextures.width + 4;
    let cardHeight = cardTextures.height + 4;
    let id = 0;
    let offsetX =
      (this.sys.game.config.width - cardWidth * config.cols) / 2 +
      cardWidth / 2;
    let offsetY =
      (this.sys.game.config.height - cardHeight * config.rows) / 2 +
      cardHeight / 2;
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        ++id;
        positions.push({
          delay: id * 100,
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
        });
      }
    }
    return Phaser.Utils.Array.Shuffle(positions);
  }
}
