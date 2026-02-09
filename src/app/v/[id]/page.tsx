'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { YES_MESSAGES, EXPIRED_MESSAGE, THEME_OPTIONS, GIF_OPTIONS } from '../../../lib/constants';
import type { PublicValentinePage } from '../../../lib/types';
import { api } from '../../../lib/api';
import { FloatingHearts } from '@/components/FloatingHearts';
import { PlayfulButton } from '@/components/PlayfulButton';
import { ShrinkButton } from '@/components/ShrinkButton';
import { Confetti } from '@/components/Confetti';
import styles from './page.module.css';

interface PageProps {
    params: Promise<{ id: string }>;
}

type ViewState = 'loading' | 'valentine' | 'yes' | 'thinking' | 'expired' | 'error' | 'already_responded';

// Get theme by ID with fallback
const getTheme = (themeId: string) => {
    return THEME_OPTIONS.find(t => t.id === themeId) || THEME_OPTIONS[0];
};

// Get GIF URL by ID
const getGifUrl = (gifId: string) => {
    const gif = GIF_OPTIONS.find(g => g.id === gifId);
    return gif?.url || null;
};

export default function ValentinePage({ params }: PageProps) {
    const { id } = use(params);
    const [viewState, setViewState] = useState<ViewState>('loading');
    const [valentine, setValentine] = useState<PublicValentinePage | null>(null);
    const [error, setError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const [yesMessage, setYesMessage] = useState('');
    const [revealedSender, setRevealedSender] = useState<string | null>(null);

    // Get theme colors from valentine data
    const theme = valentine ? getTheme(valentine.theme) : THEME_OPTIONS[0];
    const gifUrl = valentine?.gifId ? getGifUrl(valentine.gifId) : null;

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
            const response = await api.submitResponse(id, { answer: 'yes' });
            setYesMessage(YES_MESSAGES[Math.floor(Math.random() * YES_MESSAGES.length)]);
            setShowConfetti(true);

            // If anonymous, the response will include the revealed sender name
            if (response.senderName) {
                setRevealedSender(response.senderName);
            }

            setViewState('yes');
        } catch (err: unknown) {
            const apiError = err as { error?: string };
            console.log({ err, apiError })
            // Handle already responded error specifically
            if (apiError.error?.includes('Already responded')) {
                setViewState('already_responded');
            } else {
                setError(apiError.error || 'Something went wrong');
            }
        }
    };

    const handleThinking = async () => {
        try {
            await api.submitResponse(id, { answer: 'thinking' });
            setViewState('thinking');
        } catch (err: unknown) {
            const apiError = err as { error?: string };
            // Handle already responded error specifically
            if (apiError.error?.includes('Already responded')) {
                setViewState('already_responded');
            } else {
                setError(apiError.error || 'Something went wrong');
            }
        }
    };

    // CSS custom properties for theme
    const themeStyles = {
        '--theme-primary': theme.primary,
        '--theme-secondary': theme.secondary,
    } as React.CSSProperties;

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
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
                >
                    <motion.div
                        className={styles.respondedIcon}
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        💝
                    </motion.div>
                    <h2>Love Already Found! 💕</h2>
                    <p className={styles.respondedMessage}>
                        This valentine has already been answered!<br />
                        <span className={styles.respondedHint}>
                            Looks like someone beat you to it... or maybe it was you? 😉
                        </span>
                    </p>
                    <motion.div
                        className={styles.respondedEmojis}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        ✨ 💖 ✨
                    </motion.div>
                </motion.div>
            </main>
        );
    }

    // Yes celebration state
    if (viewState === 'yes') {
        return (
            <main className={styles.main} style={themeStyles}>
                <Confetti active={showConfetti} />
                <FloatingHearts />
                <motion.div
                    className={styles.celebrationCard}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    style={{ boxShadow: `0 16px 48px ${theme.primary}40` }}
                >
                    <motion.div
                        className={styles.celebrationIcon}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    >
                        💖
                    </motion.div>
                    <h2 className={styles.celebrationTitle} style={{
                        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>YES!</h2>
                    <p className={styles.celebrationText}>{yesMessage}</p>

                    {revealedSender && (
                        <motion.div
                            className={styles.reveal}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                        >
                            <p>This was from:</p>
                            <h3 style={{ color: theme.primary }}>{revealedSender}</h3>
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

    // Render the "No" button based on behavior
    const renderNoButton = () => {
        const behavior = valentine?.buttonBehavior || 'dodge';

        switch (behavior) {
            case 'shrink':
                return <ShrinkButton onGiveUp={handleThinking} />;
            case 'still':
                return (
                    <button
                        onClick={handleThinking}
                        className={styles.stillBtn}
                    >
                        Let me think... 🤔
                    </button>
                );
            case 'dodge':
            default:
                return <PlayfulButton onGiveUp={handleThinking} />;
        }
    };

    // Main valentine view
    return (
        <main className={styles.main} style={themeStyles}>
            <FloatingHearts />
            <Confetti active={showConfetti} />

            <div
                className={styles.glow}
                style={{ background: `radial-gradient(ellipse at center, ${theme.primary}25 0%, transparent 70%)` }}
            />

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
                    Will you be my <span style={{ color: theme.primary }}>Valentine</span>?
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
                        <p className={styles.anonymousBadge} style={{ color: theme.primary }}>
                            From: Your Secret Admirer 🎭
                        </p>
                    )}
                </motion.div>

                {/* GIF decoration */}
                {gifUrl && (
                    <motion.div
                        className={styles.gifDecoration}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            src={gifUrl}
                            alt="Valentine animation"
                            className={styles.gifImage}
                        />
                    </motion.div>
                )}

                <motion.div
                    className={styles.buttons}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <button
                        onClick={handleYes}
                        className={`btn btn-primary btn-lg ${styles.yesBtn}`}
                        style={{ background: theme.primary }}
                    >
                        Yes! 💖
                    </button>

                    {renderNoButton()}
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
