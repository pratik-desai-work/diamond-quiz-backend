// app/routes/app.quiz.tsx

import { useAppBridge } from '@shopify/app-bridge-react';
import { addOptionToQuestion, getOrCreateQuiz, updateQuestion } from 'app/models/quiz.server';
import { authenticate } from 'app/shopify.server';
import { useLoaderData } from 'react-router';

export async function loader({ request , params }: any) {
  const { admin } = await authenticate.admin(request);

  if (params.id === "new") {
    return {
      destination: "product",
      title: "",
    };
  }

  return await getOrCreateQuiz('demo-shop.myshopify.com');
}

export async function action({ request }: any) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "update-question") {
    await updateQuestion(Number(formData.get("questionId")), {
      title: String(formData.get("title")),
      description: String(formData.get("description") || ""),
    });
  }

  if (intent === "add-option") {
    await addOptionToQuestion(Number(formData.get("questionId")), {
      label: String(formData.get("label")),
      value: String(formData.get("value")),
    });
  }

  return null;
}

export default function QuizDashboard() {
  const app = useAppBridge();
  const quiz = useLoaderData();

  if (!quiz) {
    return (
      <s-page heading="Diamond Quiz Builder">
        <s-section>
          <s-banner tone="warning" >
            <s-text>Default quiz not initialized yet.</s-text>
          </s-banner>
        </s-section>
      </s-page>
    );
  }

  return (
    <s-page
      heading="Diamond Quiz Builder"
    >
      <s-section heading={`Store: ${quiz.shop}`} >
        <s-box>
          <s-box >
            <s-heading >Questions ({quiz.questions.length})</s-heading>

            <s-box >
              {quiz.questions.map((q: any) => (
                <s-list-item key={q.id}>
                  <s-stack  >
                    <s-stack >
                      <s-text >
                        {q.title}
                      </s-text>
                      <s-badge >
                        {q.type}
                      </s-badge>
                      <s-badge >{q.key}</s-badge>
                    </s-stack>

                    {q.options?.length > 0 && (
                      <s-badge tone="success">{q.options.length} options</s-badge>
                    )}
                  </s-stack>

                  {q.description && (
                    <s-text  >
                      {q.description}
                    </s-text>
                  )}
                </s-list-item>
              ))}
            </s-box>

            <s-box >
              <s-button variant="primary">Add New Question</s-button>
            </s-box>
          </s-box>
        </s-box>
      </s-section>

      {/* Optional quick stats section */}
      <s-section heading="Quick Overview">
        <s-grid >
          <s-box>
            <s-box>
              <s-stack>
                <s-heading >Select Questions</s-heading>
                <s-text >
                  {quiz.questions.filter((q: any) => q.type === 'select').length}
                </s-text>
              </s-stack>
            </s-box>
          </s-box>
          {/* Add more cards as needed */}
        </s-grid>
      </s-section>
    </s-page>
  );
}