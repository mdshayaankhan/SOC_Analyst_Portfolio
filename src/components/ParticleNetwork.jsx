import React, { useEffect, useRef } from 'react';

const ParticleNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const mouse = { x: null, y: null, radius: 150 };
    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Color definitions (Google accent colors)
    const colors = [
      'rgba(66, 133, 244, 0.65)',  // Google Blue
      'rgba(52, 168, 83, 0.65)',   // Google Green
      'rgba(251, 188, 5, 0.55)',    // Google Yellow
      'rgba(234, 67, 53, 0.45)',    // Google Red
    ];

    // Helper to calculate central column bounds
    const getClearZoneBounds = () => {
      const isSmallScreen = canvas.width < 768;
      if (isSmallScreen) return { left: -1, right: -1 };
      
      const clearZoneWidth = Math.min(canvas.width * 0.48, 620);
      const centerX = canvas.width / 2;
      return {
        left: centerX - clearZoneWidth / 2,
        right: centerX + clearZoneWidth / 2
      };
    };

    // Node class with slowed down drift speeds & central zone evasion
    class Node {
      constructor() {
        const bounds = getClearZoneBounds();
        if (bounds.left > 0 && Math.random() > 0.5) {
          // Spawn on Left gutter
          this.x = Math.random() * bounds.left;
        } else if (bounds.right > 0) {
          // Spawn on Right gutter
          this.x = bounds.right + Math.random() * (canvas.width - bounds.right);
        } else {
          this.x = Math.random() * canvas.width;
        }

        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2 + 1.5;
        this.vx = (Math.random() - 0.5) * 0.12;
        this.vy = (Math.random() - 0.5) * 0.12;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.glow = 5 + Math.random() * 8;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
      }

      draw() {
        this.size += this.pulseDir * 0.008;
        if (this.size > 3 || this.size < 1.2) {
          this.pulseDir = -this.pulseDir;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        const isLight = document.documentElement.classList.contains('light');
        if (!isLight) {
          ctx.shadowBlur = this.glow;
          ctx.shadowColor = this.color;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off canvas boundaries
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Bounce off central clear zone
        const bounds = getClearZoneBounds();
        if (bounds.left > 0 && this.x > bounds.left && this.x < bounds.right) {
          if (this.x - bounds.left < bounds.right - this.x) {
            this.x = bounds.left - 2;
            this.vx = -Math.abs(this.vx);
          } else {
            this.x = bounds.right + 2;
            this.vx = Math.abs(this.vx);
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 0.8;
            this.y -= Math.sin(angle) * force * 0.8;
          }
        }
      }
    }

    // Mathematical shape class with central zone evasion
    class MathShape {
      constructor() {
        const bounds = getClearZoneBounds();
        if (bounds.left > 0 && Math.random() > 0.5) {
          this.x = Math.random() * bounds.left;
        } else if (bounds.right > 0) {
          this.x = bounds.right + Math.random() * (canvas.width - bounds.right);
        } else {
          this.x = Math.random() * canvas.width;
        }

        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.08;
        this.vy = (Math.random() - 0.5) * 0.08;
        this.size = Math.random() * 10 + 9;
        
        const symbols = [
          '∑', 'Δ', 'π', 'θ', 'Ω', '√', '∫', '∞', 'λ', 'μ', 
          'f(x)', 'dy/dx', 'dx', 'dy', '[x]', '{y}', '01', '10', 
          'sin(x)', 'cos(θ)', '∈', '∀', '∃', '⊂', '∪', '∩',
          'y=mx+c', 'lim', 'log(n)', 'AR(p)', 'σ²', '∇'
        ];
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        
        const rand = Math.random();
        this.type = rand > 0.65 ? 'symbol' : (rand > 0.35 ? 'triangle' : 'square');
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.16 + 0.05;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.002;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const isLight = document.documentElement.classList.contains('light');
        const colorWithOpacity = this.color
          .replace('0.65', this.opacity)
          .replace('0.55', this.opacity)
          .replace('0.45', this.opacity);
        
        ctx.fillStyle = isLight ? `rgba(15, 23, 42, ${this.opacity * 0.65})` : colorWithOpacity;
        ctx.strokeStyle = isLight ? `rgba(15, 23, 42, ${this.opacity * 0.65})` : colorWithOpacity;
        ctx.lineWidth = 0.8;

        if (this.type === 'symbol') {
          ctx.font = `${this.size}px monospace`;
          ctx.fillText(this.symbol, -this.size / 2, this.size / 3);
        } else if (this.type === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.closePath();
          ctx.stroke();
        } else {
          // square
          ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }

        ctx.restore();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Bounce off central clear zone
        const bounds = getClearZoneBounds();
        if (bounds.left > 0 && this.x > bounds.left && this.x < bounds.right) {
          if (this.x - bounds.left < bounds.right - this.x) {
            this.x = bounds.left - 2;
            this.vx = -Math.abs(this.vx);
          } else {
            this.x = bounds.right + 2;
            this.vx = Math.abs(this.vx);
          }
        }

        // Wrap around boundaries
        if (this.x < -40) this.x = canvas.width + 40;
        if (this.x > canvas.width + 40) this.x = -40;
        if (this.y < -40) this.y = canvas.height + 40;
        if (this.y > canvas.height + 40) this.y = -40;
      }
    }

    class Packet {
      constructor(startNode, endNode) {
        this.start = startNode;
        this.end = endNode;
        this.progress = 0;
        this.speed = 0.005 + Math.random() * 0.007;
        this.color = Math.random() > 0.5 ? '#4285F4' : '#FBBC05';
      }

      draw() {
        this.progress += this.speed;
        if (this.progress > 1) {
          this.progress = 0;
          const temp = this.start;
          this.start = this.end;
          this.end = temp;
        }

        const x = this.start.x + (this.end.x - this.start.x) * this.progress;
        const y = this.start.y + (this.end.y - this.start.y) * this.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        const isLight = document.documentElement.classList.contains('light');
        if (!isLight) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = this.color;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const nodeCount = Math.min(85, Math.floor((canvas.width * canvas.height) / 16000));
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }

    const mathShapesCount = Math.min(35, Math.floor((canvas.width * canvas.height) / 30000));
    const mathShapes = [];
    for (let i = 0; i < mathShapesCount; i++) {
      mathShapes.push(new MathShape());
    }

    const packets = [];
    const maxConnections = 2;

    const drawGrid = () => {
      const isLight = document.documentElement.classList.contains('light');
      ctx.strokeStyle = isLight ? 'rgba(66, 133, 244, 0.05)' : 'rgba(66, 133, 244, 0.015)';
      ctx.lineWidth = 0.5;
      
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawConnections = () => {
      let activeConnections = 0;
      for (let i = 0; i < nodes.length; i++) {
        let personalConns = 0;
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 140) {
            const isLight = document.documentElement.classList.contains('light');
            const baseAlpha = isLight ? 0.22 : 0.12;
            const alpha = (1 - dist / 140) * baseAlpha;
            ctx.strokeStyle = isLight ? `rgba(15, 23, 42, ${alpha})` : `rgba(66, 133, 244, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            if (personalConns < maxConnections && activeConnections < 12 && Math.random() > 0.997) {
              packets.push(new Packet(nodes[i], nodes[j]));
              activeConnections++;
            }
            personalConns++;
          }
        }
      }
    };

    const animate = () => {
      const isLight = document.documentElement.classList.contains('light');
      ctx.fillStyle = isLight ? '#F8FAFC' : '#050816';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();

      mathShapes.forEach(shape => {
        shape.update();
        shape.draw();
      });

      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      drawConnections();

      for (let i = packets.length - 1; i >= 0; i--) {
        packets[i].draw();
        if (Math.random() > 0.999) {
          packets.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};

export default ParticleNetwork;
