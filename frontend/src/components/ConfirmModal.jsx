import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function ConfirmModal({ open, onClose, onConfirm, title, desc, buttonName }) {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-xl bg-gray-800 text-white shadow-2xl transform transition-all scale-100 opacity-100">

        {/* Content */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">

            {/* Icon */}
            <div className="p-2 rounded-lg w-fit mb-4 bg-white/5">
              <AlertTriangle size={22} color={"red"} />
            </div>

            {/* Text */}
            <div>
              <h3 className="text-lg font-semibold">
                {title}
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                {desc}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-700/30 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-400 transition"
          >
            {buttonName}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
