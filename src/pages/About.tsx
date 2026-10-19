import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Leaf,
  Heart,
  Award,
  Sparkles,
  Users,
  Recycle,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useSettings } from '../context/SettingsContext';
import aboutImage from '../assets/about1.png';
import aboutHeroImage from '../assets/about2.png';

export function About() {
  const { settings } = useSettings();
  const name = settings?.businessName ?? 'BW Juice and Bar';

  const values = [
    {
      icon: Leaf,
      title: 'Fresh Ingredients',
      text: 'Hand-picked fruits and produce sourced daily from trusted local growers.',
    },
    {
      icon: Heart,
      title: 'Made with Love',
      text: 'Every drink and dish is crafted with care, one cup at a time.',
    },
    {
      icon: Recycle,
      title: 'Sustainable',
      text: 'Compostable cups, minimal waste, and a greener supply chain.',
    },
    {
      icon: Award,
      title: 'Quality First',
      text: 'No shortcuts, no artificial flavors — just real ingredients.',
    },
  ];

  const stats = [
    { value: '15+', label: 'Signature drinks' },
    { value: '5k+', label: 'Happy customers' },
    { value: '4.9', label: 'Average rating' },
    { value: '100%', label: 'Natural ingredients' },
  ];

  const team = [
    { name: 'Amara B.', role: 'Head Juicer' },
    { name: 'Kwame O.', role: 'Barista Extraordinaire' },
    { name: 'Zara M.', role: 'Kitchen Lead' },
  ];

  return (
    <div className="pb-20">
      {/* ============ HERO ============ */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-accent-50">
        <PageContainer className="py-12 md:py-20 grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5">
            <img
              src={aboutHeroImage}
              alt="BW Juice and Bar restaurant, fresh food, and juices"
              className="block w-full aspect-[4/3] object-cover"
            />
          </div>

          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wide">
              <Sparkles size={14} /> Our story
            </span>
            <h1 className="mt-4 font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.05]">
              Real fruit. Real <span className="text-brand-600">flavor.</span>
              <br />
              Real refreshment.
            </h1>
            <p className="mt-5 text-gray-600 text-base sm:text-lg leading-relaxed">
              {settings?.aboutText ||
                `Welcome to ${name}! We're a family-run juice bar on a mission to make healthy taste incredible — one fresh-pressed cup at a time.`}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/menu" className="btn-primary">
                Explore our menu <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-outline">
                Visit us today
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ============ STATS ============ */}
      <PageContainer>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((st) => (
            <div
              key={st.label}
              className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 hover:ring-brand-200 hover:-translate-y-0.5 transition-all"
            >
              <p className="font-display font-extrabold text-3xl sm:text-4xl text-brand-600">
                {st.value}
              </p>
              <p className="mt-1 text-sm text-gray-500 font-medium">{st.label}</p>
            </div>
          ))}
        </div>
      </PageContainer>

      {/* ============ STORY ============ */}
      <PageContainer>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-brand-100 to-accent-100">
              <img
                src={aboutImage}
                alt="BW Juice and Bar restaurant, fresh juices, and food"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 px-5 py-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-600 text-white grid place-items-center">
                <Coffee size={20} />
              </div>
              <div>
                <p className="font-bold text-ink text-sm">Since day one</p>
                <p className="text-xs text-gray-500">Freshly made, always</p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">How we started</span>
            <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl text-ink leading-tight">
              From a tiny counter to your favorite neighborhood spot.
            </h2>
            <p className="mt-5 text-gray-600 leading-relaxed">
              What began as a weekend passion project quickly turned into a daily ritual for our community.
              We blend, press, brew, and plate everything by hand — because the small details are exactly
              what make the biggest difference.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Hand-pressed juices, no added sugar',
                'Locally sourced seasonal produce',
                'Warm, welcoming space for everyone',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 size={18} className="text-brand-600 mt-0.5 shrink-0" />
                  <span className="text-sm sm:text-base">{line}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/menu"
              className="mt-8 inline-flex items-center gap-2 text-brand-600 font-semibold hover:gap-3 transition-all"
            >
              See what we make <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </PageContainer>

      {/* ============ VALUES ============ */}
      <PageContainer>
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">What we stand for</span>
          <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl text-ink">
            Four simple promises
          </h2>
          <p className="mt-3 text-gray-600">
            The values that guide every cup we pour and every plate we serve.
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:ring-brand-200 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 grid place-items-center">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </PageContainer>

      {/* ============ TEAM ============ */}
      <PageContainer>
        <div className="rounded-3xl bg-ink text-white p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-accent-500/20 blur-3xl" />

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wide">
              <Users size={14} /> Meet the team
            </span>
            <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl leading-tight">
              The people behind the press.
            </h2>
            <p className="mt-3 text-white/70">
              A small crew with big hearts — obsessed with freshness and hospitality.
            </p>
          </div>

          <div className="relative mt-10 grid sm:grid-cols-3 gap-5">
            {team.map((m) => (
              <div key={m.name} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 backdrop-blur-sm">
                <p className="font-bold">{m.name}</p>
                <p className="text-sm text-white/60">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>

      {/* ============ CTA ============ */}
      <PageContainer>
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-500 text-white p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">
              Ready for a fresh start?
            </h2>
            <p className="mt-3 text-white/85 max-w-xl mx-auto">
              Browse our full menu, order in seconds, and taste the difference real ingredients make.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold rounded-full px-6 py-3 hover:bg-brand-50 transition"
              >
                Order now <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-transparent border border-white/60 text-white font-semibold rounded-full px-6 py-3 hover:bg-white/10 transition"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}