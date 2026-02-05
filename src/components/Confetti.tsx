'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
    scale: number;
    opacity: number;
    color: string;
}

const COLORS = ['#FF6B9D', '#FF8FB5', '#FFD93D', '#C44569', '#FF69B4'];

export function Confetti({ active }: { active: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>();

    const createParticles = useCallback(() => {
        const particles: Particle[] = [];
        const canvas = canvasRef.current;
        if (!canvas) return particles;

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: -20 - Math.random() * 100,
                vx: (Math.random() - 0.5) * 8,
                vy: Math.random() * 3 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                scale: Math.random() * 0.5 + 0.5,
                opacity: 1,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            });
        }

        return particles;
    }, []);

    const drawHeart = useCallback((
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        color: string,
        rotation: number,
        opacity: number
    ) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(size, size);
        ctx.globalAlpha = opacity;

        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.bezierCurveTo(-10, -15, -20, 0, 0, 15);
        ctx.bezierCurveTo(20, 0, 10, -15, 0, -5);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.restore();
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let activeParticles = 0;

        particlesRef.current.forEach((particle) => {
            if (particle.opacity <= 0) return;

            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // Gravity
            particle.rotation += particle.rotationSpeed;

            // Fade out when near bottom
            if (particle.y > canvas.height - 100) {
                particle.opacity -= 0.02;
            }

            if (particle.opacity > 0) {
                drawHeart(
                    ctx,
                    particle.x,
                    particle.y,
                    particle.scale,
                    particle.color,
                    particle.rotation,
                    particle.opacity
                );
                activeParticles++;
            }
        });

        if (activeParticles > 0) {
            animationRef.current = requestAnimationFrame(animate);
        }
    }, [drawHeart]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (active) {
            particlesRef.current = createParticles();
            animate();
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [active, createParticles, animate]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 100,
            }}
        />
    );
}
