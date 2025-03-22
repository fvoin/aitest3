export class Trace {
  constructor() {
    this.points = [];
    this.isActive = false;
    this.fadeOutSpeed = 0.05;
    this.maxOpacity = 0.6;
    this.opacity = this.maxOpacity;
  }
  
  reset() {
    this.points = [];
    this.isActive = false;
    this.opacity = this.maxOpacity;
  }
  
  start(x, y) {
    this.points = [{ x, y }];
    this.isActive = true;
    this.opacity = this.maxOpacity;
  }
  
  end() {
    this.isActive = false;
  }
  
  addPoint(x, y) {
    if (this.isActive) {
      this.points.push({ x, y });
    }
  }
  
  update() {
    if (!this.isActive && this.points.length > 0) {
      this.opacity -= this.fadeOutSpeed;
      
      if (this.opacity <= 0) {
        this.points = [];
        this.opacity = this.maxOpacity;
      }
    }
  }
  
  draw(ctx) {
    if (this.points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
} 