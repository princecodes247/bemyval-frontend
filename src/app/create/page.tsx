'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { storeValentineKey } from '@/lib/storage';
import { FloatingHearts } from '@/components/FloatingHearts';
import styles from './page.module.css';
import { MESSAGE_PRESETS, OWNERSHIP_WARNING } from '@/lib/constants';

type MoodType = 'sweet' | 'funny' | 'bold';

const MOOD_OPTIONS: { value: MoodType; label: string; emoji: string }[] = [
    { value: 'sweet', label: 'Sweet', emoji: '💕' },
    { value: 'funny', label: 'Playful', emoji: '😜' },
    { value: 'bold', label: 'Bold', emoji: '🔥' },
];

export default function CreatePage() {
    const router = useRouter();
    const [recipientName, setRecipientName] = useState('');
    const [message, setMessage] = useState('');
    const [senderName, setSenderName] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState<{ id: string; shareUrl: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const handleMoodSelect = (mood: MoodType) => {
        setSelectedMood(mood);
        const presets = MESSAGE_PRESETS[mood];
        if (presets && presets.length > 0) {
            setMessage(presets[0]);
        }
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

    // Success state
    if (success) {
        return (
            <main className={styles.main}>
                <FloatingHearts />
                <motion.div
                    className={styles.successCard}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
                >
                    <motion.div
                        className={styles.successIcon}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: 2 }}
                    >
                        🎉
                    </motion.div>
                    <h2 className={styles.successTitle}>You&apos;re all set!</h2>
                    <p className={styles.successText}>
                        Share this link with your special someone
                    </p>

                    <div className={styles.linkBox}>
                        <input
                            type="text"
                            value={success.shareUrl}
                            readOnly
                            className={styles.linkInput}
                        />
                        <button onClick={handleCopy} className={styles.copyBtn}>
                            {copied ? '✓ Copied!' : 'Copy'}
                        </button>
                    </div>

                    <div className={styles.notice}>
                        <span className={styles.noticeIcon}>💡</span>
                        <p>{OWNERSHIP_WARNING}</p>
                    </div>

                    <div className={styles.actions}>
                        <button onClick={handleViewResponses} className="btn btn-primary">
                            View Responses
                        </button>
                        <button onClick={() => setSuccess(null)} className={styles.createAnotherBtn}>
                            Create another
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
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            >
                <header className={styles.header}>
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        💌
                    </motion.div>
                    <h1 className={styles.title}>Create Your Valentine</h1>
                    <p className={styles.subtitle}>
                        Make it personal, make it special
                    </p>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Recipient Name */}
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="recipientName">
                            Who is this for? 💕
                        </label>
                        <input
                            id="recipientName"
                            type="text"
                            className={styles.input}
                            placeholder="Their name"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            required
                            maxLength={50}
                        />
                    </div>

                    {/* Mood Selector */}
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Need inspiration?
                        </label>
                        <div className={styles.moodSelector}>
                            {MOOD_OPTIONS.map((mood) => (
                                <motion.button
                                    key={mood.value}
                                    type="button"
                                    className={`${styles.moodPill} ${selectedMood === mood.value ? styles.moodPillActive : ''}`}
                                    onClick={() => handleMoodSelect(mood.value)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span>{mood.emoji}</span>
                                    {mood.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Message */}
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="message">
                            Your message
                        </label>
                        <div className={styles.textareaWrapper}>
                            <textarea
                                id="message"
                                className={styles.textarea}
                                placeholder="Write something from the heart..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                maxLength={500}
                            />
                            <span className={styles.charCount}>{message.length}/500</span>
                        </div>
                    </div>

                    {/* Sender Section */}
                    <div className={styles.senderSection}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="senderName">
                                Your name <span className={styles.optional}>(optional)</span>
                            </label>
                            <input
                                id="senderName"
                                type="text"
                                className={styles.input}
                                placeholder="Who is this from?"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                                maxLength={50}
                                disabled={anonymous}
                            />
                        </div>

                        <label className={styles.toggle}>
                            <input
                                type="checkbox"
                                checked={anonymous}
                                onChange={(e) => setAnonymous(e.target.checked)}
                            />
                            <span className={styles.toggleTrack}>
                                <span className={styles.toggleThumb} />
                            </span>
                            <div className={styles.toggleText}>
                                <span className={styles.toggleLabel}>Send anonymously 🎭</span>
                                <span className={styles.toggleHint}>Revealed only after they say yes</span>
                            </div>
                        </label>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className={styles.error}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        className={styles.submit}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? 'Creating...' : 'Create Valentine 💖'}
                    </motion.button>
                </form>
            </motion.div>
        </main>
    );
}
