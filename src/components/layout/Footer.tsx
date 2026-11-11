import { legalLinks, navItems, photoCredits, site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer data-tone="dark" className="on-dark bg-forest-deep text-paper">
      <Container className="pb-10 pt-20 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Logo inverse />
            <p className="mt-8 text-[15px] font-medium text-paper/85">{site.tagline}</p>
            <p className="mt-3 max-w-[46ch] text-small text-paper/60">
              The management information system for a solar PV training and employment programme, covering
              registration and training through assessment, certification, employment follow-up and impact
              reporting.
            </p>
          </div>

          <nav aria-labelledby="footer-programme" className="lg:col-span-3 lg:col-start-7">
            <h2 id="footer-programme" className="text-label text-paper/50">
              Programme
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 lg:grid-cols-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={item.href} className="text-[15px] text-paper/80 transition-colors hover:text-paper">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-information" className="lg:col-span-3">
            <h2 id="footer-information" className="text-label text-paper/50">
              Information
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 lg:grid-cols-1">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[15px] text-paper/80 transition-colors hover:text-paper">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-paper/10 pt-6 text-[13px] text-paper/45 lg:flex-row lg:items-start lg:justify-between">
          <p>
            &copy; {site.copyrightYear} {site.name}
          </p>
          <ul className="space-y-1 lg:text-right">
            {photoCredits.map((credit) => (
              <li key={credit.href}>
                <a href={credit.href} className="underline-offset-2 hover:text-paper/80 hover:underline">
                  {credit.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
