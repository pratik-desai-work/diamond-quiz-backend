import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";

export function EditableOptionRow({
  option,
  isNew = false,
  isActive,
  questionId,
  onCancel,
}: any) {
  const saveFetcher = useFetcher();
  const uploadFetcher = useFetcher();

  const formRef = useRef<HTMLFormElement>(null);
  const submittedRef = useRef(false);

  const isSaving = saveFetcher.state !== "idle";
  const isUploading = uploadFetcher.state !== "idle";

  const [editing, setEditing] = useState(isNew);
  const [imageUrl, setImageUrl] = useState(option?.image ?? "");

  /* ✅ close + cleanup after save */
  useEffect(() => {
    if (saveFetcher.state === "idle" && submittedRef.current) {
      submittedRef.current = false;

      if (isNew) {
        formRef.current?.reset();
        setImageUrl("");
        onCancel?.();
      } else {
        setEditing(false);
      }
    }
  }, [saveFetcher.state, isNew, onCancel]);

  /* ✅ handle image upload response */
  useEffect(() => { 
    if (uploadFetcher.data?.imageUrl) {
      setImageUrl(uploadFetcher.data.imageUrl);
    }
  }, [uploadFetcher.data]);

  /* ---------- VIEW MODE ---------- */
  if (!editing && option?.id) {
    return (
      <s-box padding="base" background={isActive ? "base" : "transparent" } border={isActive ? "none" : "base strong"} borderRadius="small">
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
                <s-text>{String(isActive)}</s-text>
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

                saveFetcher.submit(
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
      <saveFetcher.Form ref={formRef} method="post" action=".">
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

          {/* IMAGE UPLOAD (replaced URL input) */}
          <s-stack gap="small-100">
            <s-text>Image</s-text>

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

            <input
              type="file"
              accept="image/*"
              disabled={isUploading || isSaving}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const fd = new FormData();
                fd.append("intent", "upload-option-image");
                fd.append("file", file);

                uploadFetcher.submit(fd, {
                  method: "post",
                  action: ".",
                  encType: "multipart/form-data",
                });
              }}
            />

            {isUploading && (
              <s-text tone="success">Uploading image…</s-text>
            )}

            {imageUrl && (
              <s-button
                icon="x"
                tone="critical"
                disabled={isSaving || isUploading}
                onClick={() => setImageUrl("")}
              />
            )}
          </s-stack>

          {/* ACTIONS */}
          <s-stack direction="inline" gap="base">
            <s-button
              variant="primary"
              loading={isSaving}
              disabled={isUploading}
              onClick={() => {
                submittedRef.current = true;
                saveFetcher.submit(formRef.current!);
              }}
            >
              {isNew ? "Add option" : "Save"}
            </s-button>

            <s-button
              disabled={isSaving || isUploading}
              onClick={() => {
                formRef.current?.reset();
                setImageUrl("");
                isNew ? onCancel?.() : setEditing(false);
              }}
            >
              Cancel
            </s-button>
          </s-stack>
        </s-stack>
      </saveFetcher.Form>
    </s-box>
  );
}
