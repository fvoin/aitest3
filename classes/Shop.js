export class Shop {
  constructor(game) {
    this.game = game;
    this.visible = false;
    this.selectedCategory = 'candies';
    
    // Shop categories
    this.categories = [
      { id: 'candies', name: 'Candies', icon: '🍬' },
      { id: 'power-ups', name: 'Power-Ups', icon: '⚡' }
    ];
    
    // Shop items organized by category
    this.items = {
      'candies': [
        { id: 'candy-red', name: 'Red Sugar Drop', price: 50, description: 'Sweet red candy that attracts stars', icon: '🔴' },
        { id: 'candy-blue', name: 'Blue Berry Blast', price: 60, description: 'Bounces higher than regular candy', icon: '🔵' },
        { id: 'candy-green', name: 'Lime Twist', price: 70, description: 'Falls slower through the air', icon: '🟢' },
        { id: 'candy-yellow', name: 'Lemon Surprise', price: 80, description: 'Has a chance to spawn extra stars', icon: '🟡' },
        { id: 'candy-purple', name: 'Grape Delight', price: 90, description: 'Attracts bubbles from farther away', icon: '🟣' }
      ],
      'power-ups': [
        { id: 'power-magnet', name: 'Star Magnet', price: 100, description: 'Pulls nearby stars toward candy', icon: '🧲' },
        { id: 'power-shield', name: 'Bubble Shield', price: 120, description: 'Protects candy from first fall', icon: '🛡️' },
        { id: 'power-time', name: 'Time Slowdown', price: 150, description: 'Slows game physics for better control', icon: '⏱️' },
        { id: 'power-cut', name: 'Auto Cutter', price: 200, description: 'Automatically cuts dangerous ropes', icon: '✂️' },
        { id: 'power-revive', name: 'Second Chance', price: 250, description: 'Revives candy once per level', icon: '💫' }
      ]
    };
    
    // Player's purchased items
    this.purchasedItems = this.loadPurchasedItems();
  }
  
  loadPurchasedItems() {
    const savedItems = localStorage.getItem('sliceTheRope_purchasedItems');
    return savedItems ? JSON.parse(savedItems) : [];
  }
  
  savePurchasedItems() {
    localStorage.setItem('sliceTheRope_purchasedItems', JSON.stringify(this.purchasedItems));
  }
  
  show() {
    this.visible = true;
  }
  
  hide() {
    this.visible = false;
  }
  
  selectCategory(categoryId) {
    if (this.categories.some(category => category.id === categoryId)) {
      this.selectedCategory = categoryId;
      return true;
    }
    return false;
  }
  
  buyItem(itemId) {
    // Find the item in any category
    let foundItem = null;
    let categoryId = null;
    
    for (const [catId, items] of Object.entries(this.items)) {
      const item = items.find(item => item.id === itemId);
      if (item) {
        foundItem = item;
        categoryId = catId;
        break;
      }
    }
    
    if (!foundItem) {
      console.error(`Item not found: ${itemId}`);
      return false;
    }
    
    // Check if player already owns this item
    if (this.purchasedItems.includes(itemId)) {
      console.log(`Player already owns item: ${itemId}`);
      return false;
    }
    
    // Check if player has enough coins
    if (this.game.totalStars * 100 < foundItem.price) {
      console.log(`Not enough coins to buy ${itemId}`);
      return false;
    }
    
    // Purchase the item
    this.game.totalStars -= foundItem.price / 100; // Convert from coins to stars
    this.purchasedItems.push(itemId);
    this.savePurchasedItems();
    
    console.log(`Purchased item: ${itemId}`);
    return true;
  }
  
  useItem(itemId) {
    // Check if player owns this item
    if (!this.purchasedItems.includes(itemId)) {
      console.log(`Player does not own item: ${itemId}`);
      return false;
    }
    
    // Apply item effects
    console.log(`Using item: ${itemId}`);
    
    // Specific item effects would be implemented here
    switch (itemId) {
      case 'power-magnet':
        // Implement star magnet effect
        break;
      case 'power-shield':
        // Implement bubble shield effect
        break;
      // Add more cases for other items
    }
    
    return true;
  }
  
  update() {
    // Update animations or any other shop logic
  }
  
  draw(ctx) {
    if (!this.visible) return;
    
    // Draw semi-transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw shop title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SHOP', ctx.canvas.width / 2, 50);
    
    // Draw player's coins
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Coins: ${this.game.totalStars * 100}`, ctx.canvas.width - 30, 30);
    
    // Draw categories
    this.drawCategories(ctx);
    
    // Draw items for selected category
    this.drawItems(ctx);
    
    // Draw back button
    ctx.fillStyle = '#FF5555';
    ctx.fillRect(30, 30, 80, 40);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Back', 70, 55);
  }
  
  drawCategories(ctx) {
    const tabWidth = ctx.canvas.width / this.categories.length;
    const tabHeight = 60;
    const tabY = 80;
    
    ctx.font = '22px Arial';
    ctx.textAlign = 'center';
    
    this.categories.forEach((category, index) => {
      const tabX = index * tabWidth;
      
      // Draw tab background
      ctx.fillStyle = category.id === this.selectedCategory ? '#4CAF50' : '#555555';
      ctx.fillRect(tabX, tabY, tabWidth, tabHeight);
      
      // Draw tab text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`${category.icon} ${category.name}`, tabX + tabWidth / 2, tabY + 38);
    });
  }
  
  drawItems(ctx) {
    const items = this.items[this.selectedCategory] || [];
    const itemsPerRow = 2;
    const itemWidth = 350;
    const itemHeight = 100;
    const startX = (ctx.canvas.width - (itemWidth * itemsPerRow + 20)) / 2;
    const startY = 160;
    
    items.forEach((item, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      
      const x = startX + col * (itemWidth + 20);
      const y = startY + row * (itemHeight + 15);
      
      // Item background
      const isOwned = this.purchasedItems.includes(item.id);
      const canAfford = this.game.totalStars * 100 >= item.price;
      
      if (isOwned) {
        ctx.fillStyle = '#4CAF50'; // Green for owned items
      } else if (canAfford) {
        ctx.fillStyle = '#3F51B5'; // Blue for affordable items
      } else {
        ctx.fillStyle = '#555555'; // Grey for unaffordable items
      }
      
      ctx.fillRect(x, y, itemWidth, itemHeight);
      
      // Item name and icon
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '22px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${item.icon} ${item.name}`, x + 15, y + 30);
      
      // Item price
      ctx.font = '18px Arial';
      if (isOwned) {
        ctx.fillText('Owned', x + 15, y + 60);
      } else {
        ctx.fillText(`${item.price} coins`, x + 15, y + 60);
      }
      
      // Item description
      ctx.font = '14px Arial';
      ctx.fillText(item.description, x + 15, y + 85);
    });
  }
  
  handleClick(x, y) {
    // Check if back button was clicked
    if (x >= 30 && x <= 110 && y >= 30 && y <= 70) {
      this.hide();
      this.game.hideShop(); // Call the game's hideShop method to properly restore the game state
      return true;
    }
    
    // Check if a category tab was clicked
    const tabWidth = this.game.canvas.width / this.categories.length;
    const tabHeight = 60;
    const tabY = 80;
    
    if (y >= tabY && y <= tabY + tabHeight) {
      const categoryIndex = Math.floor(x / tabWidth);
      if (categoryIndex >= 0 && categoryIndex < this.categories.length) {
        this.selectCategory(this.categories[categoryIndex].id);
        return true;
      }
    }
    
    // Check if an item was clicked
    const items = this.items[this.selectedCategory] || [];
    const itemsPerRow = 2;
    const itemWidth = 350;
    const itemHeight = 100;
    const startX = (this.game.canvas.width - (itemWidth * itemsPerRow + 20)) / 2;
    const startY = 160;
    
    for (let index = 0; index < items.length; index++) {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      
      const itemX = startX + col * (itemWidth + 20);
      const itemY = startY + row * (itemHeight + 15);
      
      if (x >= itemX && x <= itemX + itemWidth && y >= itemY && y <= itemY + itemHeight) {
        const item = items[index];
        
        // If not owned, try to buy the item
        if (!this.purchasedItems.includes(item.id)) {
          this.buyItem(item.id);
        } else {
          // If already owned, select it for use
          this.useItem(item.id);
        }
        
        return true;
      }
    }
    
    return false;
  }
}
