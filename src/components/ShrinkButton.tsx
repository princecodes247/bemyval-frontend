'use client';

import { useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { BUTTON_PROGRESSIONS } from '@/lib/constants';
import styles from './ShrinkButton.module.css';

interface ShrinkButtonProps {
    onGiveUp: () => void;
}

export function ShrinkButton({ onGiveUp }: ShrinkButtonProps) {
    const [clickCount, setClickCount] = useState(0);
    const scale = useSpring(1, { stiffness: 400, damping: 25 });

    const handleClick = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);

        // Shrink with each click
        const newScale = Math.max(0.3, 1 - (newCount * 0.15));
        scale.set(newScale);

        // After enough clicks, give up
        if (newCount >= BUTTON_PROGRESSIONS.length) {
            onGiveUp();
        }
    };

    const buttonText = BUTTON_PROGRESSIONS[Math.min(clickCount, BUTTON_PROGRESSIONS.length - 1)];

    return (
        <div className={styles.container}>
            <motion.button
                className={styles.button}
                style={{ scale }}
                onClick={handleClick}
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: scale.get() * 0.95 }}
            >
                {buttonText}
            </motion.button>
        </div>
    );
}
