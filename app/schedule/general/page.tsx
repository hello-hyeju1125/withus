import { metadata as baseMetadata } from "../metadata";
import TimetablePage from "@/components/TimetablePage";
import { Suspense } from "react";

export const metadata = {
  ...baseMetadata,
  title: "대치 위더스 학원",
  description: "위더스 학원 일반고 시간표 - 고1, 고2, 고3",
};

export default function ScheduleGeneralPage() {
  return (
    <Suspense fallback={null}>
      <TimetablePage currentSchool="general" />
    </Suspense>
  );
}
