import { authenticate } from 'app/shopify.server';
import { LoaderFunctionArgs } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { liquid } = await authenticate.public.appProxy(request);

    return liquid(`
    <link rel="stylesheet" href="/api/diamond-quiz/index.css" />
    <div id="diamond-quiz-root"></div>
    <script type="module" src="/api/diamond-quiz/index.js"></script>
  `);
};
