export class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.spikes = 5;
  }
  
  draw(ctx) {
    ctx.save();
    this.drawStarPath(ctx);
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  
  drawStarPath(ctx) {
    const outerRadius = this.size;
    const innerRadius = this.size / 2;
    
    ctx.beginPath();
    for (let i = 0; i < this.spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / this.spikes - Math.PI / 2;
      const x = this.x + radius * Math.cos(angle);
      const y = this.y + radius * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
  }
  
  checkCollision(candy) {
    const dx = candy.x - this.x;
    const dy = candy.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < candy.radius + this.size / 2;
  }
} 