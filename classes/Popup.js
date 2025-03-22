export class Popup {
  constructor(game) {
    this.game = game;
    this.isVisible = false;
    this.type = null;
    this.message = '';
    this.buttonWidth = 280;
    this.buttonHeight = 80;
    this.animationTime = 0;
    this.showTime = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.buttonHovered = false;
  }

  show(message, type = 'success') {
    this.type = type;
    this.message = message;
    this.isVisible = true;
    this.animationTime = 0;
    this.showTime = Date.now();
  }

  hide() {
    this.isVisible = false;
  }

  update() {
    if (this.isVisible) {
      this.animationTime += 0.05;
    }
  }

  draw(ctx) {
    if (!this.isVisible) return;
    
    // Calculate animation progress
    const progress = Math.min(1, (Date.now() - this.showTime) / 300);
    const scale = this.easeOutBack(progress);
    
    // Draw darkened background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Apply animation to popup
    ctx.save();
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2);
    
    // Draw popup background
    const popupWidth = 400;
    const popupHeight = 300;  // Increased from 250 to 300 for more space at the bottom
    const popupX = (ctx.canvas.width - popupWidth) / 2;
    const popupY = (ctx.canvas.height - popupHeight) / 2;
    
    // Draw white background with rounded corners
    ctx.fillStyle = 'white';
    this.roundRect(ctx, popupX, popupY, popupWidth, popupHeight, 15);
    ctx.fill();
    
    // Draw header background
    ctx.fillStyle = this.type === 'success' ? '#4CAF50' : '#F44336';
    this.roundRect(ctx, popupX, popupY, popupWidth, 60, [15, 15, 0, 0]);
    ctx.fill();
    
    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.message, ctx.canvas.width / 2, popupY + 40);
    
    // Draw button
    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonX = (ctx.canvas.width - buttonWidth) / 2;
    const buttonY = popupY + popupHeight - buttonHeight - 40; // Adjusted position from the bottom
    
    // Save button position for click handling
    this.buttonX = buttonX;
    this.buttonY = buttonY;
    this.buttonWidth = buttonWidth;
    this.buttonHeight = buttonHeight;
    
    this.buttonHovered = this.isPointInsideButton(this.mouseX, this.mouseY, buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = this.buttonHovered ? (this.type === 'success' ? '#66BB6A' : '#EF5350') : (this.type === 'success' ? '#4CAF50' : '#F44336');
    this.roundRect(ctx, buttonX, buttonY, buttonWidth, buttonHeight, 10);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    // Different text based on popup type
    if (this.type === 'success') {
      ctx.fillText('NEXT LEVEL', ctx.canvas.width / 2, buttonY + 30);
    } else {
      ctx.fillText('TRY AGAIN', ctx.canvas.width / 2, buttonY + 30);
    }
    
    // Draw more info text
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    if (this.type === 'success') {
      // Make it clearer that user must click to continue
      ctx.fillText('Level completed! Click the button below', ctx.canvas.width / 2, buttonY - 40);
      ctx.fillText('to continue to the next level.', ctx.canvas.width / 2, buttonY - 15);
    } else {
      ctx.fillText('Try again! Click OK to restart the level.', ctx.canvas.width / 2, buttonY - 30);
    }
    
    ctx.restore();
  }
  
  // Round rectangle helper
  roundRect(ctx, x, y, width, height, radius) {
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else if (Array.isArray(radius)) {
      const [tl, tr, br, bl] = radius.length >= 4 ? radius : [radius[0], radius[0], radius[0], radius[0]];
      radius = {tl, tr, br, bl};
    }
    
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
  }
  
  // Animation easing function
  easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }
  
  // Check if point is inside button
  isPointInsideButton(x, y, buttonX, buttonY, buttonWidth, buttonHeight) {
    return x >= buttonX && x <= buttonX + buttonWidth && 
           y >= buttonY && y <= buttonY + buttonHeight;
  }
  
  // Track mouse position for hover effect
  updateMousePosition(x, y) {
    this.mouseX = x;
    this.mouseY = y;
  }
  
  handleClick(x, y) {
    if (!this.isVisible) return false;
    
    // Update mouse position for accurate detection
    this.updateMousePosition(x, y);
    
    // Check if click is within button bounds
    if (this.isPointInsideButton(x, y, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight)) {
      this.hide();
      if (this.game && typeof this.game.onPopupClose === 'function') {
        this.game.onPopupClose(this.type);
      }
      return true;
    }
    
    return false;
  }
} 