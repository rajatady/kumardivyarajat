"use client";

export function ImageUpload({
  onUpload,
  uploading,
}: {
  onUpload: () => void;
  uploading: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <button
        type="button"
        onClick={onUpload}
        disabled={uploading}
        className="font-ui text-xs font-medium px-3 py-1.5 rounded border border-border text-text-muted hover:border-accent hover:text-accent transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
      >
        {uploading ? (
          <>
            <svg
              className="animate-spin w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Upload image
          </>
        )}
      </button>
    </div>
  );
}
