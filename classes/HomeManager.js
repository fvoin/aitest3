import { Home } from './Home.js';
import { HomeShop } from './HomeShop.js';

export class HomeManager {
  constructor(game) {
    this.game = game;
    this.home = new Home(game);
    this.shop = new HomeShop(game, this.home);
    this.currentView = 'home'; // 'home' or 'shop'
    this.visible = false;
    this.newStarsToShow = 0;
    this.showMessageTimer = 0;
    this.messageText = '';
    
    // Remove shop button dimensions
  }
  
  show() {
    this.visible = true;
    this.currentView = 'home';
    this.home.show();
    this.shop.hide();
    this.checkNewStars();
  }
  
  hide() {
    this.visible = false;
    this.home.hide();
    this.shop.hide();
  }
  
  switchToShop() {
    this.currentView = 'shop';
    this.home.hide();
    this.shop.show();
  }
  
  switchToHome() {
    this.currentView = 'home';
    this.home.show();
    this.shop.hide();
  }
  
  checkNewStars() {
    // Get total stars from localStorage
    const lastStars = parseInt(localStorage.getItem('sliceTheRope_lastShownStars') || '0');
    const currentStars = this.game.totalStars;
    
    if (currentStars > lastStars) {
      this.newStarsToShow = currentStars - lastStars;
      this.showCoinsEarnedMessage(this.newStarsToShow * 100);
      localStorage.setItem('sliceTheRope_lastShownStars', String(currentStars));
    }
  }
  
  showCoinsEarnedMessage(coins) {
    this.messageText = `You earned ${coins} coins!`;
    this.showMessageTimer = 120; // Show for 2 seconds (60 frames/second)
  }
  
  update() {
    if (!this.visible) return;
    
    if (this.currentView === 'home') {
      this.home.update();
    } else {
      this.shop.update();
    }
    
    if (this.showMessageTimer > 0) {
      this.showMessageTimer--;
    }
  }
  
  draw(ctx) {
    if (!this.visible) return;
    
    if (this.currentView === 'home') {
      this.home.draw(ctx);
      
      // Remove shop button drawing
    } else {
      this.shop.draw(ctx);
    }
    
    // Draw message if needed
    if (this.showMessageTimer > 0) {
      this.drawMessage(ctx);
    }
  }
  
  drawMessage(ctx) {
    const opacity = Math.min(1, this.showMessageTimer / 20);
    
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.7})`;
    ctx.beginPath();
    ctx.roundRect(250, 250, 300, 100, 15);
    ctx.fill();
    
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.messageText, 400, 300);
  }
  
  handleClick(x, y) {
    if (!this.visible) return;
    
    if (this.currentView === 'home') {
      // Remove shop button click check
      
      const action = this.home.handleClick(x, y);
      
      if (action === 'shop') {
        this.switchToShop();
      } else if (action === 'play') {
        this.game.hideHome();
      }
    } else {
      const result = this.shop.handleClick(x, y);
      
      if (result === 'back') {
        this.switchToHome();
      } else if (result && result.action === 'buy') {
        const success = this.home.buyItem(result.item);
        
        if (success) {
          // Update the price
          const item = this.home.items.find(i => i.id === result.item);
          this.game.totalStars -= item.price / 100;
          this.game.saveProgress();
          
          // Show success message
          this.messageText = `You bought a ${item.name}!`;
          this.showMessageTimer = 120;
          
          // Close item details
          this.shop.selectedItem = null;
        } else {
          // Show error message
          this.messageText = "Not enough coins!";
          this.showMessageTimer = 120;
        }
      }
    }
  }
} 