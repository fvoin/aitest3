export class AirPillow {
  constructor(x, y, width, height, strength = 8) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.strength = strength;
    this.active = false;
    this.isClicked = false;
    this.animationTime = 0;
    this.particleTime = 0;
    this.particles = [];
    this.color = '#ffdd00';
    this.fanRotation = 0; // For fan animation
  }

  update() {
    this.animationTime += 0.05;
    
    if (this.active) {
      this.particleTime += 1;
      
      if (this.particleTime >= 5) {
        this.particleTime = 0;
        this.addParticle();
      }
    }
    
    // Update existing particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // For legacy particles that use life instead of alpha
      if (particle.life !== undefined) {
        particle.life -= 1;
        if (particle.life <= 0) {
          this.particles.splice(i, 1);
        }
        continue;
      }
      
      // For particles using the alpha system
      if (particle.alpha !== undefined) {
        particle.alpha -= 0.05;
        if (particle.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }
  }

  draw(ctx) {
    // Calculate pulse effect when active
    const pulseScale = this.active ? 1 + Math.sin(Date.now() / 200) * 0.05 : 1;
    const isActive = this.active;
    
    // Apply the pulse scaling to the entire drawing
    ctx.save();
    if (isActive) {
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.scale(pulseScale, pulseScale);
      ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    }
    
    // Base - metallic silver body
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, '#d0d0d0');
    gradient.addColorStop(0.4, '#f5f5f5');
    gradient.addColorStop(0.6, '#e0e0e0');
    gradient.addColorStop(1, '#c0c0c0');
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 2;
    
    // Main body with rounded corners
    const radius = 15;
    ctx.beginPath();
    ctx.moveTo(this.x + radius, this.y);
    ctx.lineTo(this.x + this.width - radius, this.y);
    ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + radius, radius);
    ctx.lineTo(this.x + this.width, this.y + this.height - radius);
    ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - radius, this.y + this.height, radius);
    ctx.lineTo(this.x + radius, this.y + this.height);
    ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - radius, radius);
    ctx.lineTo(this.x, this.y + radius);
    ctx.arcTo(this.x, this.y, this.x + radius, this.y, radius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw vents/grille - horizontal lines representing the mesh
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    const ventSpacing = 4;
    const ventMargin = this.height * 0.15;
    
    for (let y = this.y + ventMargin; y < this.y + this.height - ventMargin; y += ventSpacing) {
      ctx.beginPath();
      ctx.moveTo(this.x + 10, y);
      ctx.lineTo(this.x + this.width - 10, y);
      ctx.stroke();
    }
    
    // Draw vertical separators for the grille
    const numSeparators = 4;
    const separatorSpacing = this.width / (numSeparators + 1);
    
    for (let i = 1; i <= numSeparators; i++) {
      const x = this.x + separatorSpacing * i;
      ctx.beginPath();
      ctx.moveTo(x, this.y + ventMargin);
      ctx.lineTo(x, this.y + this.height - ventMargin);
      ctx.stroke();
    }
    
    // Draw fan in the center
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const fanRadius = Math.min(this.width, this.height) * 0.25;
    
    // Draw fan base circle
    ctx.fillStyle = isActive ? '#444444' : '#333333';
    ctx.beginPath();
    ctx.arc(centerX, centerY, fanRadius * 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw fan blades
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.fanRotation);
    
    ctx.fillStyle = isActive ? '#dddddd' : '#aaaaaa';
    const numBlades = 5;
    
    for (let i = 0; i < numBlades; i++) {
      ctx.save();
      ctx.rotate((Math.PI * 2 / numBlades) * i);
      
      // Create blade shape
      ctx.beginPath();
      ctx.ellipse(fanRadius * 0.6, 0, fanRadius * 0.7, fanRadius * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    // Center hub of fan
    ctx.fillStyle = isActive ? '#ffdd00' : '#dddddd';
    ctx.beginPath();
    ctx.arc(0, 0, fanRadius * 0.25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Update fan rotation when active
    if (isActive) {
      this.fanRotation += 0.5; // Doubled rotation speed from 0.25 to 0.5
    } else {
      // Slow down gradually when inactive
      this.fanRotation += 0.025;
    }
    
    // Draw air flow/motion lines when active
    if (isActive) {
      // Direction of airflow (right side of the air pillow)
      const flowStartX = this.x + this.width;
      const flowCenterY = this.y + this.height / 2;
      const flowLength = 160;  // Doubled from 80
      const flowWidth = this.height * 1.0;  // Increased from 0.7
      
      // Draw multiple curved lines to represent airflow
      ctx.strokeStyle = 'rgba(173, 216, 230, 0.6)';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 12; i++) {  // Doubled from 6 to 12
        const offsetY = (Math.random() - 0.5) * flowWidth;
        const waveHeight = 10 + Math.random() * 10;  // Doubled wave height randomness
        const startX = flowStartX + Math.random() * 10;
        
        ctx.beginPath();
        ctx.moveTo(startX, flowCenterY + offsetY);
        
        // Create wavy lines using quadratic curves
        const segments = 3 + Math.floor(Math.random() * 3);
        const segmentLength = flowLength / segments;
        
        for (let j = 1; j <= segments; j++) {
          const segX = startX + segmentLength * j;
          const cpX = startX + segmentLength * (j - 0.5);
          const dir = j % 2 === 0 ? 1 : -1;
          
          ctx.quadraticCurveTo(
            cpX, 
            flowCenterY + offsetY + waveHeight * dir, 
            segX, 
            flowCenterY + offsetY
          );
        }
        
        ctx.stroke();
      }
      
      // Add small particle effects near the airflow
      for (let i = 0; i < 6; i++) {  // Doubled from 3 to 6
        const particleX = flowStartX + Math.random() * (flowLength * 0.7);
        const particleY = flowCenterY + (Math.random() - 0.5) * flowWidth * 0.8;
        const particleSize = 2 + Math.random() * 6;  // Increased max size from 3 to 6
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw power button on top
    const buttonSize = Math.min(this.width, this.height) * 0.15;
    const buttonX = this.x + this.width * 0.8;
    const buttonY = this.y + this.height * 0.25;
    
    // Button background
    ctx.fillStyle = isActive ? '#ff5555' : '#555555';
    ctx.beginPath();
    ctx.arc(buttonX, buttonY, buttonSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Button power symbol
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(buttonX, buttonY, buttonSize * 0.6, Math.PI * 0.3, Math.PI * 1.7, false);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(buttonX, buttonY - buttonSize * 0.3);
    ctx.lineTo(buttonX, buttonY - buttonSize * 0.1);
    ctx.stroke();
    
    ctx.restore();
    
    // Draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      
      // Update particle position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Fade particles out
      if (particle.alpha !== undefined) {
        particle.alpha -= 0.05;
        
        // Skip drawing if completely transparent
        if (particle.alpha <= 0) {
          this.particles.splice(i, 1);
          i--;
          continue;
        }
        
        // Ensure alpha is a valid number between 0 and 1
        const safeAlpha = Math.max(0, Math.min(1, isNaN(particle.alpha) ? 0 : particle.alpha));
        
        // Draw with gradient for better effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${safeAlpha})`);
        gradient.addColorStop(1, `rgba(200, 230, 255, ${safeAlpha * 0.3})`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (particle.life !== undefined) {
        // Legacy particle support
        const alpha = particle.life / 50;
        ctx.fillStyle = `rgba(200, 230, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  addParticle() {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    // Randomly determine if the particle should go left or right
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    // Add a new particle with yellow colors
    this.particles.push({
      x: centerX,
      y: centerY + (Math.random() * this.height * 0.6 - this.height * 0.3),
      vx: this.strength * 1.5 * direction,
      vy: (Math.random() - 0.5) * 0.5,
      size: 5 + Math.random() * 5,
      alpha: 0.7,
      color: Math.random() > 0.5 ? '#ffdd00' : '#fff5cc'
    });
  }

  applyEffect(candy) {
    if (!this.active) return;
    
    // Define the range in which the air pillow affects the candy - doubled range
    const rangeLeft = this.x - 200;    // Doubled from 100
    const rangeRight = this.x + this.width + 300;  // Doubled from 150
    const rangeTop = this.y - 200;     // Doubled from 100
    const rangeBottom = this.y + this.height + 300;  // Doubled from 150
    
    // Check if candy is in range
    if (candy.x > rangeLeft && candy.x < rangeRight && 
        candy.y > rangeTop && candy.y < rangeBottom) {
      
      // Calculate distance from air pillow center to candy
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      const dx = candy.x - centerX;
      const dy = candy.y - centerY;
      
      // Normalize direction and apply strength - Now 4x stronger
      const distance = Math.sqrt(dx * dx + dy * dy);
      const forceStrength = Math.max(0, 1 - distance / 400) * this.strength * 0.2; // Doubled distance factor from 200 to 400
      
      if (distance > 0) {
        const dirX = dx / distance;
        const dirY = dy / distance;
        
        // Apply force directly to candy using the new method
        if (candy.applyDirectionalForce) {
          candy.applyDirectionalForce(dirX * forceStrength, dirY * forceStrength);
        } else {
          // Fallback to old method
          candy.vx += dirX * forceStrength;
          candy.vy += dirY * forceStrength;
        }
        
        console.log(`Air force applied: ${dirX * forceStrength}, ${dirY * forceStrength}, Distance: ${distance}, Candy pos: ${candy.x}, ${candy.y}`);
      }
      
      // Generate more particles
      for (let i = 0; i < 10; i++) {  // Doubled from 5 to 10
        const particleX = this.x + this.width / 2 + (Math.random() - 0.5) * this.width * 0.8;
        const particleY = this.y + this.height / 2 + (Math.random() - 0.5) * this.height * 0.8;
        
        this.particles.push({
          x: particleX,
          y: particleY,
          vx: (Math.random() - 0.5) * 4 + (candy.x - this.x - this.width/2) / 50,  // Doubled from 2 to 4
          vy: (Math.random() - 0.5) * 4 + (candy.y - this.y - this.height/2) / 50,  // Doubled from 2 to 4
          size: Math.random() * 5 + 3,
          alpha: 1.0,  // Ensure alpha starts as a valid number
          color: this.color
        });
      }
    }
  }
  
  // Modify method to affect bubbles
  affectBubbles(bubbles) {
    if (!this.active || !bubbles || bubbles.length === 0) return;
    
    for (const bubble of bubbles) {
      if (!bubble.active) continue;
      
      // Define the range in which the air pillow affects the bubble - doubled range
      const rangeLeft = this.x - 300;    // Doubled from 150
      const rangeRight = this.x + this.width + 400;  // Doubled from 200
      const rangeTop = this.y - 300;     // Doubled from 150
      const rangeBottom = this.y + this.height + 400;  // Doubled from 200
      
      // Check if bubble is in range
      if (bubble.x > rangeLeft && bubble.x < rangeRight && 
          bubble.y > rangeTop && bubble.y < rangeBottom) {
        
        // Calculate distance from air pillow center to bubble
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const dx = bubble.x - centerX;
        const dy = bubble.y - centerY;
        
        // Normalize direction and apply strength - doubled range and effect
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceStrength = Math.max(0, 1 - distance / 500) * this.strength * 0.3;  // Doubled from 250 to 500, doubled effect multiplier from 0.15 to 0.3
        
        if (distance > 0) {
          const dirX = dx / distance;
          const dirY = dy / distance;
          
          // Apply force to the bubble
          bubble.x += dirX * forceStrength;
          bubble.y += dirY * forceStrength;
          
          console.log(`Air force applied to bubble: ${dirX * forceStrength}, ${dirY * forceStrength}`);
        }
      }
    }
  }
  
  checkClick(x, y) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }
  
  activate() {
    this.active = true;
  }
  
  deactivate() {
    this.active = false;
  }
} 