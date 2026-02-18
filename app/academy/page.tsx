import Image from "next/image";
import gallery01 from "@/public/asset/gallery01.png";
import gallery02 from "@/public/asset/gallery02.png";
import gallery03 from "@/public/asset/gallery03.png";
import gallery04 from "@/public/asset/gallery04.png";
import gallery05 from "@/public/asset/gallery05.png";

export const metadata = {
  title: "대치 위더스 학원",
  description: "위더스 학원의 교육 철학과 학원 시설을 소개합니다.",
};

const galleryImages = [
  { src: gallery01, alt: "위더스 학원 시설 이미지 1" },
  { src: gallery02, alt: "위더스 학원 시설 이미지 2" },
  { src: gallery03, alt: "위더스 학원 시설 이미지 3" },
  { src: gallery04, alt: "위더스 학원 시설 이미지 4" },
  { src: gallery05, alt: "위더스 학원 시설 이미지 5" },
];

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-cool-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <header className="mb-16 text-center">
          <p className="font-sans text-2xl font-bold tracking-tight text-[#0a1e40] md:text-3xl lg:text-4xl">
            위더스 학원을 소개합니다.
          </p>
        </header>

        <section>
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {galleryImages.map((image) => (
              <figure key={image.alt} className="mb-5 break-inside-avoid">
                <Image src={image.src} alt={image.alt} className="h-auto w-full" />
              </figure>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
