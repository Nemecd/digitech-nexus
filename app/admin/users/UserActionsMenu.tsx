"use client";
import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

const roles = ["customer", "affiliate", "admin"];

export default function UserActionsMenu({
  userId,
  currentRole,
  updateRole,
}: {
  userId: string;
  currentRole: string;
  updateRole: (formData: FormData) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button onClick={() => setOpen(!open)} className="p-1.5 rounded-lg hover:bg-cream transition-colors">
        <MoreVertical size={16} className="text-slate" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white border border-line shadow-lg z-10 overflow-hidden">
          <p className="px-4 py-2 text-xs text-slate border-b border-line">Set role</p>
          {roles.map((r) => (
            <form key={r} action={updateRole} onSubmit={() => setOpen(false)}>
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="role" value={r} />
              <button
                type="submit"
                disabled={r === currentRole}
                className={`w-full text-left px-4 py-2.5 text-sm capitalize transition-colors ${
                  r === currentRole ? "text-gold font-semibold bg-gold/5" : "text-navy hover:bg-cream"
                }`}
              >
                {r} {r === currentRole && "✓"}
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}