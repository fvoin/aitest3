export class ShopItem {
  constructor(id, name, price, defaultX, defaultY, width, height, isBackground = false) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.defaultX = defaultX;
    this.defaultY = defaultY;
    this.width = width;
    this.height = height;
    this.isBackground = isBackground;
    this.description = this.generateDescription();
  }
  
  generateDescription() {
    const descriptions = {
      sofa: "A comfortable blue sofa to relax on after collecting stars.",
      table: "A sturdy wooden coffee table for your living room.",
      chair: "A well-crafted wooden chair that matches your decor.",
      bed: "A cozy bed with blue sheets for a good night's rest.",
      lamp: "A stylish lamp to brighten up your room.",
      plant: "A lush green plant to freshen up your space.",
      painting: "A beautiful golden painting to decorate your walls.",
      clock: "A classic wall clock to keep track of time.",
      wallpaper: "Elegant striped wallpaper to transform your walls.",
      carpet: "A vibrant red carpet to add warmth to your floor.",
      tv: "A sleek flat-screen TV for entertainment.",
      trophy: "A prestigious gold trophy showcasing your star-collecting achievements."
    };
    
    return descriptions[this.id] || `A beautiful ${this.name} for your virtual home.`;
  }
  
  draw(ctx, x, y, isInShop = false) {
    ctx.save();
    
    if (isInShop) {
      // Draw item preview for shop
      ctx.fillStyle = '#F0F0F0';
      ctx.fillRect(x - 40, y - 40, 80, 80);
      
      // Draw item name and price
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(this.name, x, y + 50);
      ctx.fillStyle = '#008000';
      ctx.fillText(`${this.price} coins`, x, y + 65);
    }
    
    // Draw simplified icon version of the item
    const scale = isInShop ? 0.5 : 1;
    
    switch (this.id) {
      case 'sofa':
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(x - 25 * scale, y - 15 * scale, 50 * scale, 30 * scale);
        break;
        
      case 'table':
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 20 * scale, y - 5 * scale, 40 * scale, 10 * scale);
        ctx.fillRect(x - 15 * scale, y + 5 * scale, 5 * scale, 15 * scale);
        ctx.fillRect(x + 10 * scale, y + 5 * scale, 5 * scale, 15 * scale);
        break;
        
      case 'chair':
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 10 * scale, y - 5 * scale, 20 * scale, 5 * scale);
        ctx.fillRect(x - 10 * scale, y, 5 * scale, 15 * scale);
        ctx.fillRect(x + 5 * scale, y, 5 * scale, 15 * scale);
        ctx.fillRect(x - 10 * scale, y - 25 * scale, 5 * scale, 20 * scale);
        break;
        
      case 'bed':
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 25 * scale, y, 50 * scale, 5 * scale);
        ctx.fillRect(x - 25 * scale, y - 30 * scale, 5 * scale, 30 * scale);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x - 20 * scale, y - 25 * scale, 45 * scale, 25 * scale);
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(x - 20 * scale, y - 15 * scale, 45 * scale, 15 * scale);
        break;
        
      case 'lamp':
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 5 * scale, y - 5 * scale, 10 * scale, 5 * scale);
        ctx.fillStyle = '#F5DEB3';
        ctx.beginPath();
        ctx.moveTo(x - 10 * scale, y - 10 * scale);
        ctx.lineTo(x + 10 * scale, y - 10 * scale);
        ctx.lineTo(x + 5 * scale, y - 25 * scale);
        ctx.lineTo(x - 5 * scale, y - 25 * scale);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'plant':
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 10 * scale, y - 5 * scale, 20 * scale, 5 * scale);
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(x, y - 15 * scale, 15 * scale, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'painting':
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 20 * scale, y - 15 * scale, 40 * scale, 30 * scale);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x - 15 * scale, y - 10 * scale, 30 * scale, 20 * scale);
        break;
        
      case 'clock':
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y, 15 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.arc(x, y, 15 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 10 * scale);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 7 * scale, y);
        ctx.stroke();
        break;
        
      case 'wallpaper':
        if (!isInShop) break; // Only draw in shop
        ctx.fillStyle = '#E6CCB2';
        ctx.fillRect(x - 30 * scale, y - 30 * scale, 60 * scale, 60 * scale);
        ctx.strokeStyle = '#D4B9A0';
        ctx.lineWidth = 1;
        for (let i = 0; i < 60; i += 10) {
          ctx.beginPath();
          ctx.moveTo(x - 30 * scale + i * scale, y - 30 * scale);
          ctx.lineTo(x - 30 * scale + i * scale, y + 30 * scale);
          ctx.stroke();
        }
        break;
        
      case 'carpet':
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(x - 25 * scale, y - 15 * scale, 50 * scale, 30 * scale);
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(x - 20 * scale, y - 10 * scale, 40 * scale, 20 * scale);
        break;
        
      case 'tv':
        ctx.fillStyle = '#000000';
        ctx.fillRect(x - 20 * scale, y - 15 * scale, 40 * scale, 30 * scale);
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(x - 15 * scale, y - 10 * scale, 30 * scale, 20 * scale);
        break;
        
      case 'trophy':
        ctx.fillStyle = '#FFD700';
        // Base
        ctx.fillRect(x - 10 * scale, y - 5 * scale, 20 * scale, 5 * scale);
        // Stem
        ctx.fillRect(x - 3 * scale, y - 20 * scale, 6 * scale, 15 * scale);
        // Cup
        ctx.beginPath();
        ctx.moveTo(x - 10 * scale, y - 20 * scale);
        ctx.lineTo(x + 10 * scale, y - 20 * scale);
        ctx.lineTo(x + 5 * scale, y - 30 * scale);
        ctx.lineTo(x - 5 * scale, y - 30 * scale);
        ctx.closePath();
        ctx.fill();
        // Star
        if (scale > 0.3) {
          ctx.beginPath();
          const starPoints = 5;
          const outerRadius = 5 * scale;
          const innerRadius = 2 * scale;
          for (let i = 0; i < starPoints * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = Math.PI * i / starPoints - Math.PI / 2;
            const starX = x + Math.cos(angle) * radius;
            const starY = y - 35 * scale + Math.sin(angle) * radius;
            if (i === 0) {
              ctx.moveTo(starX, starY);
            } else {
              ctx.lineTo(starX, starY);
            }
          }
          ctx.closePath();
          ctx.fill();
        }
        break;
    }
    
    ctx.restore();
  }
} 