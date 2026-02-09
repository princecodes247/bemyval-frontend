'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { storeValentineKey, getOwnerToken, setOwnerToken } from '@/lib/storage';
import { FloatingHearts } from '@/components/FloatingHearts';
import styles from './page.module.css';
import {
    MESSAGE_PRESETS,
    OWNERSHIP_WARNING,
    GIF_OPTIONS,
    THEME_OPTIONS,
    BUTTON_BEHAVIORS,
    type GifId,
    type ThemeId,
    type ButtonBehaviorId,
} from '@/lib/constants';

type MoodType = 'sweet' | 'funny' | 'bold';
type Step = 1 | 2;

const MOOD_OPTIONS: { value: MoodType; label: string; emoji: string }[] = [
    { value: 'sweet', label: 'Sweet', emoji: '💕' },
    { value: 'funny', label: 'Playful', emoji: '😜' },
    { value: 'bold', label: 'Bold', emoji: '🔥' },
];

// Preview button component that demonstrates selected behavior
function PreviewNoButton({ behavior }: { behavior: ButtonBehaviorId }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [clickCount, setClickCount] = useState(0);

    const handleMouseEnter = () => {
        if (behavior === 'dodge') {
            // Move to random position within container
            setPosition({
                x: (Math.random() - 0.5) * 60,
                y: (Math.random() - 0.5) * 30,
            });
        }
    };

    const handleClick = () => {
        if (behavior === 'shrink') {
            const newCount = clickCount + 1;
            setClickCount(newCount);
            setScale(Math.max(0.5, 1 - (newCount * 0.15)));
        }
    };

    const resetDemo = () => {
        setPosition({ x: 0, y: 0 });
        setScale(1);
        setClickCount(0);
    };

    return (
        <motion.span
            className={`${styles.previewNo} ${styles.previewNoInteractive}`}
            style={{
                x: position.x,
                y: position.y,
                scale,
            }}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
            onMouseLeave={resetDemo}
            whileHover={behavior === 'still' ? { scale: 0.98 } : undefined}
        >
            Maybe... 🤔
        </motion.span>
    );
}

export default function CreatePage() {
    const router = useRouter();

    // Step state
    const [step, setStep] = useState<Step>(1);

    // Step 1: Basic info
    const [recipientName, setRecipientName] = useState('');
    const [message, setMessage] = useState('');
    const [senderName, setSenderName] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

    // Step 2: Customization
    const [selectedGif, setSelectedGif] = useState<GifId>('none');
    const [selectedTheme, setSelectedTheme] = useState<ThemeId>('romantic');
    const [selectedBehavior, setSelectedBehavior] = useState<ButtonBehaviorId>('dodge');

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState<{ id: string; shareUrl: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const handleMoodSelect = (mood: MoodType) => {
        setSelectedMood(mood);
        const presets = MESSAGE_PRESETS[mood];
        if (presets && presets.length > 0) {
            // Pick a random message from the presets
            const randomIndex = Math.floor(Math.random() * presets.length);
            setMessage(presets[randomIndex]);
        }
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipientName.trim() || !message.trim()) {
            setError('Please fill in all required fields');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSubmit = async () => {
        setError('');
        setIsLoading(true);

        try {
            // Get existing owner token (if any) to link valentines
            const existingToken = getOwnerToken();

            const result = await api.createValentine({
                recipientName: recipientName.trim(),
                message: message.trim(),
                anonymous,
                senderName: senderName.trim() || undefined,
                senderEmail: senderEmail.trim() || undefined,
                theme: selectedTheme,
                gifId: selectedGif,
                buttonBehavior: selectedBehavior,
            }, existingToken || undefined);

            // Store the owner token if this is the first valentine (backend returns it)
            if (result.ownerToken) {
                setOwnerToken(result.ownerToken);
            }

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

    // Get full share URL
    const fullShareUrl = success && typeof window !== 'undefined'
        ? `${window.location.origin}${success.shareUrl}`
        : success?.shareUrl || '';

    const handleCopy = async () => {
        if (!success) return;
        await navigator.clipboard.writeText(fullShareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleViewResponses = () => {
        if (!success) return;
        router.push(`/my/${success.id}`);
    };

    const currentTheme = THEME_OPTIONS.find(t => t.id === selectedTheme);

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
                            value={fullShareUrl}
                            readOnly
                            className={styles.linkInput}
                        />
                        <motion.button
                            onClick={handleCopy}
                            className={styles.copyBtn}
                            whileTap={{ scale: 0.95 }}
                            animate={copied ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 0.2 }}
                        >
                            {copied ? '✓ Copied!' : 'Copy'}
                        </motion.button>
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
                {/* Step Indicator */}
                <div className={styles.stepIndicator}>
                    <div className={`${styles.stepDot} ${step >= 1 ? styles.stepDotActive : ''}`}>1</div>
                    <div className={styles.stepLine} />
                    <div className={`${styles.stepDot} ${step >= 2 ? styles.stepDotActive : ''}`}>2</div>
                </div>

                <header className={styles.header}>
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {step === 1 ? '💌' : '✨'}
                    </motion.div>
                    <h1 className={styles.title}>
                        {step === 1 ? 'Create Your Valentine' : 'Customize & Preview'}
                    </h1>
                    <p className={styles.subtitle}>
                        {step === 1 ? 'Make it personal, make it special' : 'Add the finishing touches'}
                    </p>
                </header>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.form
                            key="step1"
                            onSubmit={handleContinue}
                            className={styles.form}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
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

                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="senderEmail">
                                        Your email <span className={styles.optional}>(optional)</span>
                                    </label>
                                    <input
                                        id="senderEmail"
                                        type="email"
                                        className={styles.input}
                                        placeholder="Get notified when they respond 💌"
                                        value={senderEmail}
                                        onChange={(e) => setSenderEmail(e.target.value)}
                                        maxLength={100}
                                    />
                                    <p className={styles.helperText}>
                                        We&apos;ll only use this to tell you their answer. No spam.
                                    </p>
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

                            {/* Continue Button */}
                            <motion.button
                                type="submit"
                                className={styles.submit}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Continue to Preview →
                            </motion.button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="step2"
                            className={styles.step2Container}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Customization Options */}
                            <div className={styles.customization}>
                                {/* Theme Selector */}
                                <div className={styles.optionGroup}>
                                    <label className={styles.optionLabel}>Color Theme</label>
                                    <div className={styles.themeGrid}>
                                        {THEME_OPTIONS.map((theme) => (
                                            <motion.button
                                                key={theme.id}
                                                type="button"
                                                className={`${styles.themeSwatch} ${selectedTheme === theme.id ? styles.themeSwatchActive : ''}`}
                                                onClick={() => setSelectedTheme(theme.id)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                style={{
                                                    background: `linear-gradient(135deg, ${theme.id === "noir" ? theme.secondary : theme.primary} 0%, ${theme.id === "noir" ? "#0f0f1a" : theme.secondary} 100%)`,
                                                }}
                                                title={theme.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* GIF Selector */}
                                <div className={styles.optionGroup}>
                                    <label className={styles.optionLabel}>Add Animation</label>
                                    <div className={styles.gifGrid}>
                                        {GIF_OPTIONS.map((gif) => (
                                            <motion.button
                                                key={gif.id}
                                                type="button"
                                                className={`${styles.gifOption} ${selectedGif === gif.id ? styles.gifOptionActive : ''}`}
                                                onClick={() => setSelectedGif(gif.id)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span className={styles.gifPreview}>
                                                    {gif.url ? (
                                                        <img src={gif.url} alt={gif.label} className={styles.gifThumbnail} />
                                                    ) : (
                                                        '🚫'
                                                    )}
                                                </span>
                                                <span className={styles.gifLabel}>{gif.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Button Behavior Selector */}
                                <div className={styles.optionGroup}>
                                    <label className={styles.optionLabel}>&quot;No&quot; Button Style</label>
                                    <div className={styles.behaviorOptions}>
                                        {BUTTON_BEHAVIORS.map((behavior) => (
                                            <motion.button
                                                key={behavior.id}
                                                type="button"
                                                className={`${styles.behaviorOption} ${selectedBehavior === behavior.id ? styles.behaviorOptionActive : ''}`}
                                                onClick={() => setSelectedBehavior(behavior.id)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <span className={styles.behaviorEmoji}>{behavior.emoji}</span>
                                                <div className={styles.behaviorText}>
                                                    <span className={styles.behaviorLabel}>{behavior.label}</span>
                                                    <span className={styles.behaviorDesc}>{behavior.description}</span>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Live Preview */}
                            <div className={styles.previewSection}>
                                <label className={styles.optionLabel}>Preview</label>
                                <div
                                    className={styles.previewCard}
                                    style={{
                                        '--preview-primary': currentTheme?.primary,
                                        '--preview-secondary': currentTheme?.secondary,
                                        '--preview-accent': currentTheme?.accent,
                                        background: selectedTheme === 'noir'
                                            ? 'linear-gradient(180deg, #1e1e30 0%, #16162a 100%)'
                                            : 'var(--white)',
                                        borderTop: `3px solid ${currentTheme?.primary}`,
                                        boxShadow: selectedTheme === 'noir'
                                            ? `0 8px 24px rgba(249, 168, 212, 0.12), 0 4px 12px rgba(0,0,0,0.3)`
                                            : `0 8px 24px ${currentTheme?.primary}15, 0 4px 12px rgba(0,0,0,0.06)`,
                                    } as React.CSSProperties}
                                >
                                    <div
                                        className={styles.previewHeart}
                                        style={{ filter: `drop-shadow(0 2px 6px ${currentTheme?.primary}${selectedTheme === 'noir' ? '10' : '40'})` }}
                                    >
                                        💕
                                    </div>
                                    <h3
                                        className={styles.previewRecipient}
                                        style={{ color: selectedTheme === 'noir' ? '#FAF5FF' : undefined }}
                                    >
                                        {recipientName || 'Someone'},
                                    </h3>
                                    <h4 className={styles.previewQuestion}>
                                        <span style={{ color: selectedTheme === 'noir' ? '#E9D5FF' : undefined }}>
                                            Will you be my{' '}
                                        </span>
                                        <span style={{ color: currentTheme?.primary }}>Valentine</span>?
                                    </h4>
                                    <div
                                        className={styles.previewMessageBox}
                                        style={{
                                            background: selectedTheme === 'noir' ? 'rgba(255,255,255,0.06)' : currentTheme?.accent,
                                            borderLeft: `2px solid ${currentTheme?.primary}`,
                                            borderRight: `2px solid ${currentTheme?.primary}`,
                                        }}
                                    >
                                        <p className={styles.previewMessage} style={{ color: selectedTheme === 'noir' ? '#F3E8FF' : undefined }}>
                                            &ldquo;{message || 'Your message here...'}&rdquo;
                                        </p>
                                    </div>
                                    {selectedGif !== 'none' && (
                                        <div className={styles.previewGif}>
                                            <img
                                                src={GIF_OPTIONS.find(g => g.id === selectedGif)?.url || ''}
                                                alt="Selected GIF"
                                                className={styles.previewGifImage}
                                            />
                                        </div>
                                    )}
                                    <div className={styles.previewButtons}>
                                        <span
                                            className={styles.previewYes}
                                            style={{ background: selectedTheme === 'noir' ? currentTheme?.secondary : currentTheme?.primary }}
                                        >
                                            Yes! 💖
                                        </span>
                                        <PreviewNoButton behavior={selectedBehavior} />
                                    </div>
                                </div>
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

                            {/* Action Buttons */}
                            <div className={styles.step2Actions}>
                                <button
                                    type="button"
                                    className={styles.backBtn}
                                    onClick={handleBack}
                                >
                                    ← Back
                                </button>
                                <motion.button
                                    type="button"
                                    className={styles.submit}
                                    disabled={isLoading}
                                    onClick={handleSubmit}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLoading ? 'Creating...' : 'Create Valentine 💖'}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </main>
    );
}
