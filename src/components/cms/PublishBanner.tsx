"use client";

import { useEffect, useState } from "react";

export function PublishBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 8000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div className="border-l-3 border-accent bg-accent/5 rounded-r-md px-5 py-4 mb-6 flex items-center justify-between">
      <div>
        <p className="font-ui text-sm font-medium text-text">{message}</p>
        <p className="font-ui text-xs text-text-muted mt-1">
          The site will update in about 30 seconds.
        </p>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          onDismiss?.();
        }}
        className="font-ui text-xs text-text-muted hover:text-text transition-colors ml-4"
      >
        Dismiss
      </button>
    </div>
  );
}
