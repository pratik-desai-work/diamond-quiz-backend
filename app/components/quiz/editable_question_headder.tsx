import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";

export function EditableQuestionHeader({
  question,
  isNew = false,
  quizId,
  onCancel,
}: any) {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmittingRef = useRef(false);

  const [editing, setEditing] = useState(isNew);
  const isSubmitting = fetcher.state !== "idle";

  /* ✅ close & cleanup after submit */
  useEffect(() => {
    if (fetcher.state === "idle" && isSubmittingRef.current) {
      isSubmittingRef.current = false;

      formRef.current?.reset(); // 🔥 clear old values

      if (isNew) {
        onCancel?.(); // 🔥 unmount form
      } else {
        setEditing(false);
      }
    }
  }, [fetcher.state, isNew, onCancel]);

  /* ---------- VIEW MODE ---------- */
  if (!editing) {
    return (
      <fetcher.Form method="post" action=".">
        <s-grid gridTemplateColumns="1fr auto">
          <s-heading>
            Question {question.order}: {question.title}
          </s-heading>

          <s-stack direction="inline" gap="small-100">
            <s-switch
              checked={question.active}
              label={question.active ? "Active" : "Inactive"}
              disabled={isSubmitting}
              onChange={(e: any) => {
                fetcher.submit(
                  {
                    intent: "toggle-question",
                    questionId: question.id,
                    active: String(e.target.checked),
                  },
                  { method: "post", action: "." }
                );
              }}
            />

            <s-button icon="edit" onClick={() => setEditing(true)} />

            {question.order > 6 && (
              <s-button
                icon="delete"
                tone="critical"
                onClick={() => {
                  if (
                    !window.confirm(
                      "Delete this question and all its options?"
                    )
                  )
                    return;

                  fetcher.submit(
                    {
                      intent: "delete-question",
                      questionId: question.id,
                    },
                    { method: "post", action: "." }
                  );
                }}
              />
            )}
          </s-stack>
        </s-grid>

        {question.description && <s-text>{question.description}</s-text>}
      </fetcher.Form>
    );
  }

  /* ---------- EDIT / ADD MODE ---------- */
  return (
    <fetcher.Form ref={formRef} method="post" action=".">
      <input
        type="hidden"
        name="intent"
        value={isNew ? "add-question" : "update-question"}
      />
      <input type="hidden" name="quizId" value={quizId} />
      <input type="hidden" name="questionId" value={question.id} />
      <input type="hidden" name="key" value={`q_${Date.now()}`} />
      <input type="hidden" name="type" value="single" />

      <s-stack gap="base">
        <s-text-field
          name="title"
          label="Question title"
          defaultValue={question?.title ?? ""}
          required
        />

        <s-text-area
          name="description"
          label="Description"
          defaultValue={question?.description ?? ""}
        />

        <s-stack direction="inline" gap="base">
          <s-button
            variant="primary"
            loading={isSubmitting}
            onClick={() => {
              isSubmittingRef.current = true;
              formRef.current && fetcher.submit(formRef.current);
            }}
          >
            {isNew ? "Add Question" : "Save"}
          </s-button>

          <s-button
            disabled={isSubmitting}
            onClick={() => {
              formRef.current?.reset();
              isNew ? onCancel?.() : setEditing(false);
            }}
          >
            Cancel
          </s-button>
        </s-stack>
      </s-stack>
    </fetcher.Form>
  );
}
