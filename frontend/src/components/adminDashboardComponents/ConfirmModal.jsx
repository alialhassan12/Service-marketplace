import React from "react";

export default function ConfirmModal({
  open,
  title = "Confirm",
  message,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 z-10 w-96">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="mb-4 text-sm text-muted">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-card/80" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
