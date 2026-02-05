'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { storeValentineKey } from '@/lib/storage';
import { FloatingHearts } from '@/components/FloatingHearts';
import styles from './page.module.css';
import { MESSAGE_PRESETS, OWNERSHIP_WARNING } from '@/lib/constants';

type PresetCategory = keyof typeof MESSAGE_PRESETS;

export default function CreatePage() {
    const router = useRouter();
    const [recipientName, setRecipientName] = useState('');
    const [message, setMessage] = useState('');
    const [senderName, setSenderName] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState<{ id: string; shareUrl: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const handlePresetClick = (text: string) => {
        setMessage(text);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await api.createValentine({
                recipientName: recipientName.trim(),
                message: message.trim(),
                anonymous,
                senderName: senderName.trim() || undefined,
            });

            // Store the owner key
            storeValentineKey(result.id, result.ownerKey);

            setSuccess({
                id: result.id,
                shareUrl: result.shareUrl,
            });
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!success) return;
        await navigator.clipboard.writeText(success.shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleViewResponses = () => {
        if (!success) return;
        router.push(`/my/${success.id}`);
    };

    if (success) {
        return (
            <main className={styles.main}>
                <FloatingHearts />
                <motion.div
                    className={styles.successCard}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.successIcon}>🎉</div>
                    <h2 className={styles.successTitle}>Your Valentine is Ready!</h2>
                    <p className={styles.successText}>
                        Share this link with your special someone:
                    </p>

                    <div className={styles.linkBox}>
                        <code className={styles.link}>{success.shareUrl}</code>
                        <button onClick={handleCopy} className={styles.copyBtn}>
                            {copied ? '✓ Copied!' : 'Copy'}
                        </button>
                    </div>

                    <div className={styles.warning}>
                        <span className={styles.warningIcon}>⚠️</span>
                        <p>{OWNERSHIP_WARNING}</p>
                    </div>

                    <div className={styles.actions}>
                        <button onClick={handleViewResponses} className="btn btn-primary">
                            View Responses 💌
                        </button>
                        <button onClick={() => setSuccess(null)} className="btn btn-secondary">
                            Create Another
                        </button>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <FloatingHearts />

            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className={styles.title}>Create Your Valentine 💕</h1>
                <p className={styles.subtitle}>
                    Fill in the details to create a personalized valentine request
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label className="label" htmlFor="recipientName">
                            Their Name <span className={styles.required}>*</span>
                        </label>
                        <input
                            id="recipientName"
                            type="text"
                            className="input"
                            placeholder="Who is this for?"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            required
                            maxLength={50}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className="label" htmlFor="message">
                            Your Message <span className={styles.required}>*</span>
                        </label>
                        <textarea
                            id="message"
                            className="input textarea"
                            placeholder="Write something from the heart..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            maxLength={500}
                        />
                        <div className={styles.charCount}>
                            {message.length}/500
                        </div>
                    </div>

                    <div className={styles.presets}>
                        <p className={styles.presetsLabel}>Need inspiration?</p>
                        <div className={styles.presetTabs}>
                            {(Object.keys(MESSAGE_PRESETS) as PresetCategory[]).map((category) => (
                                <div key={category} className={styles.presetCategory}>
                                    <span className={styles.categoryLabel}>
                                        {category === 'sweet' ? '💕 Sweet' : category === 'funny' ? '😂 Funny' : '🔥 Bold'}
                                    </span>
                                    <div className={styles.presetButtons}>
                                        {MESSAGE_PRESETS[category].slice(0, 3).map((preset, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                className={styles.presetBtn}
                                                onClick={() => handlePresetClick(preset)}
                                            >
                                                {preset}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className="label" htmlFor="senderName">
                            Your Name <span className={styles.optional}>(optional)</span>
                        </label>
                        <input
                            id="senderName"
                            type="text"
                            className="input"
                            placeholder="Who is this from?"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            maxLength={50}
                            disabled={anonymous}
                        />
                    </div>

                    <div className={styles.toggle}>
                        <label className={styles.toggleLabel}>
                            <input
                                type="checkbox"
                                checked={anonymous}
                                onChange={(e) => setAnonymous(e.target.checked)}
                            />
                            <span className={styles.toggleSlider}></span>
                            <span className={styles.toggleText}>
                                Send anonymously 🎭
                                <small>Your name will be revealed only after they say Yes!</small>
                            </span>
                        </label>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className={styles.error}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        className={`btn btn-primary btn-lg ${styles.submit}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Valentine 💌'}
                    </button>
                </form>
            </motion.div>
        </main>
    );
}
