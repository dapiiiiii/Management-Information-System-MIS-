"use client";

import { useEffect, useRef, useState } from "react";
import { navItems, site } from "@/content/site";
import { MobileNavAuth, NavAuthControls } from "@/features/auth/components/NavAuth";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Hairline and backdrop appear once the page has moved, and the bar takes
  // the tone of whichever section is directly beneath it.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      const below = document.elementFromPoint(window.innerWidth / 2, 80);
      setOnDark(Boolean(below?.closest("[data-tone='dark']")));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const dark = onDark && !open;

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Mobile menu: lock scroll, close on Escape or when the layout widens.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = (event: MediaQueryListEvent) => event.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300",
        dark
          ? cn("on-dark", scrolled ? "border-paper/10 bg-forest-deep/90 backdrop-blur-md" : "border-transparent bg-forest-deep")
          : scrolled || open
            ? "border-line bg-paper/90 backdrop-blur-md supports-[backdrop-filter]:bg-paper/80"
            : "border-transparent bg-paper",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-forest focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      <Container className="flex h-[72px] items-center justify-between gap-6">
        <a href="#overview" className="rounded-md" aria-label={`${site.shortName}, ${site.name}: back to top`}>
          <Logo inverse={dark} />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative block rounded-md px-3 py-2 text-[14.5px] transition-colors duration-200",
                      "after:absolute after:inset-x-3 after:-bottom-[17px] after:h-[2px] after:origin-left after:transition-transform after:duration-300",
                      dark ? "after:bg-sun" : "after:bg-forest",
                      isActive ? "after:scale-x-100" : "after:scale-x-0",
                      dark
                        ? isActive
                          ? "text-paper"
                          : "text-paper/65 hover:text-paper"
                        : isActive
                          ? "text-ink"
                          : "text-muted hover:text-ink",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <NavAuthControls tone={dark ? "dark" : "light"} />
          <button
            ref={menuButton}
            type="button"
            className={cn(
              "-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors lg:hidden",
              dark ? "text-paper" : "text-ink",
            )}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-[73px] bottom-0 overflow-y-auto bg-paper lg:hidden"
      >
        <Container className="flex min-h-full flex-col pb-10 pt-4">
          <nav aria-label="Mobile">
            <ul className="divide-y divide-line border-b border-line">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 text-[22px] font-medium tracking-[-0.015em] font-stretch-semi-condensed text-ink"
                  >
                    {item.label}
                    {active === item.id ? <span className="h-1.5 w-1.5 rounded-full bg-sun" aria-hidden="true" /> : null}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto pt-10">
            <MobileNavAuth onNavigate={() => setOpen(false)} />
          </div>
          <p className="mt-6 text-label text-muted">{site.name}</p>
        </Container>
      </div>
    </header>
  );
}
