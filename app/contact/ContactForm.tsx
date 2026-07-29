"use client";
import { useState } from "react";
import { submitContactMessage } from "./actions";
import toast from "react-hot-toast";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await submitContactMessage(formData);
      toast.success("Message sent! We'll get back to you shortly.");
      (document.getElementById("contact-form") as HTMLFormElement)?.reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id="contact-form" action={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate">Full Name</label>
          <input name="name" required className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm" />
        </div>
      </div>
      <div>
        <label className="text-xs text-slate">Subject</label>
        <input name="subject" className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label className="text-xs text-slate">Message</label>
        <textarea name="message" required rows={5} className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm" />
      </div>
      <button
        disabled={loading}
        className="rounded-full bg-navy text-cream px-6 py-3 text-sm font-semibold hover:bg-gold hover:text-navy transition-colors disabled:opacity-50 inline-flex items-center gap-2"
      >
        <Send size={15} /> {loading ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}