import { redirect } from "next/navigation";

export const metadata = {
  title: "대치 위더스 학원",
  description: "위더스 학원 시간표 - 대원외고, 한영외고, 일반고",
};

export default function SchedulePage() {
  redirect("/schedule/daewon");
}
