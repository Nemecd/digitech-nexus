// Services that are booked through the request form: no cart, no online payment.
export const BOOKING_ONLY_TYPES = ["nin_service"];

export function isBookingOnly(type: string) {
  return BOOKING_ONLY_TYPES.includes(type);
}

// Your WhatsApp number in international format (no plus sign, no spaces).
export const WHATSAPP_NUMBER = "2347039067561";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
