'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { YES_MESSAGES, EXPIRED_MESSAGE } from '../../../lib/constants';
import type { PublicValentinePage } from '../../../lib/types';
import { api } from '../../../lib/api';
import { FloatingHearts } from '@/components/FloatingHearts';
import { PlayfulButton } from '@/components/PlayfulButton';
import { Confetti } from '@/components/Confetti';
import styles from './page.module.css';

interface PageProps {
    params: Promise<{ id: string }>;
}

type ViewState = 'loading' | 'valentine' | 'yes' | 'thinking' | 'expired' | 'error' | 'already_responded';

export default function ValentinePage({ params }: PageProps) {
    const { id } = use(params);
    const [viewState, setViewState] = useState<ViewState>('loading');
    const [valentine, setValentine] = useState<PublicValentinePage | null>(null);
    const [error, setError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const [yesMessage, setYesMessage] = useState('');

    useEffect(() => {
        const fetchValentine = async () => {
            try {
                const data = await api.getValentine(id);
                setValentine(data);

                if (data.hasResponded) {
                    setViewState('already_responded');
                } else {
                    setViewState('valentine');
                }
            } catch (err: unknown) {
                const apiError = err as { statusCode?: number; message?: string };
                if (apiError.statusCode === 410) {
                    setViewState('expired');
                } else {
                    setError(apiError.message || 'Failed to load valentine');
                    setViewState('error');
                }
            }
        };

        fetchValentine();
    }, [id]);

    const handleYes = async () => {
        try {
            await api.submitResponse(id, { answer: 'yes' });
            setYesMessage(YES_MESSAGES[Math.floor(Math.random() * YES_MESSAGES.length)]);
            setShowConfetti(true);
            setViewState('yes');
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || 'Something went wrong');
        }
    };

    const handleThinking = async () => {
        try {
            await api.submitResponse(id, { answer: 'thinking' });
            setViewState('thinking');
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || 'Something went wrong');
        }
    };

    // Loading state
    if (viewState === 'loading') {
        return (
            <main className={styles.main}>
                <FloatingHearts />
                <motion.div
                    className={styles.loading}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    💕
                </motion.div>
            </main>
        );
    }

    // Error state
    if (viewState === 'error') {
        return (
            <main className={styles.main}>
                <FloatingHearts />
                <div className={styles.errorCard}>
                    <div className={styles.errorIcon}>😢</div>
                    <h2>Oops!</h2>
                    <p>{error}</p>
                </div>
            </main>
        );
    }

    // Expired state
    if (viewState === 'expired') {
        return (
            <main className={styles.main}>
                <FloatingHearts />
                <motion.div
                    className={styles.expiredCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.expiredIcon}>💌</div>
                    <h2>{EXPIRED_MESSAGE}</h2>
                    <p>But love is always in the air! 💕</p>
                </motion.div>
            </main>
        );
    }

    // Already responded state
    if (viewState === 'already_responded') {
        return (
            <main className={styles.main}>
                <FloatingHearts />
                <motion.div
                    className={styles.respondedCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.respondedIcon}>💝</div>
                    <h2>Already Answered!</h2>
                    <p>This valentine has already received a response 💕</p>
                </motion.div>
            </main>
        );
    }

    // Yes celebration state
    if (viewState === 'yes') {
        return (
            <main className={styles.main}>
                <Confetti active={showConfetti} />
                <FloatingHearts />
                <motion.div
                    className={styles.celebrationCard}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                >
                    <motion.div
                        className={styles.celebrationIcon}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    >
                        💖
                    </motion.div>
                    <h2 className={styles.celebrationTitle}>YES!</h2>
                    <p className={styles.celebrationText}>{yesMessage}</p>

                    {valentine?.anonymous && valentine?.senderName && (
                        <motion.div
                            className={styles.reveal}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                        >
                            <p>This was from:</p>
                            <h3>{valentine.senderName}</h3>
                        </motion.div>
                    )}
                </motion.div>
            </main>
        );
    }

    // Thinking state
    if (viewState === 'thinking') {
        return (
            <main className={styles.main}>
                <FloatingHearts />
                <motion.div
                    className={styles.thinkingCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.thinkingIcon}>🤔</div>
                    <h2>Taking Your Time...</h2>
                    <p>
                        That&apos;s okay! They&apos;ll know you need a moment.<br />
                        No pressure, love can wait 💕
                    </p>
                </motion.div>
            </main>
        );
    }

    // Main valentine view
    return (
        <main className={styles.main}>
            <FloatingHearts />
            <Confetti active={showConfetti} />

            <div className={styles.glow} />

            <motion.div
                className={styles.valentineCard}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <motion.div
                    className={styles.decorativeHeart}
                    animate={{
                        y: [0, -10, 0],
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
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <span className={styles.recipientName}>{valentine?.recipientName}</span>,
                </motion.h1>

                <motion.h2
                    className={styles.question}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    Will you be my <span className="gradient-text">Valentine</span>?
                </motion.h2>

                <motion.div
                    className={styles.messageBox}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <p className={styles.message}>&ldquo;{valentine?.message}&rdquo;</p>
                    {!valentine?.anonymous && valentine?.senderName && (
                        <p className={styles.sender}>— {valentine.senderName}</p>
                    )}
                    {valentine?.anonymous && (
                        <p className={styles.anonymousBadge}>From: Your Secret Admirer 🎭</p>
                    )}
                </motion.div>

                <motion.div
                    className={styles.buttons}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <button
                        onClick={handleYes}
                        className={`btn btn-primary btn-lg ${styles.yesBtn}`}
                    >
                        Yes! 💖
                    </button>

                    <PlayfulButton onGiveUp={handleThinking} />
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            className={styles.inlineError}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </main>
    );
}
