"use client";
import { useState, useRef, useEffect, useTransition } from "react";
import { MoreVertical, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

const roles = ["customer", "affiliate", "admin"];
const MENU_HEIGHT = 190;

type UpdateRole = (formData: FormData) => Promise<{ success: boolean; error?: string }>;

export default function UserActionsMenu({
  userId,
  currentRole,
  updateRole,
}: {
  userId: string;
  currentRole: string;
  updateRole: UpdateRole;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<React.CSSProperties>({});
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function toggle() {
    if (isPending) return;
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const right = window.innerWidth - rect.right;
      const openUp = window.innerHeight - rect.bottom < MENU_HEIGHT;
      setPos(
        openUp
          ? { bottom: window.innerHeight - rect.top + 4, right }
          : { top: rect.bottom + 4, right }
      );
    }
    setOpen((o) => !o);
  }

  useEffect(() => {
    if (!open) return;

    function close() {
      if (!isPending) setOpen(false);
    }
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      close();
    }

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open, isPending]);

  function choose(role: string) {
    if (role === currentRole || isPending) return;
    setPendingRole(role);

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("userId", userId);
        fd.set("role", role);
        const result = await updateRole(fd);
        if (result.success) toast.success(`Role changed to ${role}`);
        else toast.error(result.error || "Could not update role");
      } catch {
        toast.error("Could not update role");
      } finally {
        setPendingRole(null);
        setOpen(false);
      }
    });
  }

  return (
    <div className="inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label="User actions"
        className="p-1.5 rounded-lg hover:bg-cream transition-colors"
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin text-gold" />
        ) : (
          <MoreVertical size={16} className="text-slate" />
        )}
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{ position: "fixed", ...pos }}
          className="w-44 rounded-xl bg-white border border-line shadow-lg z-50 overflow-hidden text-left"
        >
          <p className="px-4 py-2 text-xs text-slate border-b border-line">Set role</p>
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => choose(r)}
              disabled={isPending || r === currentRole}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors disabled:cursor-default ${
                r === currentRole ? "text-gold font-semibold bg-gold/5" : "text-navy hover:bg-cream"
              }`}
            >
              <span className="capitalize">{r}</span>
              {pendingRole === r ? (
                <Loader2 size={14} className="animate-spin" />
              ) : r === currentRole ? (
                <Check size={14} />
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}