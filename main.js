import { Game } from './classes/game.js';

// Add error handling and detailed logging
console.log('[Main] Script loading...');

// Global error handler
window.addEventListener('error', (event) => {
  console.error('[ERROR] Uncaught error:', event.error);
  
  // Try to show error on screen
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.marginTop = '20px';
    errorDiv.style.maxWidth = '80%';
    errorDiv.style.textAlign = 'center';
    errorDiv.innerHTML = `<strong>Error loading game:</strong><br>${event.message}<br><em>Check console for details</em>`;
    loadingEl.appendChild(errorDiv);
  }
});

// Create and initialize the game when the page loads
window.addEventListener('load', () => {
  console.log('[Main] Window loaded, creating game instance...');
  
  try {
    console.log('[Main] About to create Game instance');
    const game = new Game();
    console.log('[Main] Game instance created');
    
    // Check if the Game was constructed properly
    if (!game) {
      throw new Error('Game instance is null');
    }
    
    if (!game.init) {
      throw new Error('Game.init method is missing');
    }
    
    console.log('[Main] About to call game.init()');
    game.init();
    console.log('[Main] Game initialized successfully');
  } catch (error) {
    console.error('[Main] Error during game initialization:', error);
    
    // Try to show the error on screen
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      const errorDiv = document.createElement('div');
      errorDiv.style.color = 'red';
      errorDiv.style.marginTop = '20px';
      errorDiv.style.maxWidth = '80%';
      errorDiv.style.textAlign = 'center';
      errorDiv.innerHTML = `<strong>Error initializing game:</strong><br>${error.message}<br><em>Check console for details</em>`;
      loadingEl.appendChild(errorDiv);
    }
  }
}); 