"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LayoutGrid, ChevronRight } from "lucide-react";

const menuItems = [
  {
    label: "전체보기",
    href: "/",
    children: undefined,
  },
  {
    label: "시간표",
    href: "/schedule",
    children: ["대원외고", "한영외고", "일반고", "개인팀 수업"],
  },
  {
    label: "강사진 소개",
    href: "/instructors",
    children: ["대원외고", "한영외고", "일반고"],
  },
  {
    label: "설명회",
    href: "/info-session",
    children: ["외고", "일반고"],
  },
  {
    label: "공지사항",
    href: "/notice",
    children: [
      { label: "공지게시판", href: "/notice" },
      { label: "오시는 길", href: "/campus" },
      { label: "시설 안내", href: "/academy" },
    ] as const,
  },
] as const;

type SubmenuLink = { readonly label: string; readonly href: string };

function isSubmenuLinks(
  children: readonly unknown[] | undefined
): children is readonly SubmenuLink[] {
  return (
    children !== undefined &&
    children.length > 0 &&
    typeof children[0] === "object" &&
    children[0] !== null &&
    "href" in children[0]
  );
}

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTopMenu, setActiveTopMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const openTriggeredRef = useRef(false);

  const closeDropdown = () => {
    setDropdownOpen(false);
    setActiveTopMenu(null);
  };

  const handleTopMenuClick = (label: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (dropdownOpen && activeTopMenu === label) {
      closeDropdown();
      return;
    }
    openTriggeredRef.current = true;
    setDropdownOpen(true);
    setActiveTopMenu(label);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (openTriggeredRef.current) {
        openTriggeredRef.current = false;
        return;
      }
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    }
    if (dropdownOpen) {
      const t = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);
      return () => {
        clearTimeout(t);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [dropdownOpen]);

  return (
    <nav
      ref={navRef}
      className="relative sticky top-[72px] z-[100] w-full bg-withus-navy sm:top-[84px]"
    >
      <div className="mx-auto flex h-[60px] max-w-7xl items-center">
        <ul className="flex h-full w-full flex-1">
          {menuItems.map((item, index) => {
            const hasChildren =
              item.children !== undefined &&
              Array.isArray(item.children) &&
              item.children.length > 0;
            const opensAllMenu = item.label === "전체보기";
            const canOpenDropdown = hasChildren || opensAllMenu;
            const navButtonClass =
              "group/menu relative flex h-full flex-1 items-center justify-center gap-1.5 border-b-2 border-transparent font-gmarket font-medium text-white transition-all duration-300 ease-out hover:border-withus-cta hover:bg-white/15 hover:text-withus-cta focus:outline-none focus-visible:ring-2 focus-visible:ring-withus-cta focus-visible:ring-offset-2 focus-visible:ring-offset-withus-navy active:scale-[0.98] text-[17px] sm:gap-2 sm:text-[19px] md:text-[20px]";
            const hideOnMobile = item.label === "전체보기";

            return (
              <li
                key={item.href}
                className={`${hideOnMobile ? "hidden sm:flex" : "flex"} h-full flex-1`}
              >
                {canOpenDropdown ? (
                  <>
                    <Link
                      href={item.href}
                      className={`flex flex-1 sm:hidden ${navButtonClass}`}
                      onClick={closeDropdown}
                    >
                      {index === 0 && (
                        <LayoutGrid className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover/menu:scale-110 sm:h-4 sm:w-4" aria-hidden />
                      )}
                      <span className="transition-all duration-300 group-hover/menu:tracking-wide group-hover/menu:font-medium">
                        {item.label}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleTopMenuClick(item.label, e)}
                      onPointerDown={(e) => e.stopPropagation()}
                      className={`hidden w-full cursor-pointer sm:flex ${navButtonClass}`}
                      aria-expanded={dropdownOpen && activeTopMenu === item.label}
                      aria-haspopup="true"
                    >
                      {index === 0 && (
                        <LayoutGrid className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover/menu:scale-110 sm:h-4 sm:w-4" aria-hidden />
                      )}
                      <span className="transition-all duration-300 group-hover/menu:tracking-wide group-hover/menu:font-medium">
                        {item.label}
                      </span>
                    </button>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex flex-1 ${navButtonClass}`}
                    onClick={closeDropdown}
                  >
                    {index === 0 && (
                      <LayoutGrid className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover/menu:scale-110 sm:h-4 sm:w-4" aria-hidden />
                    )}
                    <span className="transition-all duration-300 group-hover/menu:tracking-wide group-hover/menu:font-medium">
                      {item.label}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {dropdownOpen && (
        <div
          className="fixed inset-0 top-[calc(72px+60px)] z-[90] hidden sm:block sm:top-[calc(84px+60px)]"
          aria-hidden
          onClick={closeDropdown}
        />
      )}

      {dropdownOpen && (
      <div
        className="absolute left-0 right-0 top-full z-[95] w-full border-t border-white/20 bg-withus-navy shadow-lg hidden sm:block"
        aria-hidden={false}
      >
        <div className="mx-auto flex max-w-7xl">
              {menuItems.map((item, index) => (
                <div
                  key={item.href}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-start pt-4 pb-4 text-center ${
                    index > 0 ? "border-r border-white/20" : ""
                  }`}
                >
                  {item.children === undefined ? (
                    <Link
                      href={item.href}
                      className="flex items-center justify-center rounded-lg py-2 px-3 text-sm text-white/90 transition-all duration-200 hover:bg-white/15 hover:text-withus-cta hover:shadow-sm sm:text-base"
                      onClick={closeDropdown}
                    >
                      {item.label}
                    </Link>
                  ) : item.children.length > 0 && isSubmenuLinks(item.children) ? (
                    <ul className="flex flex-col items-center gap-0.5 px-4 text-center">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="group flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-sm text-white/90 transition-all duration-200 hover:bg-white/15 hover:text-withus-cta hover:shadow-sm sm:text-base"
                            onClick={closeDropdown}
                          >
                            <ChevronRight className="h-3.5 w-0 shrink-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:w-[14px] group-hover:opacity-100" aria-hidden />
                            <span className="transition-transform duration-200 group-hover:translate-x-0.5">{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : item.children.length > 0 ? (
                    <ul className="flex flex-col items-center gap-0.5 px-4 text-center">
                      {(item.children as readonly string[]).map((child) => {
                        const scheduleSlugMap: Record<string, string> = {
                          대원외고: "daewon",
                          한영외고: "hanyoung",
                          일반고: "general",
                          "개인팀 수업": "private",
                        };
                        const instructorSlugMap: Record<string, string> = {
                          "대원외고": "daewon",
                          "한영외고": "hanyoung",
                          "일반고": "general",
                        };
                        const href =
                          item.href === "/schedule" && scheduleSlugMap[child]
                            ? `/schedule/${scheduleSlugMap[child]}`
                            : item.href === "/instructors" && instructorSlugMap[child]
                              ? `/instructors?tab=${instructorSlugMap[child]}`
                              : `${item.href}?tab=${encodeURIComponent(child)}`;
                        return (
                          <li key={child}>
                            <Link
                              href={href}
                              className="group flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-sm text-white/90 transition-all duration-200 hover:bg-white/15 hover:text-withus-cta hover:shadow-sm sm:text-base"
                              onClick={closeDropdown}
                            >
                              <ChevronRight className="h-3.5 w-0 shrink-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:w-[14px] group-hover:opacity-100" aria-hidden />
                              <span className="transition-transform duration-200 group-hover:translate-x-0.5">{child}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center justify-center rounded-lg py-2 px-3 text-sm text-white/90 transition-all duration-200 hover:bg-white/15 hover:text-withus-cta hover:shadow-sm sm:text-base"
                      onClick={closeDropdown}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
      </div>
      )}
    </nav>
  );
}
