import { useRef, useState } from "react";
import { useFetcher } from "react-router";

export function EditableOptionRow({
  option,
  isNew = false,
  questionId,
  onCancel,
}: any) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  const [editing, setEditing] = useState(isNew);
  const [imageUrl, setImageUrl] = useState(option?.image || "");

  const intentRef = useRef<HTMLInputElement>(null);

  /* ----------------------------------
     VIEW MODE (ONLY FOR EXISTING OPTION)
  ----------------------------------- */
  if (!editing && option?.id) {
    return (
      <s-box padding="base" background="base" borderRadius="small">
        <fetcher.Form method="post">
          <input ref={intentRef} type="hidden" name="intent" />
          <input type="hidden" name="optionId" value={option.id} />

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
                {option.description && (
                  <s-text tone="neutral">{option.description}</s-text>
                )}
              </s-stack>
            </s-stack>

            <s-stack direction="inline" gap="small-100">
              <s-button
                type="button"
                icon="edit"
                disabled={isSubmitting}
                onClick={() => setEditing(true)}
              />

              <s-button
                icon="delete"
                tone="critical"
                disabled={isSubmitting}
                onClick={() => {
                  if (!window.confirm("Delete this option?")) return;
                  intentRef.current!.value = "delete-option";
                  fetcher.submit(
                    { intent: "delete-option", optionId: option.id },
                    { method: "post" }
                  );
                }}
              />
            </s-stack>
          </s-grid>
        </fetcher.Form>
      </s-box>
    );
  }

  /* ------------------------
     EDIT MODE (NEW + EXISTING)
  ------------------------- */
  return (
    <s-box padding="base" border="base" borderRadius="small">
      <fetcher.Form method="post">
        <input ref={intentRef} type="hidden" name="intent" />
        <input type="hidden" name="optionId" value={option?.id || ""} />
        <input type="hidden" name="questionId" value={questionId} />
        <input type="hidden" name="image" value={imageUrl} />

        <s-stack gap="base">
          <s-text-field
            name="label"
            label="Label"
            defaultValue={option?.label || ""}
            required
          />

          <s-text-field
            name="value"
            label="Value"
            defaultValue={option?.value || ""}
            required
          />

          <s-text-area
            name="description"
            label="Description"
            defaultValue={option?.description || ""}
          />

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

            <s-grid gridTemplateColumns="1fr auto" gap="base">
              <input
                type="text"
                value={imageUrl}
                placeholder="https://example.com/image.png"
                onChange={(e) => setImageUrl(e.target.value)}
              />

              {imageUrl && (
                <s-button
                  icon="x"
                  tone="critical"
                  disabled={isSubmitting}
                  onClick={() => setImageUrl("")}
                />
              )}
            </s-grid>
          </s-stack>

          <s-stack direction="inline" gap="base">
            <s-button
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={() => {
                intentRef.current!.value = isNew
                  ? "add-option"
                  : "update-option";
              }}
            >
              {isNew ? "Add option" : "Save"}
            </s-button>

            {!isNew && (
              <s-button
                tone="critical"
                disabled={isSubmitting}
                onClick={() => {
                  if (!window.confirm("Delete this option?")) return;
                  intentRef.current!.value = "delete-option";
                }}
              >
                Delete
              </s-button>
            )}

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
    </s-box>
  );
}
