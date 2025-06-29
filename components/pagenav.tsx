"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const ICON_SIZE = 20;

const pages = {
  home: {
    route: "/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
      </svg>
    ),
    label: "Home",
  },
  clubs: {
    route: "/clubs",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
      </svg>
    ),
    label: "Clubs",
  },
  events: {
    route: "/events",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill="currentColor"
        className="bi bi-calendar-week-fill"
        viewBox="0 0 16 16"
      >
        <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5m3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5M2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5" />
      </svg>
    ),
    label: "Groups",
  },
  users: {
    route: "/admin/users",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill="currentColor"
        className="bi bi-wrench-adjustable-circle"
        viewBox="0 0 16 16"
      >
        <path d="M12.496 8a4.5 4.5 0 0 1-1.703 3.526L9.497 8.5l2.959-1.10q.04.3.04.61" />
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-1 0a7 7 0 1 0-13.202 3.249l1.988-1.657a4.5 4.5 0 0 1 7.537-4.623L7.497 6.5l1 2.5 1.333 3.11c-.56.251-1.18.39-1.833.39a4.5 4.5 0 0 1-1.592-.29L4.747 14.2A7 7 0 0 0 15 8m-8.295.139a.25.25 0 0 0-.288-.376l-1.5.5.159.474.808-.27-.595.894a.25.25 0 0 0 .287.376l.808-.27-.595.894a.25.25 0 0 0 .287.376l1.5-.5-.159-.474-.808.27.596-.894a.25.25 0 0 0-.288-.376l-.808.27z" />
      </svg>
    ),
    label: "Users",
  },
  me: {
    route: "/me",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill="currentColor"
        className="bi bi-person-fill"
        viewBox="0 0 16 16"
      >
        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
      </svg>
    ),
    label: "Me",
  },
  podcast: {
    route: "/est",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
      </svg>
    ),
    label: "Podcast",
  },
};

const tabs = [pages.podcast, pages.events, pages.home, pages.clubs, pages.me];

export const PageNav = () => {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(() =>
    tabs.find((page) => page.route === pathname),
  );

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [highlightStyle, setHighlightStyle] = useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const newPage = tabs.find((page) => page.route === pathname);
    setCurrentPage(newPage);

    if (newPage) {
      const index = tabs.indexOf(newPage);
      const el = itemRefs.current[index];
      if (el) {
        const parentRect = el.parentElement?.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        if (parentRect) {
          const left = elRect.left - parentRect.left;
          const width = elRect.width;
          setHighlightStyle({ left, width });
        } else {
          setHighlightStyle({ left: el.offsetLeft, width: el.offsetWidth });
        }
      }
    }
  }, [pathname]);

  return (
    <div className="myglass fixed bottom-6 z-50 w-auto items-center rounded-full p-2 shadow-xl md:hidden">
      <div className="relative mx-auto flex h-full max-w-lg items-center justify-around gap-3.5 font-medium">
        <motion.div
          className="absolute bottom-0 top-0 rounded-full bg-selfprimary-100"
          animate={{ left: highlightStyle.left, width: highlightStyle.width }}
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ position: "absolute" }}
        />
        {tabs.map((page, index) => {
          const isActive = currentPage === page;
          return (
            <Link
              key={index}
              href={page.route}
              aria-current={isActive ? "page" : undefined}
              className="relative inline-flex flex-col items-center justify-center p-3.5"
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
            >
              <div
                className={`text-xl ${
                  isActive
                    ? "text-selfprimary-700"
                    : "text-foreground hover:text-selfprimary-700"
                }`}
              >
                {page.icon}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
