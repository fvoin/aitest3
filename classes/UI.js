import { LEVELS } from './Levels.js';

export class UI {
  constructor(game) {
    this.game = game;
    this.setupStyles();
  }

  setupStyles() {
    // Styles for star count display
    this.starCountElement = document.createElement('div');
    this.starCountElement.id = 'starCount';
    this.starCountElement.style.position = 'absolute';
    this.starCountElement.style.top = '10px';
    this.starCountElement.style.left = '170px';
    this.starCountElement.style.fontSize = '20px';
    this.starCountElement.style.color = 'gold';
    this.starCountElement.style.fontFamily = 'Arial, sans-serif';
    this.starCountElement.style.fontWeight = 'bold';
    document.body.appendChild(this.starCountElement);

    // Styles for level display
    this.levelInfoElement = document.createElement('div');
    this.levelInfoElement.id = 'levelInfo';
    this.levelInfoElement.style.position = 'absolute';
    this.levelInfoElement.style.top = '10px';
    this.levelInfoElement.style.left = '50%';
    this.levelInfoElement.style.transform = 'translateX(-50%)';
    this.levelInfoElement.style.fontSize = '20px';
    this.levelInfoElement.style.color = 'white';
    this.levelInfoElement.style.fontFamily = 'Arial, sans-serif';
    this.levelInfoElement.style.fontWeight = 'bold';
    document.body.appendChild(this.levelInfoElement);

    // Styles for coins display
    this.coinCountElement = document.createElement('div');
    this.coinCountElement.id = 'coinCount';
    this.coinCountElement.style.position = 'absolute';
    this.coinCountElement.style.top = '40px';
    this.coinCountElement.style.right = '10px';
    this.coinCountElement.style.fontSize = '20px';
    this.coinCountElement.style.color = 'gold';
    this.coinCountElement.style.fontFamily = 'Arial, sans-serif';
    this.coinCountElement.style.fontWeight = 'bold';
    document.body.appendChild(this.coinCountElement);

    this.updateLevelUI();
  }

  updateLevelUI() {
    // Use the current generated level if available, otherwise fall back to predefined levels
    const levelName = this.game.currentGeneratedLevel ? 
      this.game.currentGeneratedLevel.name : 
      `Level ${this.game.currentLevel}`;
      
    const totalStars = this.game.currentGeneratedLevel ? 
      this.game.currentGeneratedLevel.stars.length : 
      0;
    
    this.levelInfoElement.textContent = levelName;
    this.starCountElement.textContent = `⭐ ${this.game.collectedStars}/${totalStars}`;
    this.coinCountElement.textContent = `🪙 ${this.game.totalStars * 100}`;
  }

  draw(ctx) {
    // Draw next level button in the top left corner (placed at the same height as star count)
    this.drawNextButton(ctx, 10, 10, 150, 30);
    
    // Draw editor button in the top right
    this.drawEditorButton(ctx, 630, 10, 50);
    
    // Draw home button in the top right corner
    this.drawHomeButton(ctx, 740, 10, 50);
    
    // Draw shop button between editor and home buttons
    this.drawShopButton(ctx, 690, 10, 40);
    
    // Draw coin icon
    this.drawCoinIcon(ctx, 740, 50, 30);
  }
  
  drawHomeButton(ctx, x, y, size) {
    // Draw button with background similar to popup style
    ctx.fillStyle = '#4CAF50';
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 2;
    
    // Draw rounded rectangle
    const radius = 5;
    const width = size;
    const height = 30;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    ctx.fill();
    ctx.stroke();
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HOME', x + width/2, y + height/2);
  }
  
  drawNextButton(ctx, x, y, width, height) {
    // Use the same style as home button but with different color
    ctx.fillStyle = '#2196F3';  // Blue color for next button
    ctx.strokeStyle = '#0D47A1'; // Darker blue border
    ctx.lineWidth = 2;
    
    // Draw rounded rectangle
    const radius = 5;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    ctx.fill();
    ctx.stroke();
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NEXT LEVEL ▶', x + width/2, y + height/2);
  }
  
  drawEditorButton(ctx, x, y, size) {
    // Draw button with purple background
    ctx.fillStyle = '#673AB7';
    ctx.strokeStyle = '#4527A0';
    ctx.lineWidth = 2;
    
    // Draw rounded rectangle
    const radius = 5;
    const width = size;
    const height = 30;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    ctx.fill();
    ctx.stroke();
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('EDIT', x + width/2, y + height/2);
  }
  
  drawShopButton(ctx, x, y, size) {
    // Draw button with orange background
    ctx.fillStyle = '#FF9800';
    ctx.strokeStyle = '#E65100';
    ctx.lineWidth = 2;
    
    // Draw rounded rectangle
    const radius = 5;
    const width = size;
    const height = 30;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    ctx.fill();
    ctx.stroke();
    
    // Draw shopping cart icon
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🛒', x + width/2, y + height/2);
  }
  
  drawCoinIcon(ctx, x, y, size) {
    // Draw coin
    const gradient = ctx.createRadialGradient(
      x + size/2, y + size/2, 0,
      x + size/2, y + size/2, size/2
    );
    gradient.addColorStop(0, '#fff7b2');
    gradient.addColorStop(0.8, '#ffd700');
    gradient.addColorStop(1, '#ffb700');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw $ sign
    ctx.fillStyle = '#5d4037';
    ctx.font = `bold ${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', x + size/2, y + size/2);
  }
  
  checkHomeButtonClick(x, y) {
    // Check if click is within home button area (updated for new dimensions)
    const buttonX = 740;
    const buttonY = 10;
    const buttonWidth = 50;
    const buttonHeight = 30;
    
    return x >= buttonX && x <= buttonX + buttonWidth && 
           y >= buttonY && y <= buttonY + buttonHeight;
  }
  
  checkNextButtonClick(x, y) {
    // Update coordinates to match the new button position
    const buttonX = 10;
    const buttonY = 10;
    const buttonWidth = 150;
    const buttonHeight = 30;
    
    return x >= buttonX && x <= buttonX + buttonWidth && 
           y >= buttonY && y <= buttonY + buttonHeight;
  }

  checkEditorButtonClick(x, y) {
    // If we're in editor mode, allow clicks to be handled by the editor
    if (this.game.gameState === 'editor') {
      return false;
    }
    
    const buttonX = 630; // Match position in draw method
    const buttonY = 10;
    const buttonWidth = 50;
    const buttonHeight = 30;
    
    return (
      x >= buttonX && 
      x <= buttonX + buttonWidth && 
      y >= buttonY && 
      y <= buttonY + buttonHeight
    );
  }

  checkShopButtonClick(x, y) {
    const buttonX = 690;
    const buttonY = 10;
    const buttonWidth = 40;
    const buttonHeight = 30;
    
    return x >= buttonX && x <= buttonX + buttonWidth && 
           y >= buttonY && y <= buttonY + buttonHeight;
  }
} 