export class Candy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.vx = 0;
    this.vy = 0;
    this.color = '#FF69B4';
    this.mass = 1; // Mass property for physics calculations
  }
  
  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }
  
  applyGravity(gravity) {
    this.vy += gravity;
  }

  applyForce(force) {
    this.vy += force;
  }
  
  // Apply force in specific direction (for air pillows)
  applyDirectionalForce(forceX, forceY) {
    this.vx += forceX / this.mass;
    this.vy += forceY / this.mass;
  }
  
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
} 