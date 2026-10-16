"use client";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingText?: string;
  spinnerSize?: number;
};

export default function SubmitButton({
  children,
  pendingText,
  spinnerSize = 14,
  className = "",
  disabled,
  ...rest
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {pending && <Loader2 size={spinnerSize} className="animate-spin" />}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}