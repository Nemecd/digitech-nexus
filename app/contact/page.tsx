import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <section className="relative bg-navy">
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold mx-auto">
            CONTACT US
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mt-5 text-cream">
            We&apos;d love to hear from you.
          </h1>
          <p className="text-cream/70 text-lg mt-4 max-w-xl mx-auto">
            Questions, support, or just curious about a service? Reach out any way that works for you.
          </p>
        </div>
      </section>

      <section className="relative bg-white">
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy mb-6">Send us a message</h2>
            <ContactForm />
          </div>

          <div className="space-y-4">
            <a href="tel:07039067561" className="flex items-start gap-4 rounded-2xl border border-line p-5 hover:border-gold/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">Call / WhatsApp</p>
                <p className="text-slate text-sm">07039067561, 07013364339</p>
              </div>
            </a>

            <a href="mailto:info@digitechnexushub.com" className="flex items-start gap-4 rounded-2xl border border-line p-5 hover:border-gold/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">Email</p>
                <p className="text-slate text-sm">info@digitechnexushub.com</p>
              </div>
            </a>

            <a href="https://wa.me/2347039067561" className="flex items-start gap-4 rounded-2xl border border-line p-5 hover:border-gold/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                <MessageCircle size={18} />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">Live Chat</p>
                <p className="text-slate text-sm">Chat with us on WhatsApp</p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-line p-5">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">Office Address</p>
                <p className="text-slate text-sm">No. 40 Okpara Avenue, Enugu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}