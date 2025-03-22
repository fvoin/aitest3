export class HomeShop {
  constructor(game, home) {
    this.game = game;
    this.home = home;
    this.visible = false;
    this.scrollOffset = 0;
    this.animationTime = 0;
    this.selectedItem = null;
  }
  
  show() {
    this.visible = true;
    this.scrollOffset = 0;
    this.selectedItem = null;
  }
  
  hide() {
    this.visible = false;
  }
  
  update() {
    if (!this.visible) return;
    
    this.animationTime += 0.05;
  }
  
  draw(ctx) {
    if (!this.visible) return;
    
    // Draw background
    ctx.fillStyle = '#37474f'; // Dark blue-gray
    ctx.fillRect(0, 0, 800, 600);
    
    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HOME SHOP', 400, 50);
    
    // Draw coin count
    const coins = this.game.totalStars * 100;
    ctx.fillStyle = '#ffd700'; // Gold
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`${coins}`, 760, 50);
    
    // Draw coin icon
    ctx.beginPath();
    ctx.arc(780, 50, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd700';
    ctx.fill();
    ctx.strokeStyle = '#ffc107';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw $ sign
    ctx.fillStyle = '#5d4037';
    ctx.font = 'bold 15px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('$', 780, 50);
    
    // Draw items
    this.drawShopItems(ctx);
    
    // Draw back button
    this.drawBackButton(ctx);
    
    // Draw selected item details
    if (this.selectedItem) {
      this.drawItemDetails(ctx, this.selectedItem);
    }
  }
  
  drawShopItems(ctx) {
    // Draw items in a grid
    const availableItems = this.home.items.filter(item => !item.owned);
    const itemsPerRow = 3;
    const itemWidth = 160;
    const itemHeight = 160;
    const startX = 160;
    const startY = 120;
    const padding = 20;
    
    // Get current coins
    const coins = this.game.totalStars * 100;
    
    availableItems.forEach((item, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      const x = startX + col * (itemWidth + padding);
      const y = startY + row * (itemHeight + padding) - this.scrollOffset;
      
      // Skip if out of view
      if (y < 100 || y > 500) return;
      
      // Draw item background
      ctx.fillStyle = this.selectedItem === item ? '#455a64' : '#546e7a';
      ctx.beginPath();
      ctx.roundRect(x, y, itemWidth, itemHeight, 10);
      ctx.fill();
      
      // Draw item preview
      this.drawItemPreview(ctx, item, x + itemWidth / 2, y + itemHeight / 2 - 20);
      
      // Draw item name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.name, x + itemWidth / 2, y + itemHeight - 35);
      
      // Draw price
      ctx.fillStyle = item.price <= coins ? '#ffd700' : '#ff6b6b';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${item.price}`, x + itemWidth / 2, y + itemHeight - 15);
    });
  }
  
  drawItemPreview(ctx, item, x, y) {
    // Scale for preview
    const scale = 0.7;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    // Use the Home's drawItem method but centered
    switch (item.id) {
      case 'lamp':
        // Draw lamp
        ctx.fillStyle = '#5d4037'; // Dark brown
        ctx.fillRect(-10, 50, 20, 10);
        ctx.fillStyle = '#8d6e63'; // Brown
        ctx.fillRect(-3, -40, 6, 90);
        ctx.fillStyle = '#ffeb3b'; // Yellow
        ctx.beginPath();
        ctx.moveTo(-25, -40);
        ctx.lineTo(25, -40);
        ctx.lineTo(15, -70);
        ctx.lineTo(-15, -70);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'plant':
        // Draw plant
        ctx.fillStyle = '#e65100'; // Orange-brown
        ctx.beginPath();
        ctx.moveTo(-20, 50);
        ctx.lineTo(20, 50);
        ctx.lineTo(15, 20);
        ctx.lineTo(-15, 20);
        ctx.closePath();
        ctx.fill();
        
        // Plant stem
        ctx.strokeStyle = '#2e7d32'; // Dark green
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.bezierCurveTo(-10, 0, -20, -20, -15, -40);
        ctx.stroke();
        
        // Plant leaves
        ctx.fillStyle = '#4caf50'; // Green
        for (let i = 0; i < 5; i++) {
          const angle = i * Math.PI * 0.4 + this.animationTime * 0.2;
          const leafSize = 15 + Math.sin(i) * 5;
          const leafX = -15 + Math.cos(angle) * 10;
          const leafY = -40 + Math.sin(angle) * 10;
          
          ctx.beginPath();
          ctx.ellipse(leafX, leafY, leafSize, leafSize / 2, angle, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
        
      case 'bookshelf':
        // Draw bookshelf
        ctx.fillStyle = '#795548'; // Brown
        ctx.fillRect(-40, -100, 80, 150);
        
        // Shelves
        ctx.fillStyle = '#5d4037'; // Dark brown
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(-40, -85 + i * 35, 80, 5);
        }
        
        // Books
        const bookColors = ['#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#9c27b0'];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 5; j++) {
            if (Math.random() > 0.2) { // Some gaps in the bookshelf
              const bookColor = bookColors[Math.floor(Math.random() * bookColors.length)];
              ctx.fillStyle = bookColor;
              ctx.fillRect(-35 + j * 15, -80 + i * 35, 10, 30);
            }
          }
        }
        break;
        
      case 'tv':
        // Draw TV
        ctx.fillStyle = '#424242'; // Dark gray
        ctx.fillRect(-30, 20, 60, 10);
        ctx.fillRect(-10, 30, 20, 20);
        
        ctx.fillStyle = '#212121'; // Very dark gray
        ctx.fillRect(-40, -30, 80, 50);
        
        ctx.fillStyle = `rgb(${50+Math.random()*50}, ${50+Math.random()*100}, ${150+Math.random()*100})`;
        ctx.fillRect(-35, -25, 70, 40);
        break;
        
      case 'painting':
        // Draw painting
        ctx.fillStyle = '#5d4037'; // Dark brown
        ctx.fillRect(-40, -30, 80, 60);
        
        ctx.fillStyle = '#f5f5f5'; // White
        ctx.fillRect(-35, -25, 70, 50);
        
        for (let i = 0; i < 5; i++) {
          const artColor = `hsl(${(i * 60 + this.animationTime * 20) % 360}, 70%, 60%)`;
          ctx.fillStyle = artColor;
          ctx.beginPath();
          ctx.ellipse(-20 + i * 15, -10 + Math.sin(i + this.animationTime) * 10, 10, 15, Math.PI * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
    }
    
    ctx.restore();
  }
  
  drawBackButton(ctx) {
    // Draw back button
    ctx.fillStyle = '#f44336'; // Red
    ctx.beginPath();
    ctx.roundRect(30, 50, 100, 40, 10);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BACK', 80, 70);
  }
  
  drawItemDetails(ctx, item) {
    // Draw details panel
    const x = 550;
    const y = 300;
    const width = 400;
    const height = 300;
    
    ctx.fillStyle = 'rgba(38, 50, 56, 0.9)';
    ctx.beginPath();
    ctx.roundRect(x - width/2, y - height/2, width, height, 15);
    ctx.fill();
    
    // Draw item name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(item.name, x, y - height/2 + 40);
    
    // Draw item preview
    this.drawItemPreview(ctx, item, x, y);
    
    // Draw price
    const coins = this.game.totalStars * 100;
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('Price:', x, y + height/2 - 80);
    
    ctx.fillStyle = item.price <= coins ? '#ffd700' : '#ff6b6b';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`${item.price}`, x, y + height/2 - 50);
    
    // Draw buy button
    const canBuy = coins >= item.price;
    ctx.fillStyle = canBuy ? '#4caf50' : '#9e9e9e';
    ctx.beginPath();
    ctx.roundRect(x - 60, y + height/2 - 30, 120, 40, 10);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('BUY', x, y + height/2 - 10);
  }
  
  handleClick(x, y) {
    if (!this.visible) return null;
    
    // Check back button click
    if (x >= 30 && x <= 130 && y >= 50 && y <= 90) {
      return 'back';
    }
    
    // Check if an item is selected and buy button is clicked
    if (this.selectedItem) {
      const detailsX = 550;
      const detailsY = 300;
      const buttonX = detailsX - 60;
      const buttonY = detailsY + 150 - 30;
      const buttonWidth = 120;
      const buttonHeight = 40;
      
      if (x >= buttonX && x <= buttonX + buttonWidth &&
          y >= buttonY && y <= buttonY + buttonHeight) {
        return { action: 'buy', item: this.selectedItem.id };
      }
      
      // Check if clicked outside the details panel to close it
      const panelX = detailsX - 200;
      const panelY = detailsY - 150;
      const panelWidth = 400;
      const panelHeight = 300;
      
      if (x < panelX || x > panelX + panelWidth ||
          y < panelY || y > panelY + panelHeight) {
        this.selectedItem = null;
        return null;
      }
      
      return null;
    }
    
    // Check if an item is clicked
    const availableItems = this.home.items.filter(item => !item.owned);
    const itemsPerRow = 3;
    const itemWidth = 160;
    const itemHeight = 160;
    const startX = 160;
    const startY = 120;
    const padding = 20;
    
    for (let i = 0; i < availableItems.length; i++) {
      const row = Math.floor(i / itemsPerRow);
      const col = i % itemsPerRow;
      const itemX = startX + col * (itemWidth + padding);
      const itemY = startY + row * (itemHeight + padding) - this.scrollOffset;
      
      if (x >= itemX && x <= itemX + itemWidth &&
          y >= itemY && y <= itemY + itemHeight) {
        this.selectedItem = availableItems[i];
        return null;
      }
    }
    
    return null;
  }
  
  handleScroll(delta) {
    if (!this.visible) return;
    
    this.scrollOffset += delta * 20;
    if (this.scrollOffset < 0) this.scrollOffset = 0;
    
    const maxScroll = Math.max(0, Math.ceil(this.home.items.filter(item => !item.owned).length / 3) * (160 + 20) - 300);
    if (this.scrollOffset > maxScroll) this.scrollOffset = maxScroll;
  }
} 