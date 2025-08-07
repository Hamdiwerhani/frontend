"use client";

import { CheckCircle, XCircle, X } from "lucide-react"; // modern icons

export default function AlertPopup({
  message,
  onClose,
  type = "error",
}: {
  message: string;
  onClose: () => void;
  type?: "error" | "success";
}) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className={`relative w-full max-w-sm rounded-xl border bg-white p-6 shadow-xl ${
          isError ? "border-red-400" : "border-green-400"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          aria-label="Close alert"
        >
          <X size={20} />
        </button>

        {/* Icon + Message */}
        <div className="flex items-start gap-3">
          {isError ? (
            <XCircle className="h-6 w-6 text-red-500 mt-1" />
          ) : (
            <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
          )}
          <div>
            <p
              className={`text-sm font-medium ${
                isError ? "text-red-700" : "text-green-700"
              }`}
            >
              {message}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-colors duration-150 ${
              isError
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
