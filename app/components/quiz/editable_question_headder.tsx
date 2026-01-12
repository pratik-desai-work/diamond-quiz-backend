import { useRef, useState } from "react";
import { useFetcher } from "react-router";

export function EditableQuestionHeader({
  question,
  index,
  isNew = false,
  quizId,
  onCancel,
}: any) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  const [editing, setEditing] = useState(isNew);
  const intentRef = useRef<HTMLInputElement>(null);

  if (!editing) {
    return (
      <fetcher.Form method="post">
        <input ref={intentRef} type="hidden" name="intent" />
        <input type="hidden" name="questionId" value={question.id} />
        <input type="hidden" name="active" />

        <s-grid gridTemplateColumns="1fr auto">
          <s-heading>
            Question {index + 1}: {question.title}
          </s-heading>

          <s-stack direction="inline" gap="small-100">
            <s-switch
              checked={question.active}
              disabled={isSubmitting}
              label={question.active ? "Active" : "Inactive"}
              onChange={(event: any) => {
                intentRef.current!.value = "toggle-question";
                fetcher.submit(
                  {
                    intent: "toggle-question",
                    questionId: question.id,
                    active: String(event.target.checked),
                  },
                  { method: "post" }
                );
              }}
            />

            <s-button
              icon="edit"
              disabled={isSubmitting}
              onClick={() => setEditing(true)}
            />

            {index > 5 && (
              <s-button
                icon="delete"
                tone="critical"
                disabled={isSubmitting}
                onClick={() => {
                  if (!window.confirm("Delete this question and all its options?"))
                    return;
                  fetcher.submit(
                    {
                      intent: "delete-question",
                      questionId: question.id,
                    },
                    { method: "post" }
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

  return (
    <fetcher.Form method="post">
      <input ref={intentRef} type="hidden" name="intent" />
      {isNew && <input type="hidden" name="quizId" value={quizId} />}
      {!isNew && (
        <input type="hidden" name="questionId" value={question.id} />
      )}

      <input type="hidden" name="key" value={`q_${Date.now()}`} />
      <input type="hidden" name="type" value="single" />

      <s-stack gap="base">
        <s-text-field
          name="title"
          label={`Question ${index + 1}`}
          defaultValue={question?.title || ""}
          required
        />

        <s-text-area
          name="description"
          label="Description"
          defaultValue={question?.description || ""}
        />

        <s-stack direction="inline" gap="base">
          <s-button
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
            onClick={() => {
              intentRef.current!.value = isNew
                ? "add-question"
                : "update-question";
            }}
          >
            {isNew ? "Add Question" : "Save"}
          </s-button>

          <s-button
            disabled={isSubmitting}
            onClick={() => {
              if (isNew) {
                onCancel?.();
              } else {
                setEditing(false);
              }
            }}
          >
            Cancel
          </s-button>
        </s-stack>
      </s-stack>
    </fetcher.Form>
  );
}
