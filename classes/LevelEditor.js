import { LEVELS } from './Levels.js';

export class LevelEditor {
  constructor(game) {
    this.game = game;
    this.isVisible = false;
    this.selectedElement = null;
    this.selectedElementType = null;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.currentLevel = null;
    this.editedLevel = null;
    this.editModeActive = false;
    
    // Define the tool panel dimensions
    this.toolPanelWidth = 160;
    this.toolPanelHeight = 480; // Increased height for Select tool
    this.toolPanelX = 20;
    this.toolPanelY = 100;
    
    // Define tool buttons
    this.toolButtons = [
      { name: 'select', label: 'Select & Move', x: this.toolPanelX + 10, y: this.toolPanelY + 60, width: 140, height: 30 },
      { name: 'anchor', label: 'Add Anchor', x: this.toolPanelX + 10, y: this.toolPanelY + 100, width: 140, height: 30 },
      { name: 'star', label: 'Add Star', x: this.toolPanelX + 10, y: this.toolPanelY + 140, width: 140, height: 30 },
      { name: 'bubble', label: 'Add Bubble', x: this.toolPanelX + 10, y: this.toolPanelY + 180, width: 140, height: 30 },
      { name: 'airpillow', label: 'Add Air Pillow', x: this.toolPanelX + 10, y: this.toolPanelY + 220, width: 140, height: 30 },
      { name: 'omnom', label: 'Move OmNom', x: this.toolPanelX + 10, y: this.toolPanelY + 260, width: 140, height: 30 },
      { name: 'candy', label: 'Move Candy', x: this.toolPanelX + 10, y: this.toolPanelY + 300, width: 140, height: 30 },
      { name: 'delete', label: 'Delete Element', x: this.toolPanelX + 10, y: this.toolPanelY + 340, width: 140, height: 30 },
      { name: 'save', label: 'Save & Play', x: this.toolPanelX + 10, y: this.toolPanelY + 380, width: 140, height: 30 },
      { name: 'cancel', label: 'Cancel', x: this.toolPanelX + 10, y: this.toolPanelY + 420, width: 140, height: 30 }
    ];
  }
  
  show() {
    this.isVisible = true;
    this.editModeActive = true;
    
    // Clone the current level for editing
    this.currentLevel = LEVELS[this.game.currentLevel - 1];
    
    // Make sure we have a valid level
    if (!this.currentLevel) {
      console.error('Current level is not valid:', this.game.currentLevel);
      // Try to restore from the original levels (not user-modified ones)
      try {
        const originalLevels = JSON.parse(localStorage.getItem('originalLevels'));
        if (originalLevels && originalLevels[this.game.currentLevel - 1]) {
          this.currentLevel = originalLevels[this.game.currentLevel - 1];
        } else {
          // Fallback to level 1 if we can't restore
          this.game.currentLevel = 1;
          this.currentLevel = LEVELS[0];
        }
      } catch (e) {
        console.error('Failed to restore original level:', e);
        // Reset to level 1 as a last resort
        this.game.currentLevel = 1;
        this.currentLevel = LEVELS[0];
      }
    }
    
    // Save original levels if we haven't already
    if (!localStorage.getItem('originalLevels')) {
      localStorage.setItem('originalLevels', JSON.stringify(LEVELS));
    }
    
    this.editedLevel = JSON.parse(JSON.stringify(this.currentLevel));
    
    // Set game state to editor
    this.game.previousGameState = this.game.gameState;
    this.game.gameState = 'editor';
    
    // Reset game trace and flags if reset method exists
    if (this.game.trace && typeof this.game.trace.reset === 'function') {
      this.game.trace.reset();
    } else {
      // Fallback: create a new trace with empty points if reset doesn't exist
      this.game.trace.points = [];
      this.game.trace.isActive = false;
      if (this.game.trace.opacity !== undefined) {
        this.game.trace.opacity = this.game.trace.maxOpacity || 0.6;
      }
    }
    
    this.isDragging = false;
    this.selectedElement = null;
    this.selectedElementType = null;
  }
  
  hide() {
    this.isVisible = false;
    this.editModeActive = false;
    this.selectedElement = null;
    this.selectedElementType = null;
    
    // Restore previous game state
    this.game.gameState = this.game.previousGameState || 'playing';
  }
  
  update() {
    // No animation logic needed for now
  }
  
  draw(ctx) {
    if (!this.isVisible) return;
    
    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    
    // Draw tool panel
    this.drawToolPanel(ctx);
    
    // Draw selection highlight
    if (this.selectedElement && this.selectedElementType) {
      this.drawSelectionHighlight(ctx);
    }
  }
  
  drawToolPanel(ctx) {
    // Draw panel background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    
    // Rounded rectangle for panel
    ctx.beginPath();
    ctx.roundRect(
      this.toolPanelX, 
      this.toolPanelY, 
      this.toolPanelWidth, 
      this.toolPanelHeight, 
      10
    );
    ctx.fill();
    ctx.stroke();
    
    // Draw panel title
    ctx.fillStyle = '#2196F3';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      'LEVEL EDITOR', 
      this.toolPanelX + this.toolPanelWidth / 2, 
      this.toolPanelY + 30
    );
    
    // Draw tool buttons
    this.toolButtons.forEach(button => {
      // Button background
      const isSelected = this.selectedElementType === button.name;
      ctx.fillStyle = isSelected ? '#2196F3' : '#E0E0E0';
      ctx.strokeStyle = '#2196F3';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.roundRect(button.x, button.y, button.width, button.height, 5);
      ctx.fill();
      ctx.stroke();
      
      // Button text
      ctx.fillStyle = isSelected ? 'white' : 'black';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(button.label, button.x + button.width / 2, button.y + button.height / 2);
    });
  }
  
  drawSelectionHighlight(ctx) {
    if (!this.selectedElement) return;
    
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    
    let centerX = 0;
    let centerY = 0;
    let labelText = '';
    
    if (this.selectedElementType === 'anchor' || this.selectedElementType === 'select') {
      // Determine which type of element is selected (for select tool)
      const elementType = this.findElementType(this.selectedElement);
      labelText = elementType ? elementType.charAt(0).toUpperCase() + elementType.slice(1) : 'Anchor';
      
      centerX = this.selectedElement.x;
      centerY = this.selectedElement.y;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.selectedElementType === 'star') {
      labelText = 'Star';
      centerX = this.selectedElement.x;
      centerY = this.selectedElement.y;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.selectedElementType === 'bubble') {
      labelText = 'Bubble';
      centerX = this.selectedElement.x;
      centerY = this.selectedElement.y;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.selectedElementType === 'airpillow') {
      labelText = 'Air Pillow';
      centerX = this.selectedElement.x + this.selectedElement.width / 2;
      centerY = this.selectedElement.y + this.selectedElement.height / 2;
      
      ctx.beginPath();
      ctx.rect(
        this.selectedElement.x, 
        this.selectedElement.y, 
        this.selectedElement.width, 
        this.selectedElement.height
      );
      ctx.stroke();
    } else if (this.selectedElementType === 'omnom') {
      labelText = 'OmNom';
      centerX = this.selectedElement.x;
      centerY = this.selectedElement.y;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.selectedElementType === 'candy') {
      labelText = 'Candy';
      centerX = this.selectedElement.x;
      centerY = this.selectedElement.y;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw label text above the element
    if (labelText) {
      ctx.setLineDash([]); // Reset line dash
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(centerX - 40, centerY - 45, 80, 25);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, centerX, centerY - 32);
    }
    
    ctx.setLineDash([]);
  }
  
  findElementType(element) {
    // Check if this element is the OmNom
    if (element === this.editedLevel.omNom) {
      return 'omnom';
    }
    
    // Check if this element is the candy
    if (element === this.editedLevel.candy) {
      return 'candy';
    }
    
    // Check anchors
    for (const anchor of this.editedLevel.anchors) {
      if (anchor === element) {
        return 'anchor';
      }
    }
    
    // Check stars
    for (const star of this.editedLevel.stars) {
      if (star === element) {
        return 'star';
      }
    }
    
    // Check bubbles
    if (this.editedLevel.bubbles) {
      for (const bubble of this.editedLevel.bubbles) {
        if (bubble === element) {
          return 'bubble';
        }
      }
    }
    
    // Check air pillows
    if (this.editedLevel.airPillows) {
      for (const pillow of this.editedLevel.airPillows) {
        if (pillow === element) {
          return 'airpillow';
        }
      }
    }
    
    return null;
  }
  
  handleClick(x, y) {
    if (!this.isVisible) return false;
    
    // Always check if clicked on a tool button first, even if an element is selected
    for (const button of this.toolButtons) {
      if (
        x >= button.x && 
        x <= button.x + button.width && 
        y >= button.y && 
        y <= button.y + button.height
      ) {
        if (button.name === 'save') {
          this.saveAndPlayLevel();
        } else if (button.name === 'cancel') {
          this.cancelEdit();
        } else {
          this.selectedElementType = button.name;
          this.selectedElement = null; // Clear any currently selected element
        }
        return true;
      }
    }
    
    // If a tool is selected, handle the interaction
    if (this.selectedElementType) {
      // Special handling for select tool
      if (this.selectedElementType === 'select') {
        // Find any element at this position and select it
        const elementInfo = this.findElementAt(x, y);
        if (elementInfo) {
          this.selectedElement = elementInfo.element;
        } else {
          this.selectedElement = null;
        }
        return true;
      }
      
      // If we already have a selected element, clicking elsewhere should deselect it
      // unless we're in delete mode which needs to keep working
      if (this.selectedElement && this.selectedElementType !== 'delete') {
        this.selectedElement = null;
        return true;
      }
      
      if (this.selectedElementType === 'anchor') {
        if (!this.selectedElement) {
          // Add new anchor
          const newAnchor = { x, y };
          this.editedLevel.anchors.push(newAnchor);
          this.selectedElement = newAnchor;
        }
      } else if (this.selectedElementType === 'star') {
        if (!this.selectedElement) {
          // Add new star
          const newStar = { x, y };
          this.editedLevel.stars.push(newStar);
          this.selectedElement = newStar;
        }
      } else if (this.selectedElementType === 'bubble') {
        if (!this.selectedElement) {
          // Add new bubble
          const newBubble = { x, y };
          if (!this.editedLevel.bubbles) this.editedLevel.bubbles = [];
          this.editedLevel.bubbles.push(newBubble);
          this.selectedElement = newBubble;
        }
      } else if (this.selectedElementType === 'airpillow') {
        if (!this.selectedElement) {
          // Add new air pillow
          const newPillow = { x, y, width: 100, height: 30 };
          if (!this.editedLevel.airPillows) this.editedLevel.airPillows = [];
          this.editedLevel.airPillows.push(newPillow);
          this.selectedElement = newPillow;
        }
      } else if (this.selectedElementType === 'omnom') {
        // Move OmNom
        this.editedLevel.omNom.x = x;
        this.editedLevel.omNom.y = y;
        this.selectedElement = this.editedLevel.omNom;
      } else if (this.selectedElementType === 'candy') {
        // Move candy
        this.editedLevel.candy.x = x;
        this.editedLevel.candy.y = y;
        this.selectedElement = this.editedLevel.candy;
      } else if (this.selectedElementType === 'delete') {
        // Find and delete closest element
        this.deleteElementAt(x, y);
      }
      
      // Apply changes temporarily
      this.applyTemporaryChanges();
      return true;
    }
    
    return false;
  }
  
  handleMouseDown(x, y) {
    if (!this.isVisible) return false;
    
    // If select tool is active and no element is selected, try to find one
    if (this.selectedElementType === 'select' && !this.selectedElement) {
      const elementInfo = this.findElementAt(x, y);
      if (elementInfo) {
        this.selectedElement = elementInfo.element;
      }
    }
    
    if (this.selectedElement) {
      this.isDragging = true;
      this.dragStartX = x;
      this.dragStartY = y;
      this.dragOffsetX = this.selectedElement.x - x;
      this.dragOffsetY = this.selectedElement.y - y;
      return true;
    }
    
    return false;
  }
  
  handleMouseMove(x, y) {
    if (!this.isVisible || !this.isDragging || !this.selectedElement) return false;
    
    // Update element position
    this.selectedElement.x = x + this.dragOffsetX;
    this.selectedElement.y = y + this.dragOffsetY;
    
    // Apply changes temporarily
    this.applyTemporaryChanges();
    return true;
  }
  
  handleMouseUp() {
    this.isDragging = false;
    
    // Check if we were dragging an element but not moving it much (short distance)
    // This could indicate the user wants to deselect it
    if (this.selectedElement) {
      const distX = Math.abs(this.dragStartX - (this.selectedElement.x - this.dragOffsetX));
      const distY = Math.abs(this.dragStartY - (this.selectedElement.y - this.dragOffsetY));
      
      // If the element was barely moved, it might be a click to deselect
      if (distX < 5 && distY < 5) {
        // Small movement considered a click rather than a drag
        this.selectedElement = null;
      }
    }
    
    return this.isVisible;
  }
  
  applyTemporaryChanges() {
    // Update the game elements to reflect edited level
    this.game.initTemporaryLevel(this.editedLevel);
  }
  
  deleteElementAt(x, y) {
    // Find the closest element to the click point
    let closestType = null;
    let closestElement = null;
    let closestDistance = 30; // Threshold for deletion
    
    // Check anchors
    this.editedLevel.anchors.forEach((anchor, index) => {
      const distance = Math.sqrt(Math.pow(anchor.x - x, 2) + Math.pow(anchor.y - y, 2));
      if (distance < closestDistance) {
        closestDistance = distance;
        closestType = 'anchors';
        closestElement = index;
      }
    });
    
    // Check stars
    this.editedLevel.stars.forEach((star, index) => {
      const distance = Math.sqrt(Math.pow(star.x - x, 2) + Math.pow(star.y - y, 2));
      if (distance < closestDistance) {
        closestDistance = distance;
        closestType = 'stars';
        closestElement = index;
      }
    });
    
    // Check bubbles
    if (this.editedLevel.bubbles) {
      this.editedLevel.bubbles.forEach((bubble, index) => {
        const distance = Math.sqrt(Math.pow(bubble.x - x, 2) + Math.pow(bubble.y - y, 2));
        if (distance < closestDistance) {
          closestDistance = distance;
          closestType = 'bubbles';
          closestElement = index;
        }
      });
    }
    
    // Check air pillows
    if (this.editedLevel.airPillows) {
      this.editedLevel.airPillows.forEach((pillow, index) => {
        // Check if click is inside the pillow
        if (
          x >= pillow.x && 
          x <= pillow.x + pillow.width && 
          y >= pillow.y && 
          y <= pillow.y + pillow.height
        ) {
          closestType = 'airPillows';
          closestElement = index;
        }
      });
    }
    
    // Delete the closest element
    if (closestType && closestElement !== null) {
      this.editedLevel[closestType].splice(closestElement, 1);
      this.selectedElement = null;
    }
  }
  
  resetGameState() {
    // Reset all editor state
    this.isVisible = false;
    this.editModeActive = false;
    this.selectedElement = null;
    this.selectedElementType = null;
    this.isDragging = false;
    
    // Reset game state
    this.game.gameState = 'playing';
    
    // Clear the trace safely
    if (this.game.trace && typeof this.game.trace.reset === 'function') {
      this.game.trace.reset();
    } else if (this.game.trace) {
      // Fallback: create a new trace with empty points if reset doesn't exist
      this.game.trace.points = [];
      this.game.trace.isActive = false;
      if (this.game.trace.opacity !== undefined) {
        this.game.trace.opacity = this.game.trace.maxOpacity || 0.6;
      }
    }
    
    // Reset flags for rope cutting
    this.game.isCutting = false;
  }
  
  saveAndPlayLevel() {
    try {
      // Create a temporary level with the edited configuration
      const customLevel = JSON.parse(JSON.stringify(this.editedLevel));
      
      // Validate that the level has all required components
      if (!customLevel.stars || !customLevel.anchors || !customLevel.candy || !customLevel.omNom) {
        console.error('Invalid level data - missing required components');
        alert('Level data is invalid. Changes will not be saved.');
        this.cancelEdit();
        return;
      }
      
      // Add it to the LEVELS array (replacing the current level)
      LEVELS[this.game.currentLevel - 1] = customLevel;
      
      // Save to localStorage for persistence
      localStorage.setItem(`customLevel_${this.game.currentLevel}`, JSON.stringify(customLevel));
      
      // Print formatted level code to console for easy copying
      this.exportLevelCode(customLevel);
      
      console.log('Exiting editor mode with saved changes');
      
      // Reset all game state completely
      this.resetGameState();
      
      // Re-initialize the level properly WITHOUT using our modified level data during transition
      // This ensures a clean state for the physics engine
      this.game.initLevel();
    } catch (error) {
      console.error('Error saving level:', error);
      alert('An error occurred while saving. Changes will not be applied.');
      this.cancelEdit();
    }
  }
  
  // Export level code to console in a format that can be pasted into Levels.js
  exportLevelCode(level) {
    // Format the level data with proper indentation and spacing
    const formattedLevel = JSON.stringify(level, null, 2)
      .replace(/"([^"]+)":/g, '$1:') // Remove quotes from property names
      .replace(/"/g, "'"); // Replace double quotes with single quotes for easier copy-paste
    
    // Create the code block with a copy-paste message
    const levelCode = `
// ============================================================
// COPY THE CODE BELOW TO ADD TO YOUR LEVELS.JS FILE
// ============================================================

{
  id: ${level.id},
  name: "${level.name}",
  anchors: ${JSON.stringify(level.anchors, null, 2)
    .replace(/"([^"]+)":/g, '$1:')},
  candy: ${JSON.stringify(level.candy, null, 2)
    .replace(/"([^"]+)":/g, '$1:')},
  stars: ${JSON.stringify(level.stars, null, 2)
    .replace(/"([^"]+)":/g, '$1:')},
${level.bubbles ? `  bubbles: ${JSON.stringify(level.bubbles, null, 2)
    .replace(/"([^"]+)":/g, '$1:')},` : ''}
${level.airPillows ? `  airPillows: ${JSON.stringify(level.airPillows, null, 2)
    .replace(/"([^"]+)":/g, '$1:')},` : ''}
  omNom: ${JSON.stringify(level.omNom, null, 2)
    .replace(/"([^"]+)":/g, '$1:')},
  ropeSegments: ${level.ropeSegments || 10},
  description: "${level.description || 'Custom level created in editor'}"
}

// ============================================================
// END OF LEVEL CODE
// ============================================================
`;
    
    // Log the formatted code to the console
    console.log('%c🎮 Level Code Generated! Copy this to add to your Levels.js file:', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    console.log(levelCode);
  }
  
  cancelEdit() {
    console.log('Canceling edit and returning to original level');
    
    // Reset all game state completely
    this.resetGameState();
    
    // Re-initialize with the original level
    this.game.initLevel();
  }
  
  findElementAt(x, y) {
    // Check for elements at the given position
    const hitDistance = 15; // Distance threshold for hit detection
    
    // Check OmNom
    const omNomDist = Math.sqrt(
      Math.pow(this.editedLevel.omNom.x - x, 2) + 
      Math.pow(this.editedLevel.omNom.y - y, 2)
    );
    if (omNomDist < 30) {
      return { type: 'omnom', element: this.editedLevel.omNom };
    }
    
    // Check candy
    const candyDist = Math.sqrt(
      Math.pow(this.editedLevel.candy.x - x, 2) + 
      Math.pow(this.editedLevel.candy.y - y, 2)
    );
    if (candyDist < 20) {
      return { type: 'candy', element: this.editedLevel.candy };
    }
    
    // Check anchors
    for (const anchor of this.editedLevel.anchors) {
      const dist = Math.sqrt(Math.pow(anchor.x - x, 2) + Math.pow(anchor.y - y, 2));
      if (dist < hitDistance) {
        return { type: 'anchor', element: anchor };
      }
    }
    
    // Check stars
    for (const star of this.editedLevel.stars) {
      const dist = Math.sqrt(Math.pow(star.x - x, 2) + Math.pow(star.y - y, 2));
      if (dist < 20) {
        return { type: 'star', element: star };
      }
    }
    
    // Check bubbles
    if (this.editedLevel.bubbles) {
      for (const bubble of this.editedLevel.bubbles) {
        const dist = Math.sqrt(Math.pow(bubble.x - x, 2) + Math.pow(bubble.y - y, 2));
        if (dist < 25) {
          return { type: 'bubble', element: bubble };
        }
      }
    }
    
    // Check air pillows
    if (this.editedLevel.airPillows) {
      for (const pillow of this.editedLevel.airPillows) {
        if (
          x >= pillow.x && 
          x <= pillow.x + pillow.width && 
          y >= pillow.y && 
          y <= pillow.y + pillow.height
        ) {
          return { type: 'airpillow', element: pillow };
        }
      }
    }
    
    return null;
  }
} 