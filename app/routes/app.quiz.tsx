// app/routes/app.quiz.tsx

import { useEffect, useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { addOptionToQuestion, addQuestionToQuiz, deleteOption, deleteQuestion, getOrCreateQuiz, toggleQuestionActive, updateOption, updateQuestion } from 'app/models/quiz.server';
import { authenticate } from 'app/shopify.server';
import { useLoaderData } from 'react-router';
import { EditableQuestionHeader } from 'app/components/quiz/editable_question_headder';
import { EditableOptionRow } from 'app/components/quiz/editable_option_row';

export async function loader({ request , params }: any) {
  const { admin } = await authenticate.admin(request);

  if (params.id === "new") {
    return {
      destination: "product",
      title: "",
    };
  }

  return await getOrCreateQuiz();
}

export async function action({ request }: any) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  if (intent === "update-question") {
    await updateQuestion(Number(formData.get("questionId")), {
      title: String(formData.get("title")),
      description: String(formData.get("description") || ""),
    });
  }

  if (intent === "delete-question") {
    await deleteQuestion(Number(formData.get("questionId")));
  }

  if (intent === "add-option") {
    await addOptionToQuestion(Number(formData.get("questionId")), {
      label: String(formData.get("label")),
      value: String(formData.get("value")),
      description: String(formData.get("description") || ""),
      image: String(formData.get("image") || ""),
    });
  }

  if (intent === "update-option") {
    await updateOption(Number(formData.get("optionId")), {
      label: String(formData.get("label")),
      value: String(formData.get("value")),
      description: String(formData.get("description") || ""),
      image: formData.get("image")
        ? String(formData.get("image"))
        : null,
    });
  }

  if (intent === "delete-option") {
    await deleteOption(Number(formData.get("optionId")));
  }

  if (intent === "add-question") {
    await addQuestionToQuiz(Number(formData.get("quizId")), {
      key: String(formData.get("key")),
      title: String(formData.get("title")),
      type: String(formData.get("type")),
      description: String(formData.get("description") || ""),
      min: formData.get("min")
        ? Number(formData.get("min"))
        : null,
    });
  }

  if (intent === "toggle-question") {
    await toggleQuestionActive(
      Number(formData.get("questionId")),
      formData.get("active") === "true"
    );
  }

  return null;
}


export default function QuizDashboard() {
  const app = useAppBridge();
  const quiz = useLoaderData();
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [addingOptionFor, setAddingOptionFor] = useState<number | null>(null);

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
      <s-stack gap="base">
        {quiz.questions.map((q: any, index: number) => (
          <s-box key={q.id} border="base" background='subdued' borderRadius="base" padding="base">
            <s-stack gap="base">
              <EditableQuestionHeader question={q} index={index} />

              {q.options.map((opt: any) => (
                <EditableOptionRow key={opt.id} option={opt} questionId={q.id} />
              ))}

              {/* INLINE ADD OPTION */}
              {addingOptionFor === q.id ? (
                <EditableOptionRow
                  isNew
                  questionId={q.id}
                  onCancel={() => setAddingOptionFor(null)}
                />
              ) : (
                <s-button onClick={() => setAddingOptionFor(q.id)}>
                  Add option
                </s-button>
              )}
            </s-stack>
          </s-box>
        ))}

        {/* INLINE ADD QUESTION */}
        {addingQuestion ? (
          <EditableQuestionHeader
            isNew
            quizId={quiz.id} 
            index={quiz.questions.length}
            question={{}}
            onCancel={() => setAddingQuestion(false)}
          />
        ) : (
          <s-button variant="primary" onClick={() => setAddingQuestion(true)}>
            Add Question
          </s-button>
        )}
      </s-stack>
    </s-page>
  );
}