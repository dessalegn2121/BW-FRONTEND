import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Send } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import logo from '../../assets/LOGO.png';

export function Footer() {
  const { settings } = useSettings();
  const s = settings;
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Wire to a real endpoint later
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="relative mt-20 bg-white border-t border-gray-100">
      {/* Decorative top accent */}
      <div className="h-1 bg-gradient-to-r from-brand-600 via-brand-400 to-accent-400" />

      {/* Soft background splash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-50 blur-3xl opacity-70" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-accent-50 blur-3xl opacity-70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============ NEWSLETTER BANNER ============ */}
        <div className="relative -mt-10 mb-14 bg-brand-600 text-white rounded-3xl px-6 sm:px-10 py-8 shadow-xl shadow-brand-600/20 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight">
              Get fresh offers in your inbox
            </h3>
            <p className="text-white/80 mt-2 text-sm sm:text-base">
              Subscribe for exclusive discounts, seasonal drinks, and new menu alerts.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-full bg-white/15 placeholder-white/60 text-white pl-11 pr-4 outline-none border border-white/20 focus:border-white/60 transition"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-6 rounded-full bg-white text-brand-600 font-semibold hover:bg-brand-50 transition inline-flex items-center justify-center gap-2"
            >
              {subscribed ? 'Subscribed ✓' : (<>Subscribe <Send size={16} /></>)}
            </button>
          </form>
        </div>

        {/* ============ MAIN GRID ============ */}
        <div className="grid gap-10 md:gap-8 sm:grid-cols-2 lg:grid-cols-12 pb-12">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex mb-4">
              <img src={logo} alt="BW Juice and Bar Restaurant" className="h-24 w-24 object-contain" />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              {s?.aboutText ||
                'Fresh juices, smoothies, coffee, and meals made with the finest ingredients — straight from nature to your glass.'}
            </p>

            {/* Social buttons */}
            <div className="flex gap-3 mt-6">
              <SocialLink href="#" label="Facebook">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.6c-.29-.04-1.27-.12-2.42-.12-2.4 0-4.03 1.46-4.03 4.15v2.27H7.5V14h2.75v8h3.25Z" />
                </svg>
              </SocialLink>
              <SocialLink href="#" label="Instagram">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2.2c-2.66 0-2.99.01-4.03.06-1.04.05-1.75.21-2.37.46a4.78 4.78 0 0 0-1.73 1.13 4.78 4.78 0 0 0-1.13 1.73c-.25.62-.41 1.33-.46 2.37C2.21 9.01 2.2 9.34 2.2 12s.01 2.99.06 4.03c.05 1.04.21 1.75.46 2.37.25.62.6 1.15 1.13 1.73.58.53 1.11.88 1.73 1.13.62.25 1.33.41 2.37.46 1.04.05 1.37.06 4.03.06s2.99-.01 4.03-.06c1.04-.05 1.75-.21 2.37-.46a4.78 4.78 0 0 0 1.73-1.13 4.78 4.78 0 0 0 1.13-1.73c.25-.62.41-1.33.46-2.37.05-1.04.06-1.37.06-4.03s-.01-2.99-.06-4.03c-.05-1.04-.21-1.75-.46-2.37a4.78 4.78 0 0 0-1.13-1.73 4.78 4.78 0 0 0-1.73-1.13c-.62-.25-1.33-.41-2.37-.46C14.99 2.21 14.66 2.2 12 2.2Zm0 1.8c2.62 0 2.92.01 3.95.06.95.04 1.47.2 1.81.34.46.18.78.39 1.12.73.34.34.55.66.73 1.12.14.34.3.86.34 1.81.05 1.03.06 1.33.06 3.95s-.01 2.92-.06 3.95c-.04.95-.2 1.47-.34 1.81-.18.46-.39.78-.73 1.12-.34.34-.66.55-1.12.73-.34.14-.86.3-1.81.34-1.03.05-1.33.06-3.95.06s-2.92-.01-3.95-.06c-.95-.04-1.47-.2-1.81-.34a3 3 0 0 1-1.12-.73 3 3 0 0 1-.73-1.12c-.14-.34-.3-.86-.34-1.81-.05-1.03-.06-1.33-.06-3.95s.01-2.92.06-3.95c.04-.95.2-1.47.34-1.81.18-.46.39-.78.73-1.12.34-.34.66-.55 1.12-.73.34-.14.86-.3 1.81-.34C9.08 4.01 9.38 4 12 4Zm0 3.05a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.25a3.25 3.25 0 1 1 0-6.5 3.25 3.25 0 0 1 0 6.5Zm5.15-8.55a1.15 1.15 0 1 0 0-2.3 1.15 1.15 0 0 0 0 2.3Z" />
                </svg>
              </SocialLink>
              <SocialLink href="#" label="Twitter">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M18.9 2.5h3.3l-7.2 8.2 8.4 11.3h-6.6l-5.2-6.9-5.9 6.9H2.4l7.7-8.9L2 2.5h6.7l4.7 6.3 5.5-6.3Zm-1.2 17.7h1.8L7.4 4.3H5.5l12.2 15.9Z" />
                </svg>
              </SocialLink>
              <SocialLink href="#" label="TikTok">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.27 0 .53.04.78.12V9.74a5.75 5.75 0 0 0-.78-.06 5.7 5.7 0 1 0 5.7 5.7V9.4a7.34 7.34 0 0 0 4.3 1.38V7.68a4.29 4.29 0 0 1-2.74-1.86Z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-ink mb-4">Explore</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/menu">Menu</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
            
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Opening hours */}
          <div className="lg:col-span-6">
            <h4 className="font-bold text-ink mb-4">Opening Hours</h4>
            {s?.openingHours && s.openingHours.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {s.openingHours.slice(0, 5).map((h, i) => (
                  <li key={i} className="flex justify-between text-gray-600">
                    <span className="font-medium text-gray-700">{h.day}</span>
                    <span>{h.closed ? 'Closed' : `${h.open} – ${h.close}`}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                See our contact page for full opening hours.
              </p>
            )}

            <Link
              to="/menu"
              className="mt-6 inline-flex items-center gap-2 text-brand-600 font-semibold text-sm hover:gap-3 transition-all"
            >
              Order Online <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* ============ BOTTOM BAR ============ */}
        <div className="border-t border-gray-100 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} {s?.businessName ?? 'Juice Bar'}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/about" className="text-gray-500 hover:text-brand-600 transition">Privacy</Link>
            <Link to="/about" className="text-gray-500 hover:text-brand-600 transition">Terms</Link>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400 text-xs">Made with 🍓 + 🍊</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Helpers ---------- */

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 grid place-items-center hover:bg-brand-600 hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="text-gray-600 hover:text-brand-600 transition-colors inline-flex items-center gap-1 group"
      >
        <span className="w-0 group-hover:w-3 h-px bg-brand-600 transition-all duration-300" />
        {children}
      </Link>
    </li>
  );
}