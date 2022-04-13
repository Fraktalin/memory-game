class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, value, position) {
    super(scene, 0.5, 0.5, "card");
    this.scene = scene;
    this.value = value;
    this.scene.add.existing(this);
    this.opened = false;
    this.setInteractive();
  }
  flip(texture) {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: "Linear",
      duration: 150,
      onComplete: () => {
        this.show(texture);
      },
    });
  }
  show(texture) {
    this.setTexture(texture);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      ease: "Linear",
      duration: 150,
    });
  }
  open() {
    this.opened = true;
    this.flip("card" + this.value);
  }
  close() {
    this.opened = false;
    this.flip("card");
  }
}
