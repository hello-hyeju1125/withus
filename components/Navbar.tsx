"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LayoutGrid, ChevronRight } from "lucide-react";

// 수정 불가능한 핵심 메뉴 데이터
const menuItems = [
  {
    label: "전체보기",
    href: "/",
    children: undefined,
  },
  {
    label: "시간표",
    href: "/schedule",
    children: ["대원외고", "한영외고", "일반고", "개인팀수업"],
  },
  {
    label: "설명회",
    href: "/info-session",
    children: ["외고", "일반고"],
  },
  {
    label: "공지사항",
    href: "/notice",
    children: ["공지 및 안내", "학원 소개"],
  },
  {
    label: "오시는길",
    href: "/campus",
    children: ["프리미엄관", "M관", "입시관"],
  },
] as const;

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTopMenu, setActiveTopMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const closeDropdown = () => {
    setDropdownOpen(false);
    setActiveTopMenu(null);
  };

  const handleTopMenuClick = (label: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (dropdownOpen && activeTopMenu === label) {
      closeDropdown();
      return;
    }

    setDropdownOpen(true);
    setActiveTopMenu(label);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    }
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  return (
    <nav
      ref={navRef}
      className="sticky top-[92px] z-[100] w-full bg-[#002761] sm:top-[106px]"
    >
      {/* Top Bar - height 80px */}
      <div className="mx-auto flex h-[60px] max-w-7xl items-center">
        <ul className="flex h-full w-full flex-1">
          {menuItems.map((item, index) => {
            const hasChildren =
              item.children !== undefined && Array.isArray(item.children) && (item.children as readonly string[]).length > 0;
            const opensAllMenu = item.label === "전체보기" || item.label === "공지사항";
            const canOpenDropdown = hasChildren || opensAllMenu;
            const navButtonClass =
              "group/menu relative flex h-full flex-1 items-center justify-center gap-1.5 border-b-2 border-transparent font-semibold text-white transition-all duration-300 ease-out hover:border-withus-gold hover:bg-white/25 hover:text-withus-gold hover:shadow-[inset_0_0_20px_rgba(254,246,0,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-withus-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#002761] active:scale-[0.98] text-sm sm:gap-2 sm:text-[16pt] sm:font-normal";
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
                      className={`hidden w-full sm:flex ${navButtonClass}`}
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

      {/* Backdrop - blocks clicks to main content when dropdown is open */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 top-[calc(92px+60px)] z-[90] hidden sm:block sm:top-[calc(106px+60px)]"
          aria-hidden
          onClick={closeDropdown}
        />
      )}

      {/* Full Dropdown Panel - absolute overlay so it appears above main content */}
      <div
        className={`absolute left-0 right-0 top-full z-[95] w-full border-t border-white/20 bg-[#002761] shadow-lg transition-all duration-300 ease-out ${
          dropdownOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        } hidden sm:block`}
        aria-hidden={!dropdownOpen}
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
                      className="flex items-center justify-center rounded-lg py-2 px-3 text-xs text-white/90 transition-all duration-200 hover:bg-white/15 hover:text-withus-gold hover:shadow-sm sm:text-sm"
                      onClick={closeDropdown}
                    >
                      전체보기
                    </Link>
                  ) : item.children.length > 0 ? (
                    <ul className="flex flex-col items-center gap-0.5 px-4 text-center">
                      {(item.children as readonly string[]).map((child) => {
                        const scheduleSlugMap: Record<string, string> = {
                          대원외고: "daewon",
                          한영외고: "hanyoung",
                          일반고: "general",
                          개인팀수업: "private",
                        };
                        const campusSlugMap: Record<string, string> = {
                          프리미엄관: "premium",
                          M관: "m",
                          입시관: "entrance",
                        };
                        const href =
                          item.href === "/schedule" && scheduleSlugMap[child]
                            ? `/schedule/${scheduleSlugMap[child]}`
                            : item.href === "/campus" && campusSlugMap[child]
                              ? `/campus?tab=${campusSlugMap[child]}`
                              : item.href === "/notice"
                                ? child === "학원 소개"
                                  ? "/academy"
                                  : "/notice"
                              : `${item.href}?tab=${encodeURIComponent(child)}`;
                        return (
                          <li key={child}>
                            <Link
                              href={href}
                              className="group flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs text-white/90 transition-all duration-200 hover:bg-white/15 hover:text-withus-gold hover:shadow-sm sm:text-sm"
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
                    /* 공지사항: 기본 링크 */
                    <Link
                      href={item.href}
                      className="flex items-center justify-center rounded-lg py-2 px-3 text-xs text-white/90 transition-all duration-200 hover:bg-white/15 hover:text-withus-gold hover:shadow-sm sm:text-sm"
                      onClick={closeDropdown}
                    >
                      공지 및 안내
                    </Link>
                  )}
                </div>
              ))}
            </div>
      </div>
    </nav>
  );
}
