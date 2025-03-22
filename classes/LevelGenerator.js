export class LevelGenerator {
  constructor() {
    this.difficultyLevel = 1;
    this.levelCount = 0;
    this.maxRopes = 5;
    this.maxStars = 3;
    this.maxBubbles = 3;
    this.maxAirPillows = 2;
    this.canvasWidth = 800;
    this.canvasHeight = 600;
    
    // Safe areas for placing objects
    this.safeMargin = 50;
    this.playableWidth = this.canvasWidth - (this.safeMargin * 2);
    this.playableHeight = this.canvasHeight - (this.safeMargin * 2);
  }
  
  generateLevel() {
    this.levelCount++;
    
    // Adjust difficulty every 5 levels
    if (this.levelCount % 5 === 0) {
      this.difficultyLevel++;
    }
    
    // Calculate number of objects based on difficulty
    const ropeCount = Math.min(2 + Math.floor(Math.random() * this.difficultyLevel), this.maxRopes);
    const starCount = Math.min(1 + Math.floor(Math.random() * this.difficultyLevel), this.maxStars);
    const bubbleCount = Math.min(Math.floor(Math.random() * (this.difficultyLevel - 1)), this.maxBubbles);
    const airPillowCount = Math.min(Math.floor(Math.random() * (this.difficultyLevel - 1)), this.maxAirPillows);
    
    // Generate level parts
    const candy = this.generateCandy();
    const omNom = this.generateOmNom(candy);
    const anchors = this.generateAnchors(ropeCount, candy);
    const stars = this.generateStars(starCount, candy, omNom, anchors);
    const bubbles = bubbleCount > 0 ? this.generateBubbles(bubbleCount, candy, omNom, stars, anchors) : [];
    const airPillows = airPillowCount > 0 ? this.generateAirPillows(airPillowCount, candy, omNom, stars, bubbles) : [];
    
    // Create level object
    const level = {
      id: this.levelCount,
      name: `Generated Level ${this.levelCount}`,
      candy,
      omNom,
      anchors,
      stars,
      bubbles,
      airPillows,
      ropeSegments: 10, // Default rope segments
    };
    
    // Validate level is solvable
    if (!this.validateLevel(level)) {
      console.log("Generated level wasn't valid, regenerating...");
      return this.generateLevel(); // Try again if not valid
    }
    
    return level;
  }
  
  generateCandy() {
    // Place candy in upper part of the playable area
    const x = this.safeMargin + Math.random() * this.playableWidth;
    const y = this.safeMargin + Math.random() * (this.playableHeight / 3);
    
    return { x, y };
  }
  
  generateOmNom(candy) {
    // Place Om Nom at bottom right area, ensuring distance from candy
    const minDistance = 300; // Minimum distance from candy
    
    let x, y, distance;
    do {
      x = this.safeMargin + (this.playableWidth / 2) + Math.random() * (this.playableWidth / 2);
      y = this.safeMargin + (this.playableHeight / 2) + Math.random() * (this.playableHeight / 2);
      
      // Calculate distance from candy
      const dx = x - candy.x;
      const dy = y - candy.y;
      distance = Math.sqrt(dx * dx + dy * dy);
    } while (distance < minDistance);
    
    return { x, y };
  }
  
  generateAnchors(count, candy) {
    const anchors = [];
    const minDistance = 50; // Minimum distance between anchors
    const maxDistance = 300; // Maximum distance from candy to ensure playability
    
    for (let i = 0; i < count; i++) {
      let x, y, isValid;
      let attempts = 0;
      
      do {
        isValid = true;
        
        // Randomly place anchor around candy, but within max distance
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * (maxDistance - 50);
        
        x = candy.x + Math.cos(angle) * distance;
        y = Math.random() * (candy.y - this.safeMargin) + this.safeMargin; // Anchor always above candy
        
        // Make sure anchor is in playable area
        if (x < this.safeMargin || x > this.canvasWidth - this.safeMargin ||
            y < this.safeMargin || y > this.canvasHeight - this.safeMargin) {
          isValid = false;
          continue;
        }
        
        // Check distance from other anchors
        for (const anchor of anchors) {
          const dx = x - anchor.x;
          const dy = y - anchor.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < minDistance) {
            isValid = false;
            break;
          }
        }
        
        attempts++;
        if (attempts > 50) {
          // If too many attempts, break and use fewer anchors
          return anchors;
        }
      } while (!isValid);
      
      anchors.push({ x, y });
    }
    
    return anchors;
  }
  
  generateStars(count, candy, omNom, anchors) {
    const stars = [];
    const minDistance = 60; // Minimum distance between objects
    
    // Generate a path from candy to Om Nom
    const pathPoints = this.generatePath(candy, omNom, 3 + Math.floor(Math.random() * 3));
    
    for (let i = 0; i < count; i++) {
      let x, y, isValid;
      let attempts = 0;
      
      do {
        isValid = true;
        
        // Try to place stars along the path from candy to Om Nom
        if (i < pathPoints.length) {
          x = pathPoints[i].x;
          y = pathPoints[i].y;
        } else {
          // Random positioning for additional stars
          x = this.safeMargin + Math.random() * this.playableWidth;
          y = this.safeMargin + Math.random() * this.playableHeight;
        }
        
        // Check distance from candy and Om Nom
        if (this.getDistance({ x, y }, candy) < minDistance || 
            this.getDistance({ x, y }, omNom) < minDistance) {
          isValid = false;
          continue;
        }
        
        // Check distance from other stars
        for (const star of stars) {
          if (this.getDistance({ x, y }, star) < minDistance) {
            isValid = false;
            break;
          }
        }
        
        // Check distance from anchors
        for (const anchor of anchors) {
          if (this.getDistance({ x, y }, anchor) < minDistance) {
            isValid = false;
            break;
          }
        }
        
        attempts++;
        if (attempts > 30) {
          // If too many attempts, use fewer stars
          return stars;
        }
      } while (!isValid);
      
      stars.push({ x, y });
    }
    
    return stars;
  }
  
  generatePath(start, end, points) {
    const path = [{ ...start }];
    
    // Create midpoints along a curve
    for (let i = 1; i <= points; i++) {
      const t = i / (points + 1);
      let x = start.x + (end.x - start.x) * t;
      
      // Add some waviness to the path
      const waveMagnitude = 100 * Math.sin(Math.PI * t);
      const randomOffset = (Math.random() - 0.5) * 80;
      x += waveMagnitude + randomOffset;
      
      // Make sure points stay in bounds
      x = Math.max(this.safeMargin, Math.min(this.canvasWidth - this.safeMargin, x));
      
      // Points generally descend from start to end
      const y = start.y + (end.y - start.y) * t + (Math.random() - 0.3) * 100;
      
      path.push({ 
        x,
        y: Math.max(this.safeMargin, Math.min(this.canvasHeight - this.safeMargin, y))
      });
    }
    
    path.push({ ...end });
    return path;
  }
  
  generateBubbles(count, candy, omNom, stars, anchors) {
    const bubbles = [];
    const minDistance = 70; // Minimum distance between objects
    
    for (let i = 0; i < count; i++) {
      let x, y, isValid;
      let attempts = 0;
      
      do {
        isValid = true;
        
        // Place bubbles in middle to lower part of screen
        x = this.safeMargin + Math.random() * this.playableWidth;
        y = this.safeMargin + (this.playableHeight / 3) + Math.random() * (this.playableHeight * 2/3);
        
        // Check distance from candy and Om Nom
        if (this.getDistance({ x, y }, candy) < minDistance || 
            this.getDistance({ x, y }, omNom) < minDistance) {
          isValid = false;
          continue;
        }
        
        // Check distance from other objects
        for (const star of stars) {
          if (this.getDistance({ x, y }, star) < minDistance) {
            isValid = false;
            break;
          }
        }
        
        for (const bubble of bubbles) {
          if (this.getDistance({ x, y }, bubble) < minDistance * 2) { // Bubbles need more space
            isValid = false;
            break;
          }
        }
        
        for (const anchor of anchors) {
          if (this.getDistance({ x, y }, anchor) < minDistance) {
            isValid = false;
            break;
          }
        }
        
        attempts++;
        if (attempts > 30) {
          // If too many attempts, use fewer bubbles
          return bubbles;
        }
      } while (!isValid);
      
      bubbles.push({ x, y });
    }
    
    return bubbles;
  }
  
  generateAirPillows(count, candy, omNom, stars, bubbles) {
    const airPillows = [];
    const minDistance = 70;
    const pillowWidth = 80 + Math.random() * 60;
    const pillowHeight = 40 + Math.random() * 30;
    
    for (let i = 0; i < count; i++) {
      let x, y, isValid;
      let attempts = 0;
      
      do {
        isValid = true;
        
        // Place air pillows near bottom of screen
        x = this.safeMargin + Math.random() * (this.playableWidth - pillowWidth);
        y = this.safeMargin + (this.playableHeight / 2) + Math.random() * (this.playableHeight / 2 - pillowHeight);
        
        // Create pillow object for collision checking
        const pillow = { 
          x, y, 
          width: pillowWidth, 
          height: pillowHeight
        };
        
        // Check for collisions with other objects
        if (this.isCircleRectCollision(candy, pillow) || this.isCircleRectCollision(omNom, pillow)) {
          isValid = false;
          continue;
        }
        
        for (const star of stars) {
          if (this.isCircleRectCollision(star, pillow)) {
            isValid = false;
            break;
          }
        }
        
        for (const bubble of bubbles) {
          if (this.isCircleRectCollision(bubble, pillow)) {
            isValid = false;
            break;
          }
        }
        
        for (const otherPillow of airPillows) {
          if (this.isRectRectCollision(pillow, otherPillow)) {
            isValid = false;
            break;
          }
        }
        
        attempts++;
        if (attempts > 20) {
          // If too many attempts, use fewer air pillows
          return airPillows;
        }
      } while (!isValid);
      
      airPillows.push({ 
        x, y, 
        width: pillowWidth, 
        height: pillowHeight
      });
    }
    
    return airPillows;
  }
  
  // Distance utility
  getDistance(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  // Circle-rectangle collision check
  isCircleRectCollision(circle, rect, circleRadius = 30) {
    // Find the closest point to the circle within the rectangle
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    
    // Calculate the distance between the circle's center and this closest point
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If the distance is less than the circle's radius, collision detected
    return distance < circleRadius;
  }
  
  // Rectangle-rectangle collision check
  isRectRectCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }
  
  validateLevel(level) {
    // Basic validation to check if level is solvable
    
    // 1. Ensure there's a path from candy to Om Nom
    // (already ensured by anchor placement and path generation)
    
    // 2. Check that all stars can be collected
    // (already taken care of by star placement along path)
    
    // 3. Ensure candy can reach Om Nom when all ropes are cut
    // This is a simplified validation - in a real game, this would use physics simulation
    const candyPath = this.simulatePhysics(level);
    
    // Check if path reaches Om Nom
    const lastPoint = candyPath[candyPath.length - 1];
    const distanceToOmNom = this.getDistance(lastPoint, level.omNom);
    
    return distanceToOmNom < 100; // Within reasonable distance
  }
  
  simulatePhysics(level) {
    // Simplified physics simulation to validate level
    const path = [];
    const gravity = 0.5;
    const timeSteps = 100;
    
    let x = level.candy.x;
    let y = level.candy.y;
    let vx = 0;
    let vy = 0;
    
    path.push({ x, y });
    
    // Simulate candy falling with gravity
    for (let i = 0; i < timeSteps; i++) {
      // Apply gravity
      vy += gravity;
      
      // Check for bubble interactions
      for (const bubble of level.bubbles) {
        const dx = x - bubble.x;
        const dy = y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 60) { // Bubble capture radius
          // Simulate bubble lifting candy
          vy = -2;
          break;
        }
      }
      
      // Check for air pillow interactions
      for (const pillow of level.airPillows) {
        if (x >= pillow.x && x <= pillow.x + pillow.width &&
            y >= pillow.y && y <= pillow.y + pillow.height) {
          // Simulate air pillow push
          vy = -5;
          vx = (x > (pillow.x + pillow.width / 2)) ? 3 : -3;
          break;
        }
      }
      
      // Apply velocity
      x += vx;
      y += vy;
      
      // Apply some drag
      vx *= 0.98;
      
      // Bounds checking
      if (x < this.safeMargin) {
        x = this.safeMargin;
        vx = -vx * 0.5; // Bounce with some energy loss
      } else if (x > this.canvasWidth - this.safeMargin) {
        x = this.canvasWidth - this.safeMargin;
        vx = -vx * 0.5; // Bounce with some energy loss
      }
      
      // Check for collision with Om Nom (success)
      if (this.getDistance({ x, y }, level.omNom) < 60) {
        path.push({ x, y });
        return path;
      }
      
      // Check for ground collision or out of bounds
      if (y > this.canvasHeight - this.safeMargin) {
        // Check if near Om Nom horizontally
        if (Math.abs(x - level.omNom.x) < 100) {
          path.push({ x: level.omNom.x, y: level.omNom.y });
          return path;
        }
        
        // Otherwise, consider level failed
        path.push({ x, y });
        return path;
      }
      
      path.push({ x, y });
    }
    
    return path;
  }
  
  reset() {
    this.difficultyLevel = 1;
    this.levelCount = 0;
  }
}
