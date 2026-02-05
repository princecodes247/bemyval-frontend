'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { BUTTON_PROGRESSIONS } from '@bemyval/shared';
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

    const springX = useSpring(x, { stiffness: 300, damping: 30 });
    const springY = useSpring(y, { stiffness: 300, damping: 30 });

    const currentText = BUTTON_PROGRESSIONS[Math.min(clickCount, BUTTON_PROGRESSIONS.length - 1)];
    const scale = Math.max(0.7, 1 - clickCount * 0.08);

    const runAway = useCallback(() => {
        if (!containerRef.current || !buttonRef.current) return;

        const container = containerRef.current.getBoundingClientRect();
        const button = buttonRef.current.getBoundingClientRect();

        // Calculate available space
        const maxX = container.width - button.width - 20;
        const maxY = container.height - button.height - 20;

        // Random new position
        const newX = Math.random() * maxX - maxX / 2;
        const newY = Math.random() * maxY - maxY / 2;

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
