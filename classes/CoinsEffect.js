export class CoinsEffect {
  constructor() {
    this.effects = [];
    this.active = false;
  }
  
  addCoins(amount, startX, startY, targetX, targetY) {
    this.active = true;
    // Limit number of coins for performance
    const coinCount = Math.min(Math.ceil(amount / 100), 20);
    
    for (let i = 0; i < coinCount; i++) {
      // Create random starting positions around the start point
      const randX = startX + (Math.random() - 0.5) * 40;
      const randY = startY + (Math.random() - 0.5) * 40;
      
      // Create random sizes for coins
      const size = 10 + Math.random() * 10;
      
      // Add random delay for staggered animation
      const delay = Math.random() * 30;
      
      // Random duration for natural movement
      const duration = 60 + Math.random() * 30;
      
      this.effects.push({
        x: randX,
        y: randY,
        startX: randX,
        startY: randY,
        targetX: targetX,
        targetY: targetY,
        size: size,
        progress: 0,
        delay: delay,
        duration: duration,
        active: true,
        value: Math.floor(amount / coinCount)
      });
    }
  }
  
  update() {
    if (this.effects.length === 0) {
      this.active = false;
      return;
    }
    
    let activeCount = 0;
    
    for (let i = 0; i < this.effects.length; i++) {
      const effect = this.effects[i];
      
      if (effect.delay > 0) {
        effect.delay--;
        activeCount++;
        continue;
      }
      
      if (effect.active) {
        effect.progress += 1 / effect.duration;
        
        if (effect.progress >= 1) {
          effect.progress = 1;
          effect.active = false;
        } else {
          activeCount++;
        }
        
        // Calculate current position using cubic easing
        const t = effect.progress;
        const easedT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        effect.x = effect.startX + (effect.targetX - effect.startX) * easedT;
        effect.y = effect.startY + (effect.targetY - effect.startY) * easedT;
      }
    }
    
    // If no active effects, clean up the array
    if (activeCount === 0) {
      this.effects = [];
      this.active = false;
    }
  }
  
  draw(ctx) {
    if (!this.active) return;
    
    for (const effect of this.effects) {
      if (effect.delay > 0) continue;
      
      // Calculate size with bounce effect
      const bounceEffect = Math.sin(effect.progress * Math.PI) * 0.3;
      const displaySize = effect.size * (1 + bounceEffect);
      
      // Calculate opacity (fade in/out)
      let opacity = 1;
      if (effect.progress < 0.2) {
        opacity = effect.progress / 0.2;
      } else if (effect.progress > 0.8) {
        opacity = (1 - effect.progress) / 0.2;
      }
      
      // Draw coin
      ctx.save();
      ctx.globalAlpha = opacity;
      
      // Draw shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.arc(effect.x + 2, effect.y + 2, displaySize * 0.9, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw coin
      const gradient = ctx.createRadialGradient(
        effect.x, effect.y, 0,
        effect.x, effect.y, displaySize
      );
      gradient.addColorStop(0, '#fff7b2');
      gradient.addColorStop(0.8, '#ffd700');
      gradient.addColorStop(1, '#ffb700');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, displaySize, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw dollar sign
      ctx.fillStyle = '#5d4037';
      ctx.font = `bold ${Math.round(displaySize)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', effect.x, effect.y);
      
      ctx.restore();
    }
  }
} 