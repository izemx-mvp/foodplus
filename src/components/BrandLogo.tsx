import type { IntegrationKey } from "@/lib/mock-data";

type Props = { brand: IntegrationKey; className?: string };

export function BrandLogo({ brand, className = "h-6 w-6" }: Props) {
  switch (brand) {
    case "gmail":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-label="Gmail">
          <path fill="#4285f4" d="M6 14l18 13L42 14v22a4 4 0 01-4 4H10a4 4 0 01-4-4V14z" />
          <path fill="#34a853" d="M6 14v22a4 4 0 004 4h6V21L6 14z" />
          <path fill="#fbbc04" d="M42 14v22a4 4 0 01-4 4h-6V21l10-7z" />
          <path fill="#ea4335" d="M6 14l18 13L42 14v-2a4 4 0 00-4-4H10a4 4 0 00-4 4v2z" />
          <path fill="#c5221f" d="M6 14l18 13V21L6 14z" opacity=".3" />
        </svg>
      );
    case "sheets":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-label="Google Sheets">
          <path fill="#0f9d58" d="M30 4H12a4 4 0 00-4 4v32a4 4 0 004 4h24a4 4 0 004-4V14L30 4z" />
          <path fill="#87ceac" d="M30 4v8a2 2 0 002 2h8L30 4z" />
          <path fill="#fff" d="M14 20h20v18H14z" />
          <path fill="#0f9d58" d="M14 20h20v3H14zm0 6h20v3H14zm0 6h20v3H14zM20 20h3v18h-3zm6 0h3v18h-3z" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-label="Google Calendar">
          <rect x="6" y="8" width="36" height="36" rx="4" fill="#fff" stroke="#dadce0" strokeWidth="2" />
          <path fill="#4285f4" d="M6 8h36v8H6z" />
          <text x="24" y="34" textAnchor="middle" fontSize="14" fontWeight="700" fill="#4285f4" fontFamily="Arial">31</text>
          <rect x="13" y="4" width="3" height="8" fill="#5f6368" rx="1" />
          <rect x="32" y="4" width="3" height="8" fill="#5f6368" rx="1" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-label="WhatsApp">
          <circle cx="24" cy="24" r="20" fill="#25d366" />
          <path fill="#fff" d="M24 10c-7.7 0-14 6.3-14 14 0 2.5.7 4.8 1.9 6.9L10 38l7.4-1.9c2 1.1 4.3 1.7 6.6 1.7 7.7 0 14-6.3 14-14s-6.3-13.8-14-13.8zm8.1 19.8c-.3.9-1.9 1.8-2.7 1.9-.7.1-1.5.1-2.4-.2-.6-.2-1.3-.4-2.2-.8-3.9-1.7-6.4-5.6-6.6-5.9-.2-.3-1.6-2.1-1.6-4 0-1.9 1-2.8 1.3-3.2.3-.4.7-.5 1-.5h.7c.2 0 .5-.1.8.6.3.7 1 2.6 1.1 2.8.1.2.1.4 0 .7-.1.3-.2.4-.4.7-.2.3-.4.5-.6.8-.2.2-.4.5-.2.9.2.4 1 1.6 2.1 2.6 1.4 1.3 2.6 1.7 3 1.9.4.2.6.2.9-.1.2-.3.9-1.1 1.2-1.4.3-.4.5-.3.9-.2.4.1 2.3 1.1 2.7 1.3.4.2.7.3.8.5.1.2.1 1-.2 1.9z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-label="Facebook">
          <path fill="#1877f2" d="M44 24c0-11-9-20-20-20S4 13 4 24c0 10 7.3 18.2 16.8 19.8V29.8h-5V24h5v-4.3c0-5 3-7.7 7.5-7.7 2.2 0 4.5.4 4.5.4v4.9h-2.5c-2.5 0-3.3 1.5-3.3 3.1V24h5.6l-.9 5.8h-4.7v14C36.7 42.2 44 34 44 24z" />
          <path fill="#fff" d="M31.9 29.8L32.8 24h-5.6v-3.7c0-1.6.8-3.1 3.3-3.1H33v-4.9s-2.3-.4-4.5-.4c-4.5 0-7.5 2.7-7.5 7.7V24h-5v5.8h5v14c2.1.3 4.3.3 6.4 0v-14h4.5z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-label="Instagram">
          <defs>
            <radialGradient id="igG" cx="30%" cy="107%" r="150%">
              <stop offset="0" stopColor="#fdf497" />
              <stop offset=".05" stopColor="#fdf497" />
              <stop offset=".45" stopColor="#fd5949" />
              <stop offset=".6" stopColor="#d6249f" />
              <stop offset=".9" stopColor="#285aeb" />
            </radialGradient>
          </defs>
          <rect width="48" height="48" rx="12" fill="url(#igG)" />
          <circle cx="24" cy="24" r="8" fill="none" stroke="#fff" strokeWidth="2.5" />
          <circle cx="34" cy="14" r="1.8" fill="#fff" />
          <rect x="11" y="11" width="26" height="26" rx="7" fill="none" stroke="#fff" strokeWidth="2.5" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-label="LinkedIn">
          <rect width="48" height="48" rx="6" fill="#0a66c2" />
          <path fill="#fff" d="M14 19h5v15h-5zm2.5-7.5a2.9 2.9 0 110 5.8 2.9 2.9 0 010-5.8zM22 19h4.8v2h.1c.7-1.3 2.4-2.7 4.9-2.7 5.2 0 6.2 3.4 6.2 7.9V34h-5v-6.9c0-1.6 0-3.8-2.3-3.8s-2.7 1.8-2.7 3.7V34h-5z" />
        </svg>
      );
    case "crm":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-label="CRM">
          <rect width="48" height="48" rx="10" fill="#0ea5e9" />
          <path fill="#fff" d="M14 16h20v4H14zm0 7h20v4H14zm0 7h12v4H14z" />
          <circle cx="34" cy="32" r="4" fill="#fbbf24" />
        </svg>
      );
  }
}
