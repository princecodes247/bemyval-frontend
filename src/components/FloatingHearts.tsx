'use client';

import { useEffect, useRef } from 'react';
import styles from './FloatingHearts.module.css';

interface Heart {
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    wobble: number;
    wobbleSpeed: number;
}

export function FloatingHearts() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const heartsRef = useRef<Heart[]>([]);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        // Create initial hearts
        const createHearts = () => {
            const hearts: Heart[] = [];
            for (let i = 0; i < 20; i++) {
                hearts.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 15 + 10,
                    speed: Math.random() * 0.5 + 0.2,
                    opacity: Math.random() * 0.15 + 0.05,
                    wobble: Math.random() * Math.PI * 2,
                    wobbleSpeed: Math.random() * 0.02 + 0.01,
                });
            }
            return hearts;
        };

        heartsRef.current = createHearts();

        const drawHeart = (x: number, y: number, size: number, opacity: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(size / 20, size / 20);
            ctx.globalAlpha = opacity;

            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.bezierCurveTo(-10, -15, -20, 0, 0, 15);
            ctx.bezierCurveTo(20, 0, 10, -15, 0, -5);
            ctx.fillStyle = '#FF6B9D';
            ctx.fill();

            ctx.restore();
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            heartsRef.current.forEach((heart) => {
                heart.y -= heart.speed;
                heart.wobble += heart.wobbleSpeed;
                heart.x += Math.sin(heart.wobble) * 0.5;

                if (heart.y < -30) {
                    heart.y = canvas.height + 30;
                    heart.x = Math.random() * canvas.width;
                }

                drawHeart(heart.x, heart.y, heart.size, heart.opacity);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}
