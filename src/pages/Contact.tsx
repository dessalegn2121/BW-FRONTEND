import { FormEvent, useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Send,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useSettings } from '../context/SettingsContext';
import { Input } from '../components/ui/Input';
import contactImage from '../assets/contact1.png';

export default function Contact() {
  const { settings } = useSettings();
  const s = settings;
  const mapQuery = s?.address?.trim() || 'Addis Ababa, Ethiopia';
  const mapLink = s?.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=13&output=embed`;

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Replace with real endpoint: POST /api/contact
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  const socials = [
    { icon: Instagram, label: 'Instagram', href: s?.socialLinks?.find((x) => x.platform === 'instagram')?.url ?? '#' },
    { icon: Facebook, label: 'Facebook', href: s?.socialLinks?.find((x) => x.platform === 'facebook')?.url ?? '#' },
    { icon: Twitter, label: 'Twitter', href: s?.socialLinks?.find((x) => x.platform === 'twitter')?.url ?? '#' },
  ];

  return (
    <div className="pb-20">
      {/* ============ HERO BANNER ============ */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-accent-50">
        <PageContainer className="py-12 md:py-20 grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wide">
              <MessageSquare size={14} /> Get in touch
            </span>
            <h1 className="mt-4 font-display font-extrabold text-4xl sm:text-5xl text-ink leading-tight">
              Let's talk <span className="text-brand-600">juice.</span>
            </h1>
            <p className="mt-4 text-gray-600 text-base leading-relaxed">
              We'd love to hear from you about custom orders, catering, and everyday menu questions.
              Reach out through any channel below or send us a message — we usually reply within a few hours.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {s?.phone && (
                <a href={`tel:${s.phone}`} className="btn-primary">
                  <Phone size={16} /> Call us
                </a>
              )}
              {s?.email && (
                <a href={`mailto:${s.email}`} className="btn-outline">
                  <Mail size={16} /> Email us
                </a>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
            <img
              src={contactImage}
              alt="BW Juice and Bar restaurant, fresh food, and juices"
              className="block w-full aspect-[3/2] object-cover"
            />
          </div>
        </PageContainer>
      </section>

      {/* ============ CONTACT CARDS ============ */}
      <PageContainer>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={<MapPin size={20} />}
            title="Visit us"
            lines={[s?.address || 'Addis Ababa, Ethiopia']}
            hint="Tap to open in maps"
            href={mapLink}
          />
          <InfoCard
            icon={<Phone size={20} />}
            title="Call us"
            lines={[s?.phone || 'Phone coming soon']}
            hint="Mon – Sun"
            href={s?.phone ? `tel:${s.phone}` : undefined}
          />
          <InfoCard
            icon={<Mail size={20} />}
            title="Email us"
            lines={[s?.email || 'Email coming soon']}
            hint="We reply within hours"
            href={s?.email ? `mailto:${s.email}` : undefined}
          />
          <InfoCard
            icon={<Clock size={20} />}
            title="Opening hours"
            lines={
              s?.openingHours?.length
                ? [s.openingHours[0].closed ? 'Closed today' : `${s.openingHours[0].open} – ${s.openingHours[0].close}`]
                : ['Open daily', '8:00 AM – 10:00 PM']
            }
            hint="Full hours below"
          />
        </div>
      </PageContainer>

      {/* ============ FORM + SIDE PANEL ============ */}
      <PageContainer>
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Contact form */}
          <div className="lg:col-span-3 rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-2xl font-bold text-ink">Send us a message</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Questions, catering, feedback, or a custom order — we're all ears.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Your name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {/* <Input
                label="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              /> */}
              <div>
                <label className="label">Message</label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input"
                  placeholder="Tell us how we can help…"
                />
              </div>

              <button type="submit" disabled={sending} className="btn-primary w-full sm:w-auto">
                {sending ? 'Sending…' : (<>Send message <Send size={16} /></>)}
              </button>

              {sent && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg px-3 py-2 text-sm">
                  <CheckCircle2 size={16} /> Thanks! Your message has been sent.
                </div>
              )}
            </form>
          </div>

          {/* Side panel: hours + socials */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-3xl bg-ink text-white p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-600/40 blur-3xl" />
              <h3 className="font-bold text-lg relative">Opening hours</h3>
              {s?.openingHours?.length ? (
                <ul className="mt-4 space-y-2 text-sm relative">
                  {s.openingHours.map((h, i) => (
                    <li key={i} className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0">
                      <span className="text-white/80">{h.day}</span>
                      <span className="font-medium">
                        {h.closed ? 'Closed' : `${h.open} – ${h.close}`}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-4 space-y-2 text-sm relative">
                  <li className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-white/80">Mon – Fri</span><span className="font-medium">8:00 – 22:00</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-white/80">Sat – Sun</span><span className="font-medium">9:00 – 23:00</span>
                  </li>
                </ul>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-100">
              <h3 className="font-bold text-lg text-ink">Follow our juice journey</h3>
              <p className="text-sm text-gray-500 mt-1">Daily specials, behind-the-scenes, and new flavors.</p>
              <div className="flex gap-3 mt-5">
                {socials.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-11 h-11 rounded-full bg-brand-50 text-brand-600 grid place-items-center hover:bg-brand-600 hover:text-white transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* ============ MAP ============ */}
      <PageContainer>
        <div className="rounded-3xl overflow-hidden ring-1 ring-gray-100 shadow-sm">
          <div className="grid md:grid-cols-3">
            <div className="p-6 sm:p-8 bg-cream md:col-span-1">
              <h3 className="text-xl font-bold text-ink">Find us on the map</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {s?.address || 'Addis Ababa, Ethiopia'}
              </p>
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-brand-600 font-semibold hover:underline text-sm"
              >
                Open in Maps <ExternalLink size={14} />
              </a>
            </div>
            <div className="relative md:col-span-2 aspect-[16/9] md:aspect-auto min-h-[240px] bg-gray-100">
              <iframe
                src={mapEmbedUrl}
                title={`Google Map showing ${mapQuery}`}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

/* ---------- Info card ---------- */
function InfoCard({
  icon,
  title,
  lines,
  hint,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
  hint?: string;
  href?: string;
}) {
  const body = (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 hover:ring-brand-200 hover:shadow-md transition-all h-full">
      <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center">
        {icon}
      </div>
      <h3 className="mt-4 font-bold text-ink">{title}</h3>
      <div className="mt-1 space-y-0.5">
        {lines.map((line, i) => (
          <p key={i} className="text-sm text-gray-600 leading-relaxed">{line}</p>
        ))}
      </div>
      {hint && <p className="mt-3 text-xs text-brand-600 font-medium">{hint}</p>}
    </div>
  );
  return href ? (
    <a href={href} className="block h-full">{body}</a>
  ) : (
    body
  );
}