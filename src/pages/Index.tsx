
import { useEffect, useRef } from 'react';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        this.directionX = (Math.random() - 0.5) * 2;
        this.directionY = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 2 + 1;
        this.color = '#33C3F0'; // Changed to single blue color
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
    const numberOfParticles = Math.min(100, (canvas.width * canvas.height) / 25000);

    for (let i = 0; i < numberOfParticles; i++) {
      particleArray.push(new Particle());
    }

    // Animation
    const animate = () => {
      if (!ctx) return;
      ctx.fillStyle = '#000000'; // Changed background to black
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

          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(51, 195, 240, ${(150 - distance) / 150 * 0.2})`; // Changed to blue with opacity
            ctx.lineWidth = 1;
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
            undersystem.net
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Index;
