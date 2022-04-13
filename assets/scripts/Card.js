class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, value, position) {
    super(scene, 0.5, 0.5, "card");
    this.scene = scene;
    this.value = value;
    this.scene.add.existing(this);
    this.opened = false;
    this.setInteractive();
  }
  flip() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: "Linear",
      duration: 150,
      onComplete: () => {
        this.show();
      },
    });
  }
  show() {
    let texture = this.opened ? "card" + this.value : "card";
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
    this.flip();
  }
  close() {
    if (this.opened) {
      this.opened = false;
      this.flip();
    }
  }
}
