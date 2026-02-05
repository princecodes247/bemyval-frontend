'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FloatingHearts } from '@/components/FloatingHearts';
import styles from './page.module.css';

export default function HomePage() {
    return (
        <main className={styles.main}>
            <FloatingHearts />

            <div className={styles.glow} />

            <motion.div
                className={styles.content}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <motion.div
                    className={styles.heart}
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    💕
                </motion.div>

                <h1 className={styles.title}>
                    <span className="gradient-text">Val4Me</span>
                </h1>

                <p className={styles.subtitle}>
                    Create a personalized valentine request<br />
                    and share it with someone special
                </p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <Link href="/create" className={`btn btn-primary btn-lg ${styles.cta}`}>
                        Create Your Valentine 💌
                    </Link>
                </motion.div>

                <motion.p
                    className={styles.note}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    No accounts. No friction. Just vibes.
                </motion.p>
            </motion.div>

            <motion.footer
                className={styles.footer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
            >
                <p>Made with 💖 for Valentine&apos;s Day 2026</p>
            </motion.footer>
        </main>
    );
}
