// app/routes/app.quiz.tsx

import { useEffect, useState } from "react";
import {
  addOptionToQuestion,
  addQuestionToQuiz,
  deleteOption,
  deleteQuestion,
  getOrCreateQuiz,
  reorderQuestions,
  toggleQuestionActive,
  updateOption,
  updateQuestion,
} from "app/models/quiz.server";
import { authenticate } from "app/shopify.server";
import { useFetcher, useLoaderData, useNavigation } from "react-router";

import { EditableQuestionHeader } from "app/components/quiz/editable_question_headder";
import { EditableOptionRow } from "app/components/quiz/editable_option_row";
import { DraggableQuestion } from "app/components/quiz/draggable_question";

/* ---------------- loader ---------------- */

export async function loader({ request, params }: any) {
  await authenticate.admin(request);

  if (params.id === "new") {
    return { destination: "product", title: "" };
  }

  return await getOrCreateQuiz();
}

/* ---------------- action ---------------- */

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

  if (intent === "reorder-questions") {
    const quizId = Number(formData.get("quizId"));
    const orderedIds = JSON.parse(
      String(formData.get("orderedIds"))
    ) as number[];

    await reorderQuestions(quizId, orderedIds);
  }

  return null;
}

/* ---------------- COMPONENT ---------------- */

export default function QuizDashboard() {
  const quiz: any = useLoaderData();
  const reorderFetcher = useFetcher();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const [questions, setQuestions] = useState<any[]>([]);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [addingOptionFor, setAddingOptionFor] = useState<number | null>(null);

  /* keep local state in sync with loader */
  useEffect(() => {
    if (quiz?.questions) {
      setQuestions(quiz.questions);
    }
  }, [quiz]);

  function moveQuestion(from: number, to: number) {
    setQuestions((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  }

  function persistOrder() {
    reorderFetcher.submit(
      {
        intent: "reorder-questions",
        quizId: quiz.id,
        orderedIds: JSON.stringify(questions.map((q) => q.id)),
      },
      { method: "post", action: "." }
    );
  }

  if (!quiz) {
    return (
      <s-page heading="Diamond Quiz Builder">
        <s-banner tone="warning">
          <s-text>Default quiz not initialized yet.</s-text>
        </s-banner>
      </s-page>
    );
  }
  if (isLoading) {
    return (
      <s-page heading="Diamond Quiz Builder">
        <s-banner tone="warning">
          <s-text>Loading...</s-text>
        </s-banner>
      </s-page>
    );
  }

  return (
    <s-page heading="Diamond Quiz Builder">
      <s-stack gap="base">
        {questions.map((q: any, index: number) => (
          <DraggableQuestion
            key={q.id}
            index={index}
            moveQuestion={moveQuestion}
            onDrop={persistOrder}  // ✅ SAVE ORDER ON DROP
          >
            {/* UI UNCHANGED */}
            <s-box
              border="base"
              background="subdued"
              borderRadius="base"
              padding="base"
            >
              <s-stack gap="base">
                <EditableQuestionHeader question={q} />

                {q.options.map((opt: any) => (
                  <EditableOptionRow
                    key={opt.id}
                    option={opt}
                    questionId={q.id}
                  />
                ))}

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
          </DraggableQuestion>
        ))}

        {addingQuestion ? (
          <EditableQuestionHeader
            isNew
            quizId={quiz.id}
            question={{}}
            onCancel={() => setAddingQuestion(false)}
          />
        ) : (
          <s-button variant="primary" onClick={() => setAddingQuestion(true)} disabled={isLoading} >
            Add Question
          </s-button>
        )}
      </s-stack>
    </s-page>
  );
}
