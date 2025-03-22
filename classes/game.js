import { UI } from './UI.js';
import { Rope } from './Rope.js';
import { Candy } from './Candy.js';
import { Star } from './Star.js';
import { OmNom } from './OmNom.js';
import { Popup } from './Popup.js';
import { Trace } from './Trace.js';
import { Bubble } from './Bubble.js';
import { AirPillow } from './AirPillow.js';
import { HomeManager } from './HomeManager.js';
import { CoinsEffect } from './CoinsEffect.js';
import { LevelEditor } from './LevelEditor.js';
import { Shop } from './Shop.js';
import { LEVELS } from './Levels.js';

export class Game {
  constructor() {
    // Set game title
    document.title = "Slice the Rope";
    
    this.canvas = document.createElement('canvas');
    this.canvas.width = 800;
    this.canvas.height = 600;
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
      gameContainer.appendChild(this.canvas);
    } else {
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    
    this.gravity = 0.5;
    this.isRunning = true;
    this.currentLevel = 1;
    this.ropes = [];
    this.stars = [];
    this.bubbles = [];
    this.airPillows = [];
    this.collectedStars = 0;
    // totalStars will be set to 50 (5000 coins) in loadSavedProgress
    this.levelComplete = false;
    this.nextLevelTimer = null;
    this.gameState = 'playing'; // 'playing', 'paused', 'levelComplete', 'gameOver', 'home', 'editor', 'shop'
    this.previousGameState = null;
    
    this.ui = new UI(this);
    this.candy = new Candy(400, 300);
    this.omNom = new OmNom(60);
    this.popup = new Popup(this);
    this.trace = new Trace();
    this.homeManager = new HomeManager(this);
    this.coinsEffect = new CoinsEffect();
    this.levelEditor = new LevelEditor(this);
    this.shop = new Shop(this);
    this.levelsCount = LEVELS.length;
    
    this.setupEventListeners();
    this.loadSavedProgress();
  }
  
  loadSavedProgress() {
    const savedLevel = localStorage.getItem('sliceTheRope_currentLevel');
    
    if (savedLevel) {
      this.currentLevel = parseInt(savedLevel);
    }
    
    // Always reset to 5000 coins (50 stars) on game start
    this.totalStars = 50; // 5000 coins (50 stars * 100 coins per star)
  }
  
  saveProgress() {
    // Only save the current level, not the stars/coins
    localStorage.setItem('sliceTheRope_currentLevel', this.currentLevel);
  }
  
  getTotalStars() {
    return this.totalStars;
  }
  
  init() {
    this.initLevel();
    requestAnimationFrame(() => this.gameLoop());
  }
  
  initLevel() {
    console.log('Initializing level', this.currentLevel, 'Game state:', this.gameState);
    
    // Use predefined levels instead of the removed level generator
    const level = LEVELS[this.currentLevel - 1];
    
    if (!level) {
      console.error('Level not found:', this.currentLevel);
      // Fallback to first level if current level doesn't exist
      this.currentLevel = 1;
      return this.initLevel(); // Try again with first level
    }
    
    console.log('Using level:', level.name);
    
    // Reset all game objects
    this.ropes = [];
    this.stars = level.stars.map(star => new Star(star.x, star.y));
    this.bubbles = (level.bubbles || []).map(bubble => new Bubble(bubble.x, bubble.y));
    
    // Add debug log for bubble methods
    if (this.bubbles && this.bubbles.length > 0) {
      console.log('First bubble methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.bubbles[0])));
      console.log('Has checkClick method:', !!this.bubbles[0].checkClick);
    }
    
    this.airPillows = (level.airPillows || []).map(pillow => 
      new AirPillow(pillow.x, pillow.y, pillow.width, pillow.height)
    );
    this.collectedStars = 0;
    this.levelComplete = false;
    
    // Reset gravity effects and velocities for candy
    this.candy.vx = 0;
    this.candy.vy = 0;
    
    if (this.nextLevelTimer) {
      clearTimeout(this.nextLevelTimer);
      this.nextLevelTimer = null;
    }
    
    // Reset candy position
    this.candy.reset(level.candy.x, level.candy.y);
    
    // Update OmNom position
    this.omNom.x = level.omNom.x;
    this.omNom.y = level.omNom.y;
    
    // Create ropes from each anchor to candy
    level.anchors.forEach(anchor => {
      this.ropes.push(new Rope(anchor, level.candy, level.ropeSegments || 10));
    });
    
    this.ui.updateLevelUI();
    console.log('Level initialization complete');
  }
  
  update() {
    if (this.gameState === 'home') {
      this.homeManager.update();
      this.coinsEffect.update();
      return;
    }
    
    if (this.gameState === 'editor') {
      this.levelEditor.update();
      return;
    }
    
    if (this.gameState === 'shop') {
      this.shop.update();
      return;
    }
    
    // Always update popup for animations
    this.popup.update();
    
    // Always update trace for fade animations
    this.trace.update();
    
    // Update Om Nom animations if the update method exists
    if (this.omNom && typeof this.omNom.update === 'function') {
      this.omNom.update();
    }
    
    if (this.gameState !== 'playing') return;
    
    // Update ropes
    this.ropes.forEach(rope => rope.update(this.gravity));
    
    // Update bubbles
    this.bubbles.forEach(bubble => bubble.update());
    
    // Update air pillows
    this.airPillows.forEach(pillow => pillow.update());
    
    // Update coin effects
    this.coinsEffect.update();
    
    // Apply air pillow effects - this should apply force regardless of rope attachment
    const hasActiveAirPillows = this.airPillows.some(pillow => pillow.active);
    this.airPillows.forEach(pillow => pillow.applyEffect(this.candy));
    
    // NEW: Also affect bubbles with air pillows
    this.airPillows.forEach(pillow => {
      if (typeof pillow.affectBubbles === 'function') {
        pillow.affectBubbles(this.bubbles);
      }
    });
    
    // Apply bubble effects to candy even if ropes are attached
    this.bubbles.forEach(bubble => bubble.applyEffect(this.candy));
    
    // Update candy position based on ropes
    const attachedRopes = this.ropes.filter(rope => rope.isAttached());
    
    // Check if any bubble has captured the candy
    const capturedByBubble = this.bubbles.some(bubble => 
      bubble.active && bubble.containsCandy && bubble.capturedCandy === this.candy
    );
    
    if (attachedRopes.length > 0) {
      // With attached ropes, blend between rope constraints and velocity
      const newPos = attachedRopes.reduce((pos, rope) => {
        const lastPoint = rope.getLastPoint();
        return {
          x: pos.x + lastPoint.x,
          y: pos.y + lastPoint.y
        };
      }, { x: 0, y: 0 });
      
      if (capturedByBubble) {
        // When in bubble with ropes attached, blend bubble position with rope constraints
        // Find the active bubble
        const activeBubble = this.bubbles.find(b => b.active && b.containsCandy && b.capturedCandy === this.candy);
        if (activeBubble) {
          const ropeX = newPos.x / attachedRopes.length;
          const ropeY = newPos.y / attachedRopes.length;
          
          // Move the bubble position towards the rope constraint point
          activeBubble.x = activeBubble.x * 0.9 + ropeX * 0.1;
          
          // Still allow the bubble to rise, but with reduced speed when ropes pull down
          if (activeBubble.y > ropeY) {
            activeBubble.y -= activeBubble.liftSpeed * 0.3;
          } else {
            activeBubble.y = activeBubble.y * 0.9 + ropeY * 0.1;
          }
          
          // Update candy position to match bubble
          this.candy.x = activeBubble.x;
          this.candy.y = activeBubble.y;
        }
      } else if (hasActiveAirPillows) {
        // When air pillows are active, blend between rope position and physics
        const ropeX = newPos.x / attachedRopes.length;
        const ropeY = newPos.y / attachedRopes.length;
        
        // Move slightly toward rope position but maintain some velocity
        this.candy.x = this.candy.x * 0.8 + ropeX * 0.2;
        this.candy.y = this.candy.y * 0.8 + ropeY * 0.2;
        
        // Update candy position based on velocity (reduced effect)
        this.candy.x += this.candy.vx * 0.5;
        this.candy.y += this.candy.vy * 0.5;
        
        // Apply more drag when attached to ropes
        this.candy.vx *= 0.95;
        this.candy.vy *= 0.95;
      } else {
        // No air pillows - default rope behavior
        this.candy.x = newPos.x / attachedRopes.length;
        this.candy.y = newPos.y / attachedRopes.length;
        
        // Clear velocity when controlled by ropes with no air pillows
        this.candy.vx = 0;
        this.candy.vy = 0;
      }
      
      attachedRopes.forEach(rope => rope.updateLastPoint(this.candy.x, this.candy.y));
    } else if (!capturedByBubble) {
      // No attached ropes and not captured by bubble - use normal physics
      // Apply gravity
      this.candy.applyGravity(this.gravity);
      
      // Update candy position based on velocity
      this.candy.x += this.candy.vx;
      this.candy.y += this.candy.vy;
      
      // Apply drag to slow down candy
      this.candy.vx *= 0.98;
      this.candy.vy *= 0.98;
    }
    // When candy is captured by a bubble with no ropes, the bubble handles candy position in its applyEffect method
    
    // Check for star collection
    this.checkStarCollection();
    
    // Check for Om Nom collision
    this.checkOmNomCollision();
    
    // Check if candy is out of bounds
    if (this.candy.y > this.canvas.height + 100) {
      this.handleGameOver();
    }
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.gameState === 'home') {
      // Draw home view
      this.homeManager.draw(this.ctx);
      
      // Draw coins effect on top
      this.coinsEffect.draw(this.ctx);
      return;
    }
    
    if (this.gameState === 'shop') {
      // Draw shop view
      this.shop.draw(this.ctx);
      return;
    }
    
    // Draw game elements
    this.ropes.forEach(rope => rope.draw(this.ctx));
    this.stars.forEach(star => star.draw(this.ctx));
    this.airPillows.forEach(pillow => pillow.draw(this.ctx));
    this.bubbles.forEach(bubble => bubble.draw(this.ctx));
    
    // Get the current level for Om Nom position
    const level = LEVELS[this.currentLevel - 1];
    if (level) {
      this.omNom.draw(this.ctx, level.omNom);
    } else {
      // Fallback if level not found
      this.omNom.draw(this.ctx, { x: this.omNom.x, y: this.omNom.y });
    }
    
    this.candy.draw(this.ctx);
    
    // Draw trace
    this.trace.draw(this.ctx);
    
    // Draw coins effect
    this.coinsEffect.draw(this.ctx);
    
    // Draw popup
    this.popup.draw(this.ctx);
    
    // Draw editor if in editor mode
    if (this.gameState === 'editor') {
      this.levelEditor.draw(this.ctx);
    }
    
    // Draw UI
    this.ui.draw(this.ctx);
  }
  
  gameLoop() {
    if (this.isRunning) {
      this.update();
      this.render();
      requestAnimationFrame(() => this.gameLoop());
    }
  }
  
  setupEventListeners() {
    let isCutting = false;
    let lastX = 0;
    let lastY = 0;
    let activeAirPillow = null;
    
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      console.log(`Click at (${x}, ${y})`); // Debug: log click coordinates
      
      // If we're in a stuck state, try to recover
      if (this.gameState !== 'playing' && 
          this.gameState !== 'editor' && 
          this.gameState !== 'home' &&
          this.gameState !== 'shop' &&
          !this.popup.isVisible) {
        console.log('Recovering from stuck state:', this.gameState);
        this.gameState = 'playing';
      }
      
      // Check if popup is visible
      if (this.popup.isVisible) {
        this.popup.handleClick(x, y);
        return;
      }
      
      // Check if in editor mode
      if (this.gameState === 'editor') {
        if (this.levelEditor.handleMouseDown(x, y)) {
          return;
        }
        this.levelEditor.handleClick(x, y);
        return;
      }
      
      // Check if in home view
      if (this.gameState === 'home') {
        this.homeManager.handleClick(x, y);
        return;
      }
      
      // Check if in shop view
      if (this.gameState === 'shop') {
        this.shop.handleClick(x, y);
        return;
      }
      
      // Check for next button click - check this FIRST before other clicks
      if (this.ui.checkNextButtonClick(x, y)) {
        console.log('Next button clicked!'); // Debug: confirm next button hit
        this.goToNextLevel();
        return;
      }
      
      // Check for home button click - check BEFORE editor button
      if (this.ui.checkHomeButtonClick(x, y)) {
        console.log('Home button clicked!');
        this.showHome();
        return;
      }
      
      // Check for editor button click
      if (this.ui.checkEditorButtonClick(x, y)) {
        console.log('Editor button clicked!');
        this.showEditor();
        return;
      }
      
      // Check for shop button click
      if (this.ui.checkShopButtonClick && this.ui.checkShopButtonClick(x, y)) {
        console.log('Shop button clicked!');
        this.showShop();
        return;
      }
      
      // Only proceed with gameplay interactions in playing mode
      if (this.gameState === 'playing') {
        // Check for bubble clicks - these have priority
        let bubbleClicked = false;
        for (const bubble of this.bubbles) {
          if (bubble.checkClick && typeof bubble.checkClick === 'function' && bubble.checkClick(x, y)) {
            console.log('Bubble clicked!');
            if (bubble.pop && typeof bubble.pop === 'function') {
              bubble.pop(); // Pop the bubble when clicked
            }
            bubbleClicked = true;
            break;
          }
        }
        
        if (bubbleClicked) return;
        
        // Check for air pillow click
        let airPillowClicked = false;
        for (const pillow of this.airPillows) {
          if (pillow.checkClick(x, y)) {
            console.log('Air pillow clicked!');
            pillow.activate();
            activeAirPillow = pillow;
            airPillowClicked = true;
            break;
          }
        }
        
        // If not clicking on an air pillow, handle rope cutting
        if (!airPillowClicked) {
          lastX = x;
          lastY = y;
          isCutting = true;
          
          // Start trace
          this.trace.start(lastX, lastY);
        }
      }
    });
    
    this.canvas.addEventListener('mouseup', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (this.gameState === 'editor') {
        this.levelEditor.handleMouseUp();
      }
      
      // Deactivate any active air pillow
      if (activeAirPillow) {
        activeAirPillow.deactivate();
        activeAirPillow = null;
      }
      
      isCutting = false;
      this.trace.end();
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      // Deactivate any active air pillow when mouse leaves canvas
      if (activeAirPillow) {
        activeAirPillow.deactivate();
        activeAirPillow = null;
      }
      
      isCutting = false;
      this.trace.end();
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      
      // Update hover state for popup if visible
      if (this.popup.isVisible) {
        this.popup.updateMousePosition(currentX, currentY);
      }
      
      if (this.gameState === 'editor') {
        this.levelEditor.handleMouseMove(currentX, currentY);
        return;
      }
      
      // Only cut ropes in playing mode
      if (!isCutting || this.gameState !== 'playing') return;
      
      // Add point to trace
      this.trace.addPoint(currentX, currentY);
      
      // Check for rope cutting
      this.ropes.forEach(rope => rope.checkCut(lastX, lastY, currentX, currentY));
      
      lastX = currentX;
      lastY = currentY;
    });
  }
  
  checkStarCollection() {
    const collectedStarsBefore = this.collectedStars;
    
    this.stars = this.stars.filter(star => {
      if (star.checkCollision(this.candy)) {
        this.collectedStars++;
        this.ui.updateLevelUI();
        
        // Add coin effect
        this.coinsEffect.addCoins(100, star.x, star.y, 780, 35);
        
        return false;
      }
      return true;
    });
    
    // Don't update totalStars - we keep it fixed at 5000 coins (50 stars)
    // if (this.collectedStars > collectedStarsBefore) {
    //   this.totalStars += (this.collectedStars - collectedStarsBefore);
    //   this.saveProgress();
    // }
  }
  
  checkCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 30; // Collision threshold
  }
  
  handleLevelComplete() {
    this.gameState = 'levelComplete';
    this.popup.show('Level Complete!', 'success');
    this.collectedStars = this.stars.length;
    
    // Show Om Nom's happy animation when level is complete
    this.omNom.showHappyAnimation();
    
    // No automatic level progression - user must click the button
    // Clear any existing timer just in case
    if (this.nextLevelTimer) {
      clearTimeout(this.nextLevelTimer);
      this.nextLevelTimer = null;
    }
  }

  handleGameOver() {
    this.gameState = 'gameOver';
    this.popup.show('Try again!', 'failure');
    
    // Show Om Nom's sad animation when game over
    this.omNom.showSadAnimation();
  }

  onPopupClose(type) {
    // Clear any existing timer
    if (this.nextLevelTimer) {
      clearTimeout(this.nextLevelTimer);
      this.nextLevelTimer = null;
    }
    
    if (type === 'success') {
      // Level complete
      this.goToNextLevel();
    } else {
      // Game over
      this.gameState = 'playing';
      this.initLevel();
    }
  }

  checkOmNomCollision() {
    // Use predefined level
    const level = LEVELS[this.currentLevel - 1];
    if (!level) return;
    
    if (this.checkCollision(this.candy, level.omNom)) {
      // Show eating animation when candy reaches Om Nom
      this.omNom.startEatingAnimation();
      this.handleLevelComplete();
    }
  }
  
  showHome() {
    this.gameState = 'home';
    this.homeManager.show();
  }
  
  hideHome() {
    if (this.gameState === 'home') {
      this.gameState = 'playing';
      this.homeManager.hide();
    }
  }
  
  goToNextLevel() {
    // Increment the level counter
    this.currentLevel++;
    
    // Reset level counter if it exceeds available levels
    if (this.currentLevel > LEVELS.length) {
      this.currentLevel = 1;
    }
    
    this.saveProgress();
    this.gameState = 'playing';
    this.initLevel();
  }

  showEditor() {
    this.gameState = 'editor';
    this.levelEditor.show();
  }

  hideEditor() {
    if (this.gameState === 'editor') {
      this.gameState = 'playing';
      this.levelEditor.hide();
    }
  }
  
  initTemporaryLevel(levelData) {
    console.log('Initializing temporary level in editor mode');
    
    if (!levelData) {
      console.error('No level data provided to initTemporaryLevel');
      return;
    }
    
    // Use the passed level data to recreate game elements without changing the current level
    this.ropes = [];
    this.stars = levelData.stars.map(star => new Star(star.x, star.y));
    this.bubbles = (levelData.bubbles || []).map(bubble => new Bubble(bubble.x, bubble.y));
    
    // Add debug log for bubbles created in the editor
    if (this.bubbles && this.bubbles.length > 0) {
      console.log('Editor bubble methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.bubbles[0])));
    }
    
    this.airPillows = (levelData.airPillows || []).map(pillow => 
      new AirPillow(pillow.x, pillow.y, pillow.width, pillow.height)
    );
    
    // Update candy position with no velocity
    this.candy.vx = 0;
    this.candy.vy = 0;
    this.candy.reset(levelData.candy.x, levelData.candy.y);
    
    // Also update OmNom if needed
    if (levelData.omNom) {
      this.omNom.x = levelData.omNom.x;
      this.omNom.y = levelData.omNom.y;
    }
    
    // Create ropes from each anchor to candy
    levelData.anchors.forEach(anchor => {
      this.ropes.push(new Rope(anchor, levelData.candy, levelData.ropeSegments || 10));
    });
    
    console.log('Temporary level initialized with', 
      this.ropes.length, 'ropes,', 
      this.stars.length, 'stars,',
      (this.bubbles ? this.bubbles.length : 0), 'bubbles,',
      (this.airPillows ? this.airPillows.length : 0), 'air pillows'
    );
  }

  showShop() {
    // Save the current game state so we can return to it
    this.previousGameState = this.gameState;
    console.log('Entering shop, saved previous state:', this.previousGameState);
    
    this.gameState = 'shop';
    this.shop.show();
  }
  
  hideShop() {
    if (this.gameState === 'shop') {
      this.gameState = this.previousGameState || 'playing';
      this.shop.hide();
      
      // Make sure the UI is in a consistent state
      if (this.gameState === 'home') {
        this.homeManager.show();
      } else if (this.gameState === 'editor') {
        this.levelEditor.show();
      } else if (this.gameState === 'playing') {
        // Ensure any necessary UI updates for playing state
        this.ui.updateLevelUI();
      }
      
      console.log('Exited shop, restored game state to:', this.gameState);
    }
  }
} 