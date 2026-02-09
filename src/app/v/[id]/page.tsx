
import { Metadata } from 'next';
import { ValentineClientPage } from './ValentineClient';
import { APP_NAME } from '@/lib/constants';

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getValentineData(id: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
        const res = await fetch(`${apiUrl}/v1/valentine/${id}`, {
            cache: 'no-store', // Always fetch fresh data
        });

        if (!res.ok) return null;

        return res.json();
    } catch (error) {
        console.error('Error fetching valentine metadata:', error);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const valentine = await getValentineData(id);

    if (!valentine) {
        return {
            title: `Valentine Not Found | ${APP_NAME}`,
            description: 'This valentine could not be found.',
        };
    }

    const title = `For ${valentine.recipientName} 💌 | ${APP_NAME}`;
    const description = valentine.senderName
        ? `${valentine.senderName} has a special question for you...`
        : 'Someone has a special question for you...';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    return <ValentineClientPage id={id} />;
}
