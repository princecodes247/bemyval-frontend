import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Val4Me - Ask Someone to Be Your Valentine 💕',
    description: 'Create a personalized, delightful valentine request and share it with someone special. No accounts, no friction, just vibes.',
    keywords: ['valentine', 'love', 'romance', 'ask out', 'be my valentine'],
    openGraph: {
        title: 'Val4Me - Ask Someone to Be Your Valentine 💕',
        description: 'Create a personalized, delightful valentine request and share it with someone special.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
