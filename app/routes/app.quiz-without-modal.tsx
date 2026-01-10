// app/routes/app.quiz.tsx

import { useEffect, useState } from 'react';
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
    <s-page heading="Diamond Quiz Builder">
      <s-section heading={`Store: ${quiz.shop}`}>
        {quiz.questions.map((q: any) => (
          <s-box key={q.id} >
            {/* UPDATE QUESTION */}
            <form method="post">
              <input type="hidden" name="intent" value="update-question" />
              <input type="hidden" name="questionId" value={q.id} />

              <s-text-field
                label="Question Title"
                name="title"
                defaultValue={q.title}
              />

              <s-text-field
                label="Description"
                name="description"
                defaultValue={q.description || ""}
              />

              <s-button type="submit" variant="primary">
                Save Question
              </s-button>
            </form>

            {/* OPTIONS */}
            {q.options?.length > 0 && (
              <s-box >
                <s-heading>Options</s-heading>
                {q.options.map((opt: any) => (
                  <s-text key={opt.id}>
                    {opt.label} ({opt.value})
                  </s-text>
                ))}
              </s-box>
            )}

            {/* ADD OPTION */}
            <form method="post">
              <input type="hidden" name="intent" value="add-option" />
              <input type="hidden" name="questionId" value={q.id} />

              <s-text-field name="label" label="Option Label" />
              <s-text-field name="value" label="Option Value" />

              <s-button type='submit'>Add Option</s-button>
            </form>
          </s-box>
        ))}
      </s-section>
    </s-page>
  );
}