export class OmNom {
  constructor(size) {
    this.size = size;
    this.defaultSize = size;
    
    // Animation properties
    this.mood = 'idle'; // 'idle', 'happy', 'sad', 'eating'
    this.moodTimer = 0;
    this.blinkTime = 0;
    this.isBlinking = false;
    this.animationTime = 0;
    this.bobAmount = 0; // For bobbing animation
    
    // Position variables
    this.x = 0;
    this.y = 0;
    this.scale = 1;
    this.rotation = 0;
    
    // Create base idle image
    this.image = new Image();
    this.image.src = this.createSvgImage('idle');

    // Enhanced animation properties
    this.size = size;
    this.defaultSize = size;
    
    // Basic mood and animation state
    this.mood = 'idle'; // 'idle', 'happy', 'sad', 'eating'
    this.moodTimer = 0;
    this.previousMood = 'idle';
    
    // Blinking animation
    this.blinkTime = 0;
    this.isBlinking = false;
    this.blinkDuration = 0.4;
    this.blinkFrequency = 0.003;
    this.nextBlinkTime = Math.random() * 100;
    
    // Animation timers
    this.animationTime = 0;
    this.mouthAnimTime = 0;
    
    // Movement animations
    this.bobAmount = 0;
    this.bobSpeed = 0.8;
    this.bobIntensity = 0.05;
    this.bounceAmount = 0;
    
    // Eating animation
    this.eatingPhase = 0;
    this.mouthOpenAmount = 0;
    
    // Position variables
    this.x = 0;
    this.y = 0;
    this.scale = 1;
    this.rotation = 0;
    
    // Images for different expressions
    this.images = {};
    this.currentImage = null;
    this.loadImages();
  }
  
  loadImages() {
    const moods = ['idle', 'happy', 'sad', 'eating', 'blinking', 'chewing'];
    
    moods.forEach(mood => {
      this.images[mood] = new Image();
      this.images[mood].src = this.createSvgImage(mood);
    });
    
    this.currentImage = this.images.idle;
  }
  
  createSvgImage(type) {
    let svgContent;
    
    switch(type) {
      case 'happy':
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <!-- Main body - bright green -->
            <circle cx="50" cy="50" r="45" fill="#4CAF50"/>
            
            <!-- Darker green spots -->
            <circle cx="30" cy="35" r="10" fill="#3E8E41"/>
            <circle cx="70" cy="35" r="8" fill="#3E8E41"/>
            <circle cx="40" cy="70" r="7" fill="#3E8E41"/>
            <circle cx="65" cy="65" r="9" fill="#3E8E41"/>
            
            <!-- Happy Eyes - squinted with joy -->
            <ellipse cx="32" cy="35" rx="13" ry="7" fill="white"/>
            <ellipse cx="68" cy="35" rx="13" ry="7" fill="white"/>
            <path d="M 25 35 Q 32 28 39 35" fill="none" stroke="black" stroke-width="2"/>
            <path d="M 61 35 Q 68 28 75 35" fill="none" stroke="black" stroke-width="2"/>
            
            <!-- Big happy grin -->
            <path d="M 25 65 Q 50 90 75 65" fill="#CC3333" stroke="#000000" stroke-width="2"/>
            <ellipse cx="50" cy="75" rx="15" ry="7" fill="#FF6666" stroke="#CC3333" stroke-width="1"/>
            
            <!-- Little arms/legs - more animated -->
            <path d="M 12 55 Q 0 45 10 40" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 88 55 Q 100 45 90 40" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 30 90 Q 25 100 15 95" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 70 90 Q 75 100 85 95" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
          </svg>
        `;
        break;
        
      case 'sad':
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <!-- Main body - slightly darker green to show sadness -->
            <circle cx="50" cy="50" r="45" fill="#3E8E41"/>
            
            <!-- Darker green spots -->
            <circle cx="30" cy="35" r="10" fill="#2E7D32"/>
            <circle cx="70" cy="35" r="8" fill="#2E7D32"/>
            <circle cx="40" cy="70" r="7" fill="#2E7D32"/>
            <circle cx="65" cy="65" r="9" fill="#2E7D32"/>
            
            <!-- Sad Eyes - droopy -->
            <ellipse cx="32" cy="35" rx="13" ry="15" fill="white"/>
            <ellipse cx="68" cy="35" rx="13" ry="15" fill="white"/>
            <circle cx="32" cy="38" r="6" fill="black"/>
            <circle cx="68" cy="38" r="6" fill="black"/>
            <circle cx="30" cy="36" r="2" fill="white"/>
            <circle cx="66" cy="36" r="2" fill="white"/>
            
            <!-- Sad eyebrows -->
            <path d="M 20 25 Q 25 20 35 25" fill="none" stroke="#2E7D32" stroke-width="3"/>
            <path d="M 65 25 Q 75 20 80 25" fill="none" stroke="#2E7D32" stroke-width="3"/>
            
            <!-- Sad frown -->
            <path d="M 30 70 Q 50 60 70 70" fill="#CC3333" stroke="#000000" stroke-width="2"/>
            <path d="M 45 65 Q 50 63 55 65" fill="#FF6666" stroke="#CC3333" stroke-width="1"/>
            
            <!-- Drooping arms/legs -->
            <path d="M 15 55 Q 10 60 5 58" fill="none" stroke="#2E7D32" stroke-width="4" stroke-linecap="round"/>
            <path d="M 85 55 Q 90 60 95 58" fill="none" stroke="#2E7D32" stroke-width="4" stroke-linecap="round"/>
            <path d="M 30 90 Q 25 95 20 93" fill="none" stroke="#2E7D32" stroke-width="4" stroke-linecap="round"/>
            <path d="M 70 90 Q 75 95 80 93" fill="none" stroke="#2E7D32" stroke-width="4" stroke-linecap="round"/>
          </svg>
        `;
        break;
        
      case 'eating':
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <!-- Main body - excited bright green -->
            <circle cx="50" cy="50" r="45" fill="#4CAF50"/>
            
            <!-- Darker green spots -->
            <circle cx="30" cy="30" r="10" fill="#3E8E41"/>
            <circle cx="70" cy="30" r="8" fill="#3E8E41"/>
            <circle cx="40" cy="70" r="7" fill="#3E8E41"/>
            <circle cx="65" cy="65" r="9" fill="#3E8E41"/>
            
            <!-- Wide excited eyes -->
            <ellipse cx="32" cy="30" rx="15" ry="17" fill="white"/>
            <ellipse cx="68" cy="30" rx="15" ry="17" fill="white"/>
            <circle cx="32" cy="30" r="7" fill="black"/>
            <circle cx="68" cy="30" r="7" fill="black"/>
            <circle cx="30" cy="28" r="2" fill="white"/>
            <circle cx="66" cy="28" r="2" fill="white"/>
            
            <!-- Wide open mouth -->
            <circle cx="50" cy="70" r="25" fill="#CC3333" stroke="#000000" stroke-width="2"/>
            <ellipse cx="50" cy="85" rx="15" ry="5" fill="#FF6666" stroke="#CC3333" stroke-width="1"/>
            
            <!-- Excited arms/legs -->
            <path d="M 12 50 Q 0 40 5 35" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 88 50 Q 100 40 95 35" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 30 90 Q 20 100 15 90" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 70 90 Q 80 100 85 90" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
          </svg>
        `;
        break;

      case 'blinking':
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <!-- Main body - bright green -->
            <circle cx="50" cy="50" r="45" fill="#4CAF50"/>
            
            <!-- Darker green spots -->
            <circle cx="30" cy="35" r="10" fill="#3E8E41"/>
            <circle cx="70" cy="35" r="8" fill="#3E8E41"/>
            <circle cx="40" cy="70" r="7" fill="#3E8E41"/>
            <circle cx="65" cy="65" r="9" fill="#3E8E41"/>
            
            <!-- Blinking eyes - almost closed -->
            <ellipse cx="32" cy="35" rx="13" ry="3" fill="white"/>
            <ellipse cx="68" cy="35" rx="13" ry="3" fill="white"/>
            <ellipse cx="32" cy="35" rx="5" ry="1" fill="black"/>
            <ellipse cx="68" cy="35" rx="5" ry="1" fill="black"/>
            
            <!-- Mouth - normal/slightly open -->
            <path d="M 30 65 Q 50 75 70 65" fill="#CC3333" stroke="#000000" stroke-width="2"/>
            <path d="M 45 70 Q 50 73 55 70" fill="#FF6666" stroke="#CC3333" stroke-width="1"/>
            
            <!-- Little arms/legs -->
            <path d="M 12 55 Q 5 50 10 45" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 88 55 Q 95 50 90 45" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 30 90 Q 25 95 20 90" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 70 90 Q 75 95 80 90" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
          </svg>
        `;
        break;

      case 'chewing':
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <!-- Main body - excited bright green -->
            <circle cx="50" cy="50" r="45" fill="#4CAF50"/>
            
            <!-- Darker green spots -->
            <circle cx="30" cy="30" r="10" fill="#3E8E41"/>
            <circle cx="70" cy="30" r="8" fill="#3E8E41"/>
            <circle cx="40" cy="70" r="7" fill="#3E8E41"/>
            <circle cx="65" cy="65" r="9" fill="#3E8E41"/>
            
            <!-- Satisfied eyes - half closed -->
            <ellipse cx="32" cy="30" rx="15" ry="10" fill="white"/>
            <ellipse cx="68" cy="30" rx="15" ry="10" fill="white"/>
            <ellipse cx="32" cy="32" rx="8" ry="5" fill="black"/>
            <ellipse cx="68" cy="32" rx="8" ry="5" fill="black"/>
            <circle cx="30" cy="30" r="2" fill="white"/>
            <circle cx="66" cy="30" r="2" fill="white"/>
            
            <!-- Chewing mouth - not fully open -->
            <ellipse cx="50" cy="70" rx="20" ry="15" fill="#CC3333" stroke="#000000" stroke-width="2"/>
            <ellipse cx="50" cy="75" rx="12" ry="5" fill="#FF6666" stroke="#CC3333" stroke-width="1"/>
            
            <!-- Cheek bulges to show something is in mouth -->
            <circle cx="30" cy="60" r="10" fill="#4CAF50" stroke="#3E8E41" stroke-width="1"/>
            <circle cx="70" cy="60" r="10" fill="#4CAF50" stroke="#3E8E41" stroke-width="1"/>
            
            <!-- Slightly raised arms for chewing animation -->
            <path d="M 12 55 Q 5 45 10 40" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 88 55 Q 95 45 90 40" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 30 90 Q 25 95 20 90" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 70 90 Q 75 95 80 90" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
          </svg>
        `;
        break;
        
      default: // idle
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <!-- Main body - bright green -->
            <circle cx="50" cy="50" r="45" fill="#4CAF50"/>
            
            <!-- Darker green spots -->
            <circle cx="30" cy="35" r="10" fill="#3E8E41"/>
            <circle cx="70" cy="35" r="8" fill="#3E8E41"/>
            <circle cx="40" cy="70" r="7" fill="#3E8E41"/>
            <circle cx="65" cy="65" r="9" fill="#3E8E41"/>
            
            <!-- Eyes - normal state -->
            <ellipse cx="32" cy="35" rx="13" ry="15" fill="white"/>
            <ellipse cx="68" cy="35" rx="13" ry="15" fill="white"/>
            <circle cx="35" cy="33" r="6" fill="black"/>
            <circle cx="71" cy="33" r="6" fill="black"/>
            <circle cx="33" cy="31" r="2" fill="white"/>
            <circle cx="69" cy="31" r="2" fill="white"/>
            
            <!-- Mouth - normal/slightly open -->
            <path d="M 30 65 Q 50 75 70 65" fill="#CC3333" stroke="#000000" stroke-width="2"/>
            <path d="M 45 70 Q 50 73 55 70" fill="#FF6666" stroke="#CC3333" stroke-width="1"/>
            
            <!-- Little arms/legs -->
            <path d="M 12 55 Q 5 50 10 45" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 88 55 Q 95 50 90 45" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 30 90 Q 25 95 20 90" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
            <path d="M 70 90 Q 75 95 80 90" fill="none" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>
          </svg>
        `;
    }
    
    return 'data:image/svg+xml,' + encodeURIComponent(svgContent);
  }
  
  update() {
    // Update animation timers
    this.animationTime += 0.05;
    this.mouthAnimTime += 0.08; // Mouth animates slightly faster
    
    // Handle mood-specific animations
    switch (this.mood) {
      case 'idle':
        this.handleIdleAnimation();
        break;
      case 'happy':
        this.handleHappyAnimation();
        break;
      case 'sad':
        this.handleSadAnimation();
        break;
      case 'eating':
        this.handleEatingAnimation();
        break;
    }
    
    // Update mood timer and transition back to idle if needed
    if (this.mood !== 'idle' && this.moodTimer > 0) {
      this.moodTimer -= 0.02; // Slower transition back to idle
      if (this.moodTimer <= 0) {
        this.mood = 'idle';
        this.currentImage = this.images.idle;
      }
    }
  }
  
  handleIdleAnimation() {
    // Basic bobbing animation
    this.bobAmount = Math.sin(this.animationTime * this.bobSpeed) * this.bobIntensity;
    
    // Random blinking
    if (!this.isBlinking && Math.random() < this.blinkFrequency) {
      this.isBlinking = true;
      this.blinkTime = 0;
    }
    
    // Process blinking
    if (this.isBlinking) {
      // Show blinking image during the middle of the blink
      if (this.blinkTime > 0.1 && this.blinkTime < 0.3) {
        this.currentImage = this.images.blinking;
      } else {
        this.currentImage = this.images.idle;
      }
      
      this.blinkTime += 0.05;
      if (this.blinkTime > this.blinkDuration) {
        this.isBlinking = false;
        this.currentImage = this.images.idle;
      }
    }
    
    // Subtle rotation for liveliness
    this.rotation = Math.sin(this.animationTime * 0.5) * 0.02;
  }
  
  handleHappyAnimation() {
    // More energetic bobbing
    this.bobAmount = Math.sin(this.animationTime * 1.2) * 0.08;
    
    // Bouncing effect
    this.bounceAmount = Math.abs(Math.sin(this.animationTime * 3)) * 0.1;
    
    // Excited wiggling
    this.rotation = Math.sin(this.animationTime * 2) * 0.05;
    
    // Use happy expression
    this.currentImage = this.images.happy;
  }
  
  handleSadAnimation() {
    // Slower, droopier movement
    this.bobAmount = Math.sin(this.animationTime * 0.5) * 0.03;
    
    // Slight tilt downward
    this.rotation = -0.02 + Math.sin(this.animationTime * 0.3) * 0.01;
    
    // Use sad expression
    this.currentImage = this.images.sad;
  }
  
  handleEatingAnimation() {
    // Track eating phases: 0=starting, 1=open mouth, 2=chewing, 3=swallowing
    const phaseDuration = 0.6; // Duration of each phase
    const currentPhaseTime = this.moodTimer % phaseDuration;
    const currentPhase = Math.floor(this.moodTimer / phaseDuration);
    
    // Phase-specific animations
    if (currentPhase >= 3) {
      // Finished eating, transition to happy
      this.mood = 'happy';
      this.moodTimer = 2;
      this.currentImage = this.images.happy;
    } else if (currentPhase === 0) {
      // Opening mouth wide with excitement
      this.currentImage = this.images.eating;
      this.bobAmount = Math.sin(this.animationTime * 2) * 0.06;
    } else if (currentPhase === 1 || currentPhase === 2) {
      // Chewing animation
      this.currentImage = this.images.chewing;
      
      // Chewing movement (up and down)
      const chewRate = 4; // Speed of chewing
      this.bobAmount = Math.sin(this.animationTime * chewRate) * 0.04;
    }
  }
  
  draw(ctx, position) {
    this.x = position.x;
    this.y = position.y;
    
    // Save context state
    ctx.save();
    
    // Translate to Om Nom's position
    ctx.translate(position.x, position.y);
    
    // Calculate scale based on animation state
    let animScale = 1 + this.bobAmount;
    
    // Add mood-specific animations
    if (this.mood === 'happy') {
      // Add bounce effect for happy mood
      animScale += this.bounceAmount;
      
      // Apply happy wiggle animation
      const wiggleAmount = Math.sin(this.animationTime * 3) * 0.05;
      ctx.rotate(wiggleAmount + this.rotation);
    } else if (this.mood === 'eating') {
      // Expand and contract slightly when eating
      const chewPulse = Math.sin(this.animationTime * 4) * 0.07;
      animScale += chewPulse;
      
      // Apply slight rotation for eating animation
      ctx.rotate(this.rotation);
    } else if (this.mood === 'sad') {
      // Make slightly smaller when sad
      animScale *= 0.95;
      
      // Apply sad tilt
      ctx.rotate(this.rotation);
    } else {
      // Normal idle rotation
      ctx.rotate(this.rotation);
    }
    
    // Apply scale
    ctx.scale(animScale, animScale);
    
    // Draw Om Nom using the current image
    if (this.currentImage) {
      ctx.drawImage(
        this.currentImage,
        -this.size / 2,
        -this.size / 2,
        this.size,
        this.size
      );
    }
    
    // Restore context
    ctx.restore();
  }
  
  setMood(mood, duration = 3) {
    this.mood = mood;
    this.moodTimer = duration;
    this.currentImage = this.images[mood] || this.images.idle;
  }
  
  checkCollision(candy, position) {
    const dx = candy.x - position.x;
    const dy = candy.y - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Check if candy is close to Om Nom's mouth (which is near the bottom of Om Nom)
    const mouthY = position.y + this.size / 4; // Mouth is slightly below center
    const isNearMouth = Math.abs(candy.y - mouthY) < this.size / 3;
    
    return distance < this.size * 0.7 && isNearMouth;
  }
  
  startEatingAnimation() {
    this.setMood('eating', 3);
  }
  
  showHappyAnimation() {
    this.setMood('happy', 3);
  }
  
  showSadAnimation() {
    this.setMood('sad', 2);
  }
  
  resetSize() {
    this.size = this.defaultSize;
    this.setMood('idle');
  }
} 