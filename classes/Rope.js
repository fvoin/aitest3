export class Rope {
  constructor(anchor, endPoint, segments) {
    this.segments = [];
    this.color = '#8B4513';
    this.thickness = 3;
    
    const dx = endPoint.x - anchor.x;
    const dy = endPoint.y - anchor.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const segmentLength = length / segments;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      this.segments.push({
        x: anchor.x + dx * t,
        y: anchor.y + dy * t,
        oldX: anchor.x + dx * t,
        oldY: anchor.y + dy * t,
        isAttached: true,
        segmentLength: segmentLength
      });
    }
  }
  
  update(gravity) {
    // Apply gravity and inertia to segments
    for (let i = 1; i < this.segments.length; i++) {
      if (!this.segments[i].isAttached) continue;
      
      const point = this.segments[i];
      const vx = (point.x - point.oldX) * 0.98;
      const vy = (point.y - point.oldY) * 0.98;
      
      point.oldX = point.x;
      point.oldY = point.y;
      
      point.x += vx;
      point.y += vy + gravity;
    }
    
    // Solve constraints multiple times for stability
    const iterations = 5;
    for (let j = 0; j < iterations; j++) {
      this.solveConstraints();
    }
  }
  
  solveConstraints() {
    // Fix first point to anchor
    this.segments[0].x = this.segments[0].oldX;
    this.segments[0].y = this.segments[0].oldY;
    
    // Solve distance constraints
    for (let i = 0; i < this.segments.length - 1; i++) {
      if (!this.segments[i].isAttached || !this.segments[i + 1].isAttached) continue;
      
      const pointA = this.segments[i];
      const pointB = this.segments[i + 1];
      
      const dx = pointB.x - pointA.x;
      const dy = pointB.y - pointA.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 0.01) continue;
      
      const difference = (pointA.segmentLength - distance) / distance;
      
      // Calculate the movement ratio based on position in rope
      const moveRatio = i === 0 ? 0 : 0.5;
      
      // Move points to satisfy constraint
      if (i > 0) {
        pointA.x -= dx * difference * moveRatio;
        pointA.y -= dy * difference * moveRatio;
      }
      
      pointB.x += dx * difference * (1 - moveRatio);
      pointB.y += dy * difference * (1 - moveRatio);
    }
  }
  
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.segments[0].x, this.segments[0].y);
    
    for (let i = 0; i < this.segments.length; i++) {
      if (this.segments[i].isAttached) {
        ctx.lineTo(this.segments[i].x, this.segments[i].y);
      }
    }
    
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thickness;
    ctx.stroke();
    
    // Draw anchor point
    ctx.beginPath();
    ctx.arc(this.segments[0].x, this.segments[0].y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
  }
  
  checkCut(x1, y1, x2, y2) {
    for (let i = 1; i < this.segments.length; i++) {
      if (!this.segments[i].isAttached) continue;
      
      const segment = this.segments[i];
      const prevSegment = this.segments[i - 1];
      
      if (this.lineIntersection(
        x1, y1, x2, y2,
        prevSegment.x, prevSegment.y,
        segment.x, segment.y
      )) {
        for (let j = i; j < this.segments.length; j++) {
          this.segments[j].isAttached = false;
        }
        break;
      }
    }
  }
  
  lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const tolerance = 10;
    
    function pointToLineDistance(px, py, x1, y1, x2, y2) {
      const A = px - x1;
      const B = py - y1;
      const C = x2 - x1;
      const D = y2 - y1;
      
      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      
      let param = -1;
      if (lenSq !== 0) {
        param = dot / lenSq;
      }
      
      let xx, yy;
      
      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }
      
      const dx = px - xx;
      const dy = py - yy;
      
      return Math.sqrt(dx * dx + dy * dy);
    }
    
    const d1 = pointToLineDistance(x3, y3, x1, y1, x2, y2);
    const d2 = pointToLineDistance(x4, y4, x1, y1, x2, y2);
    const d3 = pointToLineDistance(x1, y1, x3, y3, x4, y4);
    const d4 = pointToLineDistance(x2, y2, x3, y3, x4, y4);
    
    return Math.min(d1, d2, d3, d4) < tolerance;
  }
  
  isAttached() {
    return this.segments[this.segments.length - 1].isAttached;
  }
  
  getLastPoint() {
    return this.segments[this.segments.length - 1];
  }
  
  updateLastPoint(x, y) {
    const lastPoint = this.segments[this.segments.length - 1];
    lastPoint.x = x;
    lastPoint.y = y;
  }
} 