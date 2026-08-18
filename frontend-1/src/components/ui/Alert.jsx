import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function Alert({ type = "success", message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={`flex items-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-[13.5px] font-medium ${
            type === "success" ? "bg-tint text-primary-dark" : "bg-red-50 text-red-700"
          }`}
        >
          {type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
