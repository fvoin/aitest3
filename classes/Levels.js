export const LEVELS = [
  // Level 1: Simple introduction - one rope, direct drop to Om Nom
  {
    id: 1,
    name: "First Steps",
    anchors: [
    {
      x: 398,
      y: 55
    }
  ],
    candy: {
    x: 401,
    y: 191
  },
    stars: [
    {
      x: 400,
      y: 350
    },
    {
      x: 399,
      y: 428.5
    },
    {
      x: 400,
      y: 274.5
    }
  ],
  
  
    omNom: {
    x: 400,
    y: 500
  },
    ropeSegments: 8,
    description: "Cut the rope to drop the candy into Om Nom's mouth!"
  },
  
  // Level 2: Two stars, still simple concept
  {
      id: 2,
      name: "Swing & Float",
      anchors: [
      {
        x: 148,
        y: 92
      },
      {
        x: 409,
        y: 100
      },
      {
        x: 591,
        y: 104.5
      }
    ],
      candy: {
      x: 200,
      y: 250
    },
      stars: [
      {
        x: 253,
        y: 318
      },
      {
        x: 555,
        y: 529
      },
      {
        x: 468,
        y: 344
      }
    ],
      bubbles: [],
    
      omNom: {
      x: 616,
      y: 515.5
    },
      ropeSegments: 10,
      description: "Swing, cut, float, and pop your way to Om Nom!"
  },
  
  // Level 3: Introducing two ropes in a simple configuration
  {
    id: 3,
    name: "Double Trouble",
    anchors: [
    {
      x: 329,
      y: 99
    },
    {
      x: 600,
      y: 104
    }
  ],
    candy: {
    x: 453,
    y: 252
  },
    stars: [
    {
      x: 338,
      y: 170
    },
    {
      x: 449,
      y: 407
    },
    {
      x: 458,
      y: 321
    }
  ],
    bubbles: [
    {
      x: 347,
      y: 403.5
    },
    {
      x: 342,
      y: 252.5
    }
  ],
    airPillows: [
    {
      x: 176,
      y: 321.5,
      width: 100,
      height: 30
    }
  ],
    omNom: {
    x: 446,
    y: 506
  },
    ropeSegments: 8,
    description: "Cut the ropes in the right order to collect all stars!"
  }
]; 