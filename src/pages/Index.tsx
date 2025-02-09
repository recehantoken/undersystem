
import { useEffect, useRef } from 'react';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.directionX = (Math.random() - 0.5) * 1; // Even slower movement for more stable connections
        this.directionY = (Math.random() - 0.5) * 1; // Even slower movement for more stable connections
        this.size = Math.random() * 2 + 1; // Slightly smaller particles for better performance
        this.color = '#33C3F0';
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    // Create particle array
    const particleArray: Particle[] = [];
    const numberOfParticles = Math.min(300, (canvas.width * canvas.height) / 10000); // Significantly increased particle density

    for (let i = 0; i < numberOfParticles; i++) {
      particleArray.push(new Particle());
    }

    // Animation
    const animate = () => {
      if (!ctx) return;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update particles
      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
      }

      // Draw lines between particles
      for (let i = 0; i < particleArray.length; i++) {
        for (let j = i + 1; j < particleArray.length; j++) {
          const dx = particleArray[i].x - particleArray[j].x;
          const dy = particleArray[i].y - particleArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 250) { // Increased connection distance for more connections
            ctx.beginPath();
            ctx.strokeStyle = `rgba(51, 195, 240, ${(250 - distance) / 250 * 0.4})`; // Increased line opacity
            ctx.lineWidth = 0.8; // Slightly thinner lines for better visual
            ctx.moveTo(particleArray[i].x, particleArray[i].y);
            ctx.lineTo(particleArray[j].x, particleArray[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  useEffect(() => {
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Get text position from the DOM element
    const textElement = document.getElementById('main-title');
    if (!textElement) return;

    const textRect = textElement.getBoundingClientRect();
    const text = "undersystem.net";
    const fontSize = 16;

    // Matrix characters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const drops: { x: number; y: number; char: string }[] = [];

    // Initialize drops for each character in the title
    for (let i = 0; i < text.length; i++) {
      const x = textRect.left + (i * textRect.width / text.length);
      const numDrops = 5; // Number of drops per character
      
      for (let j = 0; j < numDrops; j++) {
        drops.push({
          x: x + (Math.random() * (textRect.width / text.length)),
          y: textRect.top,
          char: characters[Math.floor(Math.random() * characters.length)]
        });
      }
    }

    const draw = () => {
      // Create gradient for fade out effect
      const gradient = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(51, 195, 240, 1)');
      gradient.addColorStop(1, 'rgba(51, 195, 240, 0)');

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      drops.forEach((drop, index) => {
        // Get random character
        drop.char = characters[Math.floor(Math.random() * characters.length)];
        
        // Apply gradient based on position
        if (drop.y > canvas.height * 0.7) {
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = '#33C3F0';
        }

        // Draw character
        ctx.fillText(drop.char, drop.x, drop.y);

        // Reset drop when it reaches bottom or randomly
        if (drop.y > canvas.height || Math.random() > 0.99) {
          const charIndex = Math.floor(index / 5);
          const x = textRect.left + (charIndex * textRect.width / text.length);
          drop.y = textRect.top;
          drop.x = x + (Math.random() * (textRect.width / text.length));
        }

        // Move drop down
        drop.y += 2;
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <canvas
        ref={matrixCanvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 
            id="main-title"
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
          >
            undersystem.net
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Index;
