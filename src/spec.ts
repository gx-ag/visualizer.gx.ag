export class Spec {
  public x: number;
  public y: number;
  public dir: number;

  constructor(public distance: number) {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.dir = Math.random() * Math.PI * 2;
  }

  update() {
    let speed = (((15 - this.distance) / 15) ** 3) * 5;
    this.x += Math.sin(this.dir) * speed;
    this.y += Math.cos(this.dir) * speed;
    if (this.x < -300) this.x = window.innerWidth + 300;
    if (this.y < -300) this.y = window.innerHeight + 300;
    if (this.x > window.innerWidth + 300) this.x = -300;
    if (this.y > window.innerHeight + 300) this.y = -300;
  }
}