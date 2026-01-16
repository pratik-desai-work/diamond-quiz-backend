export type QuizStep =
    | 'settingStyle'
    | 'metal'
    | 'origin'
    | 'shape'
    | 'budget'
    | 'priority';

export interface QuizData {
    intro: {
        owner: string;
        title: string;
        subtitle: string;
        description: string;
        ctaText: string;
        note: string;
        image: string;
    };

    redirect: {
        url: string;
        paramMap: Record<string, string>;
    };

    steps: QuizStep[];

    questions: Record<string, any>;
}
