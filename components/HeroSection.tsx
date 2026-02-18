import Link from "next/link";

const SCHOOLS = [
  {
    label: "대원외고",
    href: "/school/daewon",
    gradient: "from-emerald-100/90 to-teal-50/90",
  },
  {
    label: "한영외고",
    href: "/school/hanyoung",
    gradient: "from-sky-100/90 to-cyan-50/90",
  },
  {
    label: "일반고",
    href: "/school/general",
    gradient: "from-violet-100/90 to-purple-50/90",
  },
  {
    label: "개인팀수업",
    href: "/school/private",
    gradient: "from-slate-100/90 to-cool-gray-100/90",
  },
] as const;

function WMark() {
  return (
    <span
      className="absolute right-3 top-3 font-serif text-3xl font-bold leading-none text-gray-400 sm:right-4 sm:top-4 sm:text-4xl"
      aria-hidden
    >
      W
    </span>
  );
}

export default function HeroSection() {
  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SCHOOLS.map(({ label, href, gradient }) => (
            <Link
              key={href}
              href={href}
              className="group relative flex min-h-[120px] flex-col justify-end overflow-hidden rounded-2xl p-5 shadow-lg transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#002761]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-withus-gold sm:min-h-[140px] sm:p-6"
            >
              {/* Base gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-300 ease-out group-hover:scale-105`} aria-hidden />
              {/* Pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.12] transition-opacity duration-300 group-hover:opacity-[0.18]"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, #002761 1px, transparent 1px)`,
                  backgroundSize: "14px 14px",
                }}
                aria-hidden
              />
              {/* Glass layer */}
              <div
                className="absolute inset-0 rounded-2xl border border-white/40 bg-white/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)] backdrop-blur-sm transition-all duration-300 group-hover:border-white/60 group-hover:bg-white/35"
                aria-hidden
              />
              <WMark />
              <span className="relative z-10 text-lg font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-0.5 sm:text-xl lg:text-2xl" style={{ color: "#002761" }}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
