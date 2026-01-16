// app/routes/api.proxy.quiz.tsx
// (maps to https://your-store.myshopify.com/apps/diamond-quiz/quiz  or similar)

import type { LoaderFunctionArgs } from 'react-router';
import { authenticate } from '../shopify.server';
import { getOrCreateQuiz } from '../models/quiz.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    let session;
    try {
        const authResult = await authenticate.public.appProxy(request);
        session = authResult.session;
    } catch (err) {
        console.error('App proxy authentication failed:', err);
        return new Response(
            JSON.stringify({ error: 'Authentication failed' }),
            {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    const url = new URL(request.url);
    const shop = session?.shop || url.searchParams.get('shop');

    if (!shop) {
        return new Response(
            JSON.stringify({ error: 'Missing shop parameter' }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    try {
        // Get or create the quiz for this shop (includes questions + options)
        const quiz = await getOrCreateQuiz();

        return new Response(
            JSON.stringify({
                success: true,
                quiz: {
                    id: quiz.id,
                    title: quiz.title,
                    subtitle: quiz.subtitle,
                    description: quiz.description,
                    ctaText: quiz.ctaText,
                    note: quiz.note,
                    image: quiz.image,
                    questions: quiz.questions.map((q) => ({
                        id: q.id,
                        order: q.order,
                        key: q.key,
                        title: q.title,
                        type: q.type,
                        description: q.description,
                        min: q.min,
                        suggestions: q.suggestions,
                        active: q.active,
                        options: q.options.map((opt) => ({
                            id: opt.id,
                            value: opt.value,
                            label: opt.label,
                            image: opt.image,
                            description: opt.description,
                            icon: opt.icon,
                            upgrade: opt.upgrade,
                            highlight: opt.highlight,
                            diamondImage: opt.diamondImage,
                            karats: opt.karats,
                            extra: opt.extra,
                            specs: opt.specs,
                        })),
                    })),
                },
                shop,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    } catch (error) {
        console.error('Failed to load quiz:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Failed to load quiz data',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
};
