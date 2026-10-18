import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import PrintButton from "./PrintButton";

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Anyone holding this link can view (and so verify) the certificate.
  const admin = createAdminClient();
  const { data: cert } = await admin
    .from("course_certificates")
    .select("id, issued_at, products(title, metadata), profiles(full_name)")
    .eq("id", id)
    .maybeSingle();

  if (!cert) notFound();

  const course = cert.products as any;
  const learner = cert.profiles as any;
  const instructor = course?.metadata?.instructor_name as string | undefined;
  const issued = new Date(cert.issued_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const number = `DN-${String(cert.id).slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <style>{`
        @page { size: A4 landscape; margin: 0; }
        .cert { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @media print {
          .no-print { display: none !important; }
          body { background: #ffffff !important; }
        }
      `}</style>

      <div className="no-print max-w-4xl mx-auto mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-slate">Choose &quot;Save as PDF&quot; in the print window to download your certificate.</p>
        <PrintButton />
      </div>

      <div className="cert mx-auto max-w-4xl bg-white border-[10px] border-navy p-2">
        <div className="border border-gold px-6 sm:px-14 py-10 sm:py-14 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <img src="/logo.png" alt="" className="h-9 w-9 object-contain" />
            <span className="font-display font-semibold text-navy tracking-wide">
              DIGITECH <span className="text-gold">NEXUS</span>
            </span>
          </div>

          <p className="text-xs tracking-[0.35em] text-gold font-semibold">CERTIFICATE OF COMPLETION</p>

          <p className="mt-8 text-sm text-slate">This certifies that</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-navy mt-3 break-words">
            {learner?.full_name || "Student"}
          </h1>
          <div className="mx-auto mt-4 h-px w-40 bg-gold" />

          <p className="mt-6 text-sm text-slate">has successfully completed the course</p>
          <h2 className="font-display text-xl sm:text-3xl font-semibold text-navy mt-3 break-words">
            {course?.title}
          </h2>
          {instructor && <p className="mt-3 text-sm text-slate">Instructor: {instructor}</p>}

          <div className="mt-10 sm:mt-14 grid grid-cols-3 gap-4 items-end text-xs text-slate">
            <div>
              <p className="font-semibold text-navy text-sm">{issued}</p>
              <div className="mt-1 h-px bg-line" />
              <p className="mt-1">Date issued</p>
            </div>
            <div>
              <p className="font-display text-navy text-base">Digitech Nexus</p>
              <div className="mt-1 h-px bg-line" />
              <p className="mt-1">Issued by</p>
            </div>
            <div>
              <p className="font-semibold text-navy text-sm">{number}</p>
              <div className="mt-1 h-px bg-line" />
              <p className="mt-1">Certificate number</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
