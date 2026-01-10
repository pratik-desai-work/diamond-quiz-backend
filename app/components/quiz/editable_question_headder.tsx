import { useRef, useState } from "react";

export function EditableQuestionHeader({
  question,
  index,
  isNew = false,
  quizId,
}: any) {
  const [editing, setEditing] = useState(isNew);
  const formRef = useRef<HTMLFormElement>(null);
  const intentRef = useRef<HTMLInputElement>(null);

  const modalId = `delete-question-${question?.id}`;

  if (!editing) {
    return (
      <form ref={formRef} method="post">
        <input ref={intentRef} type="hidden" name="intent" />
        <input type="hidden" name="questionId" value={question.id} />

        <s-stack>
          <s-grid gridTemplateColumns="1fr auto" alignItems="center">
            <s-heading>
              Question {index + 1}: {question.title}
            </s-heading>

            {/* EDIT + DELETE */}
            <s-stack direction="inline" gap="small-100">
              <s-button type="button" icon="edit" onClick={() => setEditing(true)} />

              <s-button
                tone="critical"
                icon="delete"
                commandFor={modalId}
                command="--show"
            />
            </s-stack>
          </s-grid>

          {question.description && (
            <s-text>{question.description}</s-text>
          )}
        </s-stack>

        {/* DELETE CONFIRM MODAL */}
        <s-modal id={modalId} heading="Delete question">
          <s-stack gap="base">
            <s-text>
              Are you sure you want to delete this question? All its options will
              also be deleted.
            </s-text>

            <s-stack direction="inline" gap="base" alignItems="end">
              <s-button
                commandFor={modalId}
                command="--hide"
              >
                Cancel
              </s-button>

              <s-button
                tone="critical"
                onClick={() => {
                  intentRef.current!.value = "delete-question";
                  formRef.current!.submit();
                }}
              >
                Delete
              </s-button>
            </s-stack>
          </s-stack>
        </s-modal>
      </form>
    );
  }

  return (
    <form ref={formRef} method="post">
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
          {/* SAVE */}
          <s-button
            variant="primary"
            onClick={() => {
              intentRef.current!.value = isNew
                ? "add-question"
                : "update-question";
              formRef.current!.submit();
            }}
          >
            {isNew ? "Add Question" : "Save"}
          </s-button>

          {/* DELETE */}
          {!isNew && (
            <s-button
              tone="critical"
              onClick={() => {
                intentRef.current!.value = "delete-question";
                formRef.current!.submit();
              }}
            >
              Delete
            </s-button>
          )}

          <s-button onClick={() => setEditing(false)}>Cancel</s-button>
        </s-stack>
      </s-stack>
    </form>
  );
}
