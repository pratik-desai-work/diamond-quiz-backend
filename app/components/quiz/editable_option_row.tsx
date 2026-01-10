import { useRef, useState } from "react";

export function EditableOptionRow({ option, isNew = false, questionId }: any) {
  const [editing, setEditing] = useState(isNew);
  const [imageUrl, setImageUrl] = useState(option?.image || "");

  const formRef = useRef<HTMLFormElement>(null);
  const intentRef = useRef<HTMLInputElement>(null);

  
  const modalId = `delete-option-${option?.id}`;

  if (!editing) {
    return (
      <s-box padding="base" background="base" borderRadius="small">
        <form ref={formRef} method="post">
          <input ref={intentRef} type="hidden" name="intent" />
          <input type="hidden" name="optionId" value={option?.id} />

          <s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
            <s-stack direction="inline" gap="base" alignItems="center">
              {option.image && (
                <img
                  src={option.image}
                  alt=""
                  style={{
                    width: 45,
                    height: 45,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              )}
            
              <s-stack gap="small-100">
                <s-stack direction="inline" gap="small-100" alignItems="center">
                    <s-badge>{option.label}</s-badge>
                    <s-text>{option.value}</s-text>
                </s-stack>
                <s-text tone="neutral">{option.description}</s-text>
              </s-stack>
            </s-stack>

            {/* EDIT + DELETE */}
            <s-stack direction="inline" gap="small-100">
              <s-button type="button" icon="edit" onClick={() => setEditing(true)} />

              <s-button
                icon="delete"
                tone="critical"
                commandFor={modalId}
                command="--show"
              />
            </s-stack>
          </s-grid>

          {/* DELETE CONFIRM MODAL */}
          <s-modal id={modalId} heading="Delete option">
            <s-stack gap="base">
              <s-text>
                Are you sure you want to delete this option? This action cannot
                be undone.
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
                    intentRef.current!.value = "delete-option";
                    formRef.current!.submit();
                  }}
                >
                  Delete
                </s-button>
              </s-stack>
            </s-stack>
          </s-modal>
        </form>
      </s-box>
    );
  }

  return (
    <s-box padding="base" border="base" borderRadius="small">
      <form ref={formRef} method="post">
        <input ref={intentRef} type="hidden" name="intent" />
        <input type="hidden" name="optionId" value={option?.id || ""} />
        <input type="hidden" name="questionId" value={questionId} />
        <input type="hidden" name="image" value={imageUrl} />

        <s-stack gap="base">
          <s-text-field
            name="label"
            label="Label"
            defaultValue={option?.label}
            required
          />

          <s-text-field
            name="value"
            label="Value"
            defaultValue={option?.value}
            required
          />

          <s-text-area
            name="description"
            label="Description"
            defaultValue={option?.description || ""}
          />

          {/* IMAGE URL SECTION (unchanged UI) */}
          <s-stack gap="small-100">
            <s-text>Image URL</s-text>

            {imageUrl && (
              <img
                src={imageUrl}
                alt=""
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            )}

            <s-grid gridTemplateColumns="1fr auto" gap="base" alignItems="end">
              <input
                type="text"
                placeholder="https://example.com/image.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid var(--p-color-border)",
                }}
              />

              {imageUrl && (
                <s-button
                  icon="x"
                  tone="critical"
                  onClick={() => setImageUrl("")}
                />
              )}
            </s-grid>
          </s-stack>

          <s-stack direction="inline" gap="base">
            {/* SAVE */}
            <s-button
              variant="primary"
              onClick={() => {
                intentRef.current!.value = isNew
                  ? "add-option"
                  : "update-option";
                formRef.current!.submit();
              }}
            >
              {isNew ? "Add option" : "Save"}
            </s-button>

            {/* DELETE */}
            {!isNew && (
              <s-button
                tone="critical"
                onClick={() => {
                  intentRef.current!.value = "delete-option";
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
    </s-box>
  );
}
