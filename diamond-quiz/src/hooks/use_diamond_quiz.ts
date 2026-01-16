// hooks/useDiamondQuiz.ts
import { useState, useEffect, useCallback } from 'react';

interface QuizOption {
    id: number;
    value: string;
    label: string;
    image?: string | null;
    description?: string | null;
    icon?: string | null;
    upgrade?: boolean;
    highlight?: boolean;
    diamondImage?: string | null;
    karats?: number[] | null;
    extra?: Record<string, any> | null;
    specs?: Record<string, any> | null;
}

interface QuizQuestion {
    id: number;
    order: number;
    key: string;
    title: string;
    type: string;
    description?: string | null;
    min?: number | null;
    suggestions?: number[] | null;
    active: boolean;
    options: QuizOption[];
}

interface QuizData {
    id: number;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    ctaText?: string | null;
    note?: string | null;
    image?: string | null;
    questions: QuizQuestion[];
}

interface QuizResponse {
    success: boolean;
    quiz?: QuizData;
    shop?: string;
    error?: string;
}

interface UseDiamondQuizResult {
    quiz: QuizData | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch diamond quiz data from Shopify App Proxy
 *
 * @param shopDomain - Optional: your store domain (defaults to window.location.host)
 * @returns { quiz, loading, error, refetch }
 */
export const useDiamondQuiz = (shopDomain?: string): UseDiamondQuizResult => {
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuiz = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Use current store domain if not provided
            const domain = shopDomain || window.location.host;

            const response = await fetch(
                `https://${domain}/apps/diamond-quiz/quiz`,
                {
                    method: 'GET',
                    // credentials: 'include', // Important: keeps Shopify customer session context
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch quiz: ${response.status} ${response.statusText}`,
                );
            }

            const data: QuizResponse = await response.json();

            if (!data.success || !data.quiz) {
                throw new Error(data.error || 'Quiz data not available');
            }

            setQuiz(data.quiz);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Unknown error fetching quiz';
            setError(message);
            console.error('useDiamondQuiz error:', err);
        } finally {
            setLoading(false);
        }
    }, [shopDomain]);

    // Auto-fetch on mount
    useEffect(() => {
        fetchQuiz();
    }, [fetchQuiz]);

    return {
        quiz,
        loading,
        error,
        refetch: fetchQuiz,
    };
};
