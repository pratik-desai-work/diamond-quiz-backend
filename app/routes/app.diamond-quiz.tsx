// app/routes/api.proxy.tsx
import { authenticate } from 'app/shopify.server';
import type { LoaderFunctionArgs } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // App Proxy auth (same as quiz)
    const { liquid } = await authenticate.public.appProxy(request);

    return liquid(`
      <link rel="stylesheet" href="/diamond-quiz/index.css" />
      <div id="diamond-quiz-root"></div>
      <script type="module" src="/diamond-quiz/index.js"></script>
  `);
};
