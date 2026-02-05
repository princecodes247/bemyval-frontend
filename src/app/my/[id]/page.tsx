'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ValentineResponse, PublicValentinePage } from '@/lib/types';
import { api } from '@/lib/api';
import { getValentineKey, isOwner } from '@/lib/storage';
import { FloatingHearts } from '@/components/FloatingHearts';
import { Confetti } from '@/components/Confetti';
import styles from './page.module.css';

interface PageProps {
    params: Promise<{ id: string }>;
}

type ViewState = 'loading' | 'unauthorized' | 'dashboard' | 'error';

export default function OwnerDashboard({ params }: PageProps) {
    const { id } = use(params);
    const [viewState, setViewState] = useState<ViewState>('loading');
    const [valentine, setValentine] = useState<PublicValentinePage | null>(null);
    const [responses, setResponses] = useState<ValentineResponse[]>([]);
    const [error, setError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // Check if user owns this valentine
            if (!isOwner(id)) {
                setViewState('unauthorized');
                return;
            }

            const ownerKey = getValentineKey(id);
            if (!ownerKey) {
                setViewState('unauthorized');
                return;
            }

            try {
                // Fetch valentine details and responses in parallel
                const [valentineData, responsesData] = await Promise.all([
                    api.getValentine(id).catch(() => null),
                    api.getResponses(id, ownerKey),
                ]);

                setValentine(valentineData);
                setResponses(responsesData?.responses ?? []);

                // Show confetti if there's a "yes" response
                if (responsesData.responded && responsesData.responses.some((r) => r.answer === 'yes')) {
                    setShowConfetti(true);
                }

                setViewState('dashboard');
            } catch (err: unknown) {
                const apiError = err as { message?: string; statusCode?: number };
                if (apiError.statusCode === 403 || apiError.statusCode === 401) {
                    setViewState('unauthorized');
                } else {
                    setError(apiError.message || 'Failed to load dashboard');
                    setViewState('error');
                }
            }
        };

        fetchData();
    }, [id]);

    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/v/${id}`
        : '';

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl);
    };

    // Loading
    if (viewState === 'loading') {
        return (
            <main className={styles.main}>
                <FloatingHearts />
                <motion.div
                    className={styles.loading}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    💌
                </motion.div>
            </main>
        );
    }

    // Unauthorized
    if (viewState === 'unauthorized') {
        return (
            <main className={styles.main}>
                <FloatingHearts />
                <motion.div
                    className={styles.unauthorizedCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.icon}>🔒</div>
                    <h2>Access Denied</h2>
                    <p>
                        You can only view responses on the device<br />
                        that was used to create this valentine.
                    </p>
                    <Link href="/" className="btn btn-primary">
                        Go Home
                    </Link>
                </motion.div>
            </main>
        );
    }

    // Error
    if (viewState === 'error') {
        return (
            <main className={styles.main}>
                <FloatingHearts />
                <div className={styles.errorCard}>
                    <div className={styles.icon}>😢</div>
                    <h2>Oops!</h2>
                    <p>{error}</p>
                    <Link href="/" className="btn btn-primary">
                        Go Home
                    </Link>
                </div>
            </main>
        );
    }

    const yesResponse = responses?.find((r) => r.answer === 'yes');
    const thinkingResponse = responses?.find((r) => r.answer === 'thinking');

    return (
        <main className={styles.main}>
            <Confetti active={showConfetti} />
            <FloatingHearts />

            <motion.div
                className={styles.dashboard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className={styles.title}>Your Valentine 💕</h1>

                {valentine && (
                    <div className={styles.valentineInfo}>
                        <p className={styles.infoLabel}>For:</p>
                        <p className={styles.infoValue}>{valentine.recipientName}</p>
                        <p className={styles.infoLabel}>Message:</p>
                        <p className={styles.infoMessage}>&ldquo;{valentine.message}&rdquo;</p>
                    </div>
                )}

                <div className={styles.shareSection}>
                    <p className={styles.shareLabel}>Share this link:</p>
                    <div className={styles.linkBox}>
                        <code className={styles.link}>{shareUrl}</code>
                        <button onClick={handleCopy} className={styles.copyBtn}>
                            Copy
                        </button>
                    </div>
                </div>

                <div className={styles.responseSection}>
                    <h2 className={styles.sectionTitle}>Response Status</h2>

                    {responses.length === 0 ? (
                        <div className={styles.noResponse}>
                            <div className={styles.waitingIcon}>⏳</div>
                            <p>Waiting for a response...</p>
                            <p className={styles.waitingHint}>
                                They haven&apos;t opened your valentine yet. Be patient! 💌
                            </p>
                        </div>
                    ) : yesResponse ? (
                        <motion.div
                            className={styles.yesResponse}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <div className={styles.yesIcon}>💖</div>
                            <h3>They said YES!</h3>
                            <p>
                                Answered on{' '}
                                {new Date(yesResponse.respondedAt).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </motion.div>
                    ) : thinkingResponse ? (
                        <div className={styles.thinkingResponse}>
                            <div className={styles.thinkingIcon}>🤔</div>
                            <h3>They need time to think</h3>
                            <p>
                                They&apos;re considering it! Give them some time 💕
                            </p>
                        </div>
                    ) : null}
                </div>

                <div className={styles.actions}>
                    <Link href="/create" className="btn btn-secondary">
                        Create Another
                    </Link>
                    <Link href="/" className="btn btn-ghost">
                        Go Home
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
