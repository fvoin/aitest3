export class Home {
  constructor(game) {
    this.game = game;
    this.visible = false;
    
    // Home appearance settings
    this.backgroundColor = '#4b2e83'; // Dark purple
    this.floorColor = '#8d6e63'; // Brown
    this.wallColor = '#673ab7'; // Purple
    
    // Home items
    this.items = [
      { id: 'carpet', name: 'Carpet', owned: true, position: { x: 400, y: 500 }, price: 0 },
      { id: 'table', name: 'Table', owned: true, position: { x: 500, y: 450 }, price: 0 },
      { id: 'chair', name: 'Chair', owned: true, position: { x: 400, y: 450 }, price: 0 },
      { id: 'lamp', name: 'Lamp', owned: false, position: { x: 600, y: 350 }, price: 1000 },
      { id: 'plant', name: 'Plant', owned: false, position: { x: 200, y: 400 }, price: 800 },
      { id: 'bookshelf', name: 'Bookshelf', owned: false, position: { x: 700, y: 400 }, price: 1500 },
      { id: 'tv', name: 'TV', owned: false, position: { x: 550, y: 350 }, price: 2000 },
      { id: 'painting', name: 'Painting', owned: false, position: { x: 300, y: 300 }, price: 1200 },
    ];
    
    // Load saved items
    this.loadSavedItems();
    
    // Home animations
    this.animationTime = 0;
    
    // Om Nom position in home
    this.omNom = {
      x: 300,
      y: 450,
      size: 60,
      direction: 1,
      targetX: 300,
      speed: 1.5
    };
  }
  
  loadSavedItems() {
    const savedItems = localStorage.getItem('sliceTheRope_homeItems');
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      this.items.forEach(item => {
        const savedItem = parsedItems.find(saved => saved.id === item.id);
        if (savedItem) {
          item.owned = savedItem.owned;
        }
      });
    }
  }
  
  saveItems() {
    localStorage.setItem('sliceTheRope_homeItems', JSON.stringify(this.items));
  }
  
  show() {
    this.visible = true;
    this.animationTime = 0;
  }
  
  hide() {
    this.visible = false;
  }
  
  update() {
    if (!this.visible) return;
    
    this.animationTime += 0.02;
    
    // Update Om Nom position (walking animation)
    const dx = this.omNom.targetX - this.omNom.x;
    if (Math.abs(dx) > 1) {
      this.omNom.x += Math.sign(dx) * this.omNom.speed;
      this.omNom.direction = Math.sign(dx);
    } else {
      // Set a new target position occasionally
      if (Math.random() < 0.005) {
        this.omNom.targetX = 100 + Math.random() * 600;
      }
    }
  }
  
  draw(ctx) {
    if (!this.visible) return;
    
    // Draw background
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, 800, 600);
    
    // Draw window
    this.drawWindow(ctx, 400, 200, 200, 150);
    
    // Draw floor
    ctx.fillStyle = this.floorColor;
    ctx.fillRect(0, 500, 800, 100);
    
    // Draw wall details
    this.drawWallDetails(ctx);
    
    // Draw owned items
    this.items.forEach(item => {
      if (item.owned) {
        this.drawItem(ctx, item);
      }
    });
    
    // Draw Om Nom
    this.drawOmNom(ctx);
    
    // Draw shop button
    this.drawShopButton(ctx);
    
    // Draw play button
    this.drawPlayButton(ctx);
    
    // Draw coins display
    this.drawCoinsDisplay(ctx);
  }
  
  drawWindow(ctx, x, y, width, height) {
    // Window frame
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - width/2, y - height/2, width, height);
    
    // Window panes
    ctx.fillStyle = '#87ceeb'; // Sky blue
    ctx.fillRect(x - width/2 + 10, y - height/2 + 10, width/2 - 15, height/2 - 15);
    ctx.fillRect(x + 5, y - height/2 + 10, width/2 - 15, height/2 - 15);
    ctx.fillRect(x - width/2 + 10, y + 5, width/2 - 15, height/2 - 15);
    ctx.fillRect(x + 5, y + 5, width/2 - 15, height/2 - 15);
    
    // Window sill
    ctx.fillStyle = '#d7ccc8'; // Light brown
    ctx.fillRect(x - width/2 - 20, y + height/2, width + 40, 15);
  }
  
  drawWallDetails(ctx) {
    // Draw baseboard
    ctx.fillStyle = '#4a148c'; // Darker purple
    ctx.fillRect(0, 485, 800, 15);
  }
  
  drawItem(ctx, item) {
    switch (item.id) {
      case 'carpet':
        // Draw carpet
        ctx.fillStyle = '#e57373'; // Red
        ctx.beginPath();
        ctx.ellipse(item.position.x, item.position.y, 150, 60, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#c62828';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
        
      case 'table':
        // Draw table
        ctx.fillStyle = '#a1887f'; // Brown
        // Table top
        ctx.fillRect(item.position.x - 50, item.position.y - 15, 100, 30);
        // Table legs
        ctx.fillRect(item.position.x - 40, item.position.y + 15, 10, 35);
        ctx.fillRect(item.position.x + 30, item.position.y + 15, 10, 35);
        break;
        
      case 'chair':
        // Draw chair
        ctx.fillStyle = '#8d6e63'; // Brown
        // Chair seat
        ctx.fillRect(item.position.x - 20, item.position.y, 40, 10);
        // Chair back
        ctx.fillRect(item.position.x - 20, item.position.y - 30, 40, 5);
        ctx.fillRect(item.position.x - 20, item.position.y - 25, 5, 25);
        ctx.fillRect(item.position.x + 15, item.position.y - 25, 5, 25);
        // Chair legs
        ctx.fillRect(item.position.x - 15, item.position.y + 10, 5, 30);
        ctx.fillRect(item.position.x + 10, item.position.y + 10, 5, 30);
        break;
        
      case 'lamp':
        // Draw lamp
        // Lamp base
        ctx.fillStyle = '#5d4037'; // Dark brown
        ctx.fillRect(item.position.x - 10, item.position.y + 50, 20, 10);
        // Lamp pole
        ctx.fillStyle = '#8d6e63'; // Brown
        ctx.fillRect(item.position.x - 3, item.position.y - 40, 6, 90);
        // Lamp shade
        ctx.fillStyle = '#ffeb3b'; // Yellow
        ctx.beginPath();
        ctx.moveTo(item.position.x - 25, item.position.y - 40);
        ctx.lineTo(item.position.x + 25, item.position.y - 40);
        ctx.lineTo(item.position.x + 15, item.position.y - 70);
        ctx.lineTo(item.position.x - 15, item.position.y - 70);
        ctx.closePath();
        ctx.fill();
        
        // Lamp glow
        const glowRadius = 30 + Math.sin(this.animationTime * 2) * 5;
        const gradient = ctx.createRadialGradient(
          item.position.x, item.position.y - 55, 0,
          item.position.x, item.position.y - 55, glowRadius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(item.position.x, item.position.y - 55, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'plant':
        // Draw plant
        // Pot
        ctx.fillStyle = '#e65100'; // Orange-brown
        ctx.beginPath();
        ctx.moveTo(item.position.x - 20, item.position.y + 50);
        ctx.lineTo(item.position.x + 20, item.position.y + 50);
        ctx.lineTo(item.position.x + 15, item.position.y + 20);
        ctx.lineTo(item.position.x - 15, item.position.y + 20);
        ctx.closePath();
        ctx.fill();
        
        // Plant stem
        ctx.strokeStyle = '#2e7d32'; // Dark green
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(item.position.x, item.position.y + 20);
        ctx.bezierCurveTo(
          item.position.x - 10, item.position.y,
          item.position.x - 20, item.position.y - 20,
          item.position.x - 15, item.position.y - 40
        );
        ctx.stroke();
        
        // Plant leaves
        ctx.fillStyle = '#4caf50'; // Green
        for (let i = 0; i < 5; i++) {
          const angle = i * Math.PI * 0.4 + this.animationTime * 0.2;
          const leafSize = 15 + Math.sin(i) * 5;
          const leafX = item.position.x - 15 + Math.cos(angle) * 10;
          const leafY = item.position.y - 40 + Math.sin(angle) * 10;
          
          ctx.beginPath();
          ctx.ellipse(leafX, leafY, leafSize, leafSize / 2, angle, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
        
      case 'bookshelf':
        // Draw bookshelf
        ctx.fillStyle = '#795548'; // Brown
        ctx.fillRect(item.position.x - 40, item.position.y - 100, 80, 150);
        
        // Shelves
        ctx.fillStyle = '#5d4037'; // Dark brown
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(item.position.x - 40, item.position.y - 85 + i * 35, 80, 5);
        }
        
        // Books
        const bookColors = ['#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#9c27b0'];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 5; j++) {
            if (Math.random() > 0.2) { // Some gaps in the bookshelf
              const bookColor = bookColors[Math.floor(Math.random() * bookColors.length)];
              ctx.fillStyle = bookColor;
              ctx.fillRect(
                item.position.x - 35 + j * 15, 
                item.position.y - 80 + i * 35, 
                10, 
                30
              );
            }
          }
        }
        break;
        
      case 'tv':
        // Draw TV
        // TV stand
        ctx.fillStyle = '#424242'; // Dark gray
        ctx.fillRect(item.position.x - 30, item.position.y + 20, 60, 10);
        ctx.fillRect(item.position.x - 10, item.position.y + 30, 20, 20);
        
        // TV frame
        ctx.fillStyle = '#212121'; // Very dark gray
        ctx.fillRect(item.position.x - 40, item.position.y - 30, 80, 50);
        
        // TV screen
        const screenColor = Math.random() > 0.1 ? 
          `rgb(${50+Math.random()*50}, ${50+Math.random()*100}, ${150+Math.random()*100})` : 
          '#000000';
        ctx.fillStyle = screenColor;
        ctx.fillRect(item.position.x - 35, item.position.y - 25, 70, 40);
        break;
        
      case 'painting':
        // Draw painting
        // Frame
        ctx.fillStyle = '#5d4037'; // Dark brown
        ctx.fillRect(item.position.x - 40, item.position.y - 30, 80, 60);
        
        // Canvas
        ctx.fillStyle = '#f5f5f5'; // White
        ctx.fillRect(item.position.x - 35, item.position.y - 25, 70, 50);
        
        // Abstract art
        for (let i = 0; i < 5; i++) {
          const artColor = `hsl(${(i * 60 + this.animationTime * 20) % 360}, 70%, 60%)`;
          ctx.fillStyle = artColor;
          ctx.beginPath();
          ctx.ellipse(
            item.position.x - 20 + i * 15, 
            item.position.y - 10 + Math.sin(i + this.animationTime) * 10, 
            10, 
            15, 
            Math.PI * 0.25, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
        }
        break;
    }
  }
  
  drawOmNom(ctx) {
    const x = this.omNom.x;
    const y = this.omNom.y;
    const size = this.omNom.size;
    const direction = this.omNom.direction;
    
    // Body
    ctx.fillStyle = '#8bc34a'; // Green
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes background
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x + direction * 10, y - 10, size / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupil
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(
      x + direction * 10 + Math.cos(this.animationTime) * 3, 
      y - 10 + Math.sin(this.animationTime) * 3, 
      size / 10, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Mouth
    ctx.fillStyle = '#e53935'; // Red
    ctx.beginPath();
    ctx.arc(x, y + 10, size / 4, 0, Math.PI);
    ctx.fill();
    
    // Legs
    ctx.fillStyle = '#689f38'; // Darker green
    ctx.beginPath();
    ctx.ellipse(
      x - 15, 
      y + size / 2 - 5, 
      10, 
      5, 
      0, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(
      x + 15, 
      y + size / 2 - 5, 
      10, 
      5, 
      0, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
  }
  
  drawShopButton(ctx) {
    // Shop button
    ctx.fillStyle = '#4caf50'; // Green
    ctx.beginPath();
    ctx.roundRect(650, 540, 120, 40, 10);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SHOP', 710, 560);
  }
  
  drawPlayButton(ctx) {
    // Play button
    ctx.fillStyle = '#f44336'; // Red
    ctx.beginPath();
    ctx.roundRect(30, 540, 120, 40, 10);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PLAY', 90, 560);
  }
  
  drawCoinsDisplay(ctx) {
    // Coins display
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.roundRect(350, 540, 100, 40, 10);
    ctx.fill();
    
    ctx.fillStyle = 'gold';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${this.game.totalStars * 100}`, 400, 560);
    
    // Coin icon
    ctx.beginPath();
    ctx.arc(360, 560, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'gold';
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // $ sign
    ctx.fillStyle = '#5d4037';
    ctx.font = 'bold 15px Arial';
    ctx.fillText('$', 360, 560);
  }
  
  handleClick(x, y) {
    // Check shop button click
    if (x >= 650 && x <= 770 && y >= 540 && y <= 580) {
      return 'shop';
    }
    
    // Check play button click
    if (x >= 30 && x <= 150 && y >= 540 && y <= 580) {
      return 'play';
    }
    
    return null;
  }
  
  buyItem(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (item && !item.owned) {
      const coins = this.game.totalStars * 100;
      if (coins >= item.price) {
        item.owned = true;
        this.saveItems();
        return true;
      }
    }
    return false;
  }
} 