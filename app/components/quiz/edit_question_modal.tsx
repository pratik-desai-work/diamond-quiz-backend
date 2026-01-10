export function EditQuestionModal({ question }: any) {
  return (
    <>
      {/* Polaris controlled modal */}
      <s-modal id={`edit-question-${question.id}`} heading="Edit Question">
        
        {/* UPDATE QUESTION FORM */}
        <form method="post" action="">
          <input type="hidden" name="intent" value="update-question" />
          <input type="hidden" name="questionId" value={question.id} />

          <s-stack gap="base">
            <s-text-field
              label="Question title"
              name="title"
              defaultValue={question.title}
              required
            />

            <s-text-area
              label="Description"
              name="description"
              defaultValue={question.description || ""}
            />

            <s-stack  gap="base">
              {/* Submit button will auto-close using app navigation refresh if the route re-renders */}
              <s-button variant="primary" type="submit" commandFor={`edit-question-${question.id}`} command="--hide">
                Save
              </s-button>

              {/* Cancel always hides modal */}
              <s-button commandFor={`edit-question-${question.id}`} command="--hide">
                Cancel
              </s-button>
            </s-stack>
          </s-stack>
        </form>

        <s-divider />

        {/* EXISTING OPTIONS */}
        <s-stack gap="base">
          <s-heading >Options</s-heading>

          {question.options.map((opt: any) => (
            <s-stack key={opt.id} gap="base">
              <s-text>{opt.label}</s-text>
              <s-text tone="info">{opt.value}</s-text>
            </s-stack>
          ))}
        </s-stack>

        <s-divider />

        {/* ADD OPTION FORM */}
        <form method="post">
          <input type="hidden" name="intent" value="add-option" />
          <input type="hidden" name="questionId" value={question.id} />

          <s-stack gap="base">
            <s-text-field
              label="Option label"
              name="label"
              required
            />

            <s-text-field
              label="Option value"
              name="value"
              required
            />

            <s-button type="submit" variant="primary" commandFor={`edit-question-${question.id}`} command="--hide">
              Add Option
            </s-button>
          </s-stack>
        </form>
      </s-modal>
    </>
  );
}
