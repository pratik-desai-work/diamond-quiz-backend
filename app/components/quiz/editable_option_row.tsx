import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";

export function EditableOptionRow({
  option,
  isNew = false,
  questionId,
  onCancel,
}: any) {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const submittedRef = useRef(false);

  const isSubmitting = fetcher.state !== "idle";

  const [editing, setEditing] = useState(isNew);
  const [imageUrl, setImageUrl] = useState(option?.image ?? "");

  /* ✅ close + cleanup after submit */
  useEffect(() => {
    if (fetcher.state === "idle" && submittedRef.current) {
      submittedRef.current = false;

      formRef.current?.reset();
      setImageUrl("");

      if (isNew) {
        onCancel?.(); // 🔥 unmount add-option form
      } else {
        setEditing(false);
      }
    }
  }, [fetcher.state, isNew, onCancel]);

  /* ---------- VIEW MODE ---------- */
  if (!editing && option?.id) {
    return (
      <s-box padding="base" background="base" borderRadius="small">
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
            <s-button icon="edit" onClick={() => setEditing(true)} />

            <s-button
              icon="delete"
              tone="critical"
              onClick={() => {
                if (!window.confirm("Delete this option?")) return;

                fetcher.submit(
                  {
                    intent: "delete-option",
                    optionId: option.id,
                  },
                  { method: "post", action: "." }
                );
              }}
            />
          </s-stack>
        </s-grid>
      </s-box>
    );
  }

  /* ---------- EDIT / ADD MODE ---------- */
  return (
    <s-box padding="base" border="base" borderRadius="small">
      <fetcher.Form ref={formRef} method="post" action=".">
        <input
          type="hidden"
          name="intent"
          value={isNew ? "add-option" : "update-option"}
        />
        <input type="hidden" name="questionId" value={questionId} />
        <input type="hidden" name="optionId" value={option?.id ?? ""} />
        <input type="hidden" name="image" value={imageUrl} />

        <s-stack gap="base">
          <s-text-field
            name="label"
            label="Label"
            defaultValue={option?.label ?? ""}
            required
          />

          <s-text-field
            name="value"
            label="Value"
            defaultValue={option?.value ?? ""}
            required
          />

          <s-text-area
            name="description"
            label="Description"
            defaultValue={option?.description ?? ""}
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
              onClick={() => {
                submittedRef.current = true;
                formRef.current && fetcher.submit(formRef.current);
              }}
            >
              {isNew ? "Add option" : "Save"}
            </s-button>

            <s-button
              disabled={isSubmitting}
              onClick={() => {
                formRef.current?.reset();
                setImageUrl("");

                if (isNew) onCancel?.();
                else setEditing(false);
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
