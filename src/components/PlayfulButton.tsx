'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { BUTTON_PROGRESSIONS } from '@/lib/constants';
import styles from './PlayfulButton.module.css';

interface PlayfulButtonProps {
    onGiveUp: () => void;
}

export function PlayfulButton({ onGiveUp }: PlayfulButtonProps) {
    const [clickCount, setClickCount] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mousePos = useRef({ x: 0, y: 0 });

    // Smoother spring for fluid motion
    const springX = useSpring(x, { stiffness: 400, damping: 35 });
    const springY = useSpring(y, { stiffness: 400, damping: 35 });

    const currentText = BUTTON_PROGRESSIONS[Math.min(clickCount, BUTTON_PROGRESSIONS.length - 1)];
    const scale = Math.max(0.7, 1 - clickCount * 0.08);

    // Track mouse position globally
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const runAway = useCallback(() => {
        if (!containerRef.current || !buttonRef.current) return;

        const container = containerRef.current.getBoundingClientRect();
        const button = buttonRef.current.getBoundingClientRect();

        // Get button center in viewport coordinates
        const buttonCenterX = button.left + button.width / 2;
        const buttonCenterY = button.top + button.height / 2;

        // Calculate direction away from mouse
        const dx = buttonCenterX - mousePos.current.x;
        const dy = buttonCenterY - mousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalize direction (or use random if mouse is on button)
        let dirX = distance > 0 ? dx / distance : (Math.random() - 0.5) * 2;
        let dirY = distance > 0 ? dy / distance : (Math.random() - 0.5) * 2;

        // Add some randomness to direction (±30 degrees)
        const angle = Math.atan2(dirY, dirX) + (Math.random() - 0.5) * 0.5;
        dirX = Math.cos(angle);
        dirY = Math.sin(angle);

        // Calculate movement distance (at least 150px, scales with container)
        const moveDistance = Math.max(150, Math.min(container.width, container.height) * 0.4);

        // Calculate available bounds (relative to container center)
        const maxX = (container.width - button.width) / 2 - 10;
        const maxY = (container.height - button.height) / 2 - 10;

        // Calculate new position
        let newX = x.get() + dirX * moveDistance;
        let newY = y.get() + dirY * moveDistance;

        // Bounce off boundaries
        if (Math.abs(newX) > maxX) {
            newX = Math.sign(newX) * -maxX * 0.7;
        }
        if (Math.abs(newY) > maxY) {
            newY = Math.sign(newY) * -maxY * 0.7;
        }

        // Clamp to bounds
        newX = Math.max(-maxX, Math.min(maxX, newX));
        newY = Math.max(-maxY, Math.min(maxY, newY));

        x.set(newX);
        y.set(newY);
    }, [x, y]);

    const handleClick = useCallback(() => {
        if (clickCount >= BUTTON_PROGRESSIONS.length - 1) {
            onGiveUp();
            return;
        }

        setClickCount((prev) => prev + 1);
        setIsRunning(true);
        runAway();

        setTimeout(() => setIsRunning(false), 300);
    }, [clickCount, onGiveUp, runAway]);

    const handleMouseEnter = useCallback(() => {
        // Always run away when mouse enters (after first click)
        if (clickCount > 0 && clickCount < BUTTON_PROGRESSIONS.length - 1) {
            runAway();
        }
    }, [clickCount, runAway]);

    // Reset position when component mounts
    useEffect(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <div ref={containerRef} className={styles.container}>
            <motion.button
                ref={buttonRef}
                className={styles.button}
                style={{
                    x: springX,
                    y: springY,
                    scale,
                }}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                whileTap={{ scale: scale * 0.95 }}
                animate={{
                    rotate: isRunning ? [0, -5, 5, 0] : 0,
                }}
                transition={{
                    rotate: { duration: 0.3 },
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.span
                        key={clickCount}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {currentText}
                    </motion.span>
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
