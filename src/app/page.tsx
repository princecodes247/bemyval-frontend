'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingHearts } from '@/components/FloatingHearts';
import { getOwnerToken } from '@/lib/storage';
import { api, type MyValentine } from '@/lib/api';
import styles from './page.module.css';

export default function HomePage() {
    const [valentines, setValentines] = useState<MyValentine[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchValentines = async () => {
            const token = getOwnerToken();
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const result = await api.getMyValentines(token);
                setValentines(result.valentines);
            } catch {
                // Silently fail - user just won't see the button
            } finally {
                setIsLoading(false);
            }
        };

        fetchValentines();
    }, []);

    return (
        <main className={styles.main}>
            <FloatingHearts />

            <div className={styles.gradientBg} />

            <motion.div
                className={styles.content}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
                <motion.div
                    className={styles.heartIcon}
                    animate={{
                        y: [0, -8, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                    💕
                </motion.div>

                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Val<span className={styles.highlight}>4</span>Me
                </motion.h1>

                <motion.p
                    className={styles.tagline}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Create a personalized valentine request
                    <br />
                    and share it with someone special
                </motion.p>

                <motion.div
                    className={styles.ctaGroup}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Link href="/create" className={styles.cta}>
                        Create Your Valentine 💌
                    </Link>

                    <AnimatePresence>
                        {!isLoading && valentines.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <Link
                                    href={`/my/${valentines[0].id}`}
                                    className={styles.viewValentinesBtn}
                                >
                                    View My Valentines
                                    <span className={styles.valentineCount}>
                                        {valentines.length}
                                    </span>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.p
                    className={styles.note}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    No accounts. No friction. Just vibes.
                </motion.p>
            </motion.div>

            <motion.footer
                className={styles.footer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                <p>Made with 💖 for Valentine&apos;s Day 2026</p>
            </motion.footer>
        </main>
    );
}

