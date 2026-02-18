import { Clock } from "lucide-react";

const 상담시간 = [
  {
    type: "weekday",
    title: "평일 상담",
    time: "10:00 ~ 21:00",
    description: "월요일부터 금요일까지 운영됩니다.",
  },
  {
    type: "weekend",
    title: "주말 상담 (토/일)",
    time: "10:00 ~ 18:00",
    description: "토요일, 일요일 상담 가능 시간입니다.",
  },
] as const;

const 교육관연락처 = [
  { label: "프리미엄관", phone: "02-562-8787" },
  { label: "M관", phone: "02-562-5757" },
  { label: "입시관", phone: "02-562-5759" },
] as const;

export default function BusinessHours() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-[#0a1e40]">
            <Clock className="h-4 w-4" aria-hidden />
            근무시간 및 상담안내
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#0a1e40] md:text-3xl">
            학부모 상담 가능 시간을 확인하세요
          </h1>
          <p className="mt-2 text-sm text-slate-600 md:text-base">
            아래 시간 외에는 연결이 지연될 수 있습니다.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {상담시간.map((item) => {
            const isWeekday = item.type === "weekday";

            return (
              <article
                key={item.title}
                className={`rounded-xl border p-5 ${
                  isWeekday
                    ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white text-[#0a1e40]"
                    : "border-pink-200 bg-gradient-to-br from-pink-50 to-white text-[#0a1e40]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                        isWeekday ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {isWeekday ? "WEEKDAY" : "WEEKEND"}
                    </span>
                    <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
                  </div>
                  <Clock
                    className={`h-5 w-5 shrink-0 ${isWeekday ? "text-blue-700" : "text-pink-700"}`}
                    aria-hidden
                  />
                </div>
                <p className="mt-3 text-2xl font-bold">{item.time}</p>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-start gap-2 text-sm text-amber-900 md:text-base">
            <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              <strong>점심시간:</strong> 13:00 ~ 14:00 (이 시간대에는 전화 연결이 어려울 수 있습니다.)
            </span>
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-base font-semibold text-[#0a1e40] md:text-lg">빠른 전화 연결</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {교육관연락처.map((item) => (
              <a
                key={item.label}
                href={`tel:${item.phone.replace(/-/g, "")}`}
                className="inline-flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-[#0a1e40] transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                aria-label={`${item.label} 전화걸기 ${item.phone}`}
              >
                <span>{item.label}</span>
                <span>{item.phone}</span>
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 rounded-lg bg-slate-50 px-4 py-3 text-center text-sm font-extrabold text-[#0a1e40] md:text-base">
          방문 상담은 예약제로 운영되오니 미리 전화 부탁드립니다.
        </p>
      </div>
    </section>
  );
}
