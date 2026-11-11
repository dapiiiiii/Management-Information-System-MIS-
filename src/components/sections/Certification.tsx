import { specimen } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { QrCode } from "@/components/ui/QrCode";
import { Reveal } from "@/components/ui/Reveal";

const assurances = [
  {
    title: "Unique certificate ID",
    body: "Every certificate traces back to the trainee's assessed record.",
  },
  {
    title: "QR verification",
    body: "Scanning the code opens the certificate's verification page.",
  },
  {
    title: "Public verification",
    body: "Employers and partners can confirm a credential without an account.",
  },
];

export function Certification() {
  return (
    <section
      id="certification"
      aria-labelledby="certification-title"
      className="border-y border-line bg-paper-2 py-24 sm:py-28 lg:py-36"
    >
      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <h2
            id="certification-title"
            className="text-title font-medium font-stretch-semi-condensed text-balance text-ink"
          >
            Certification You Can Verify
          </h2>
          <p className="mt-6 max-w-[48ch] text-body text-muted">
            Certificates are generated from assessed results, not typed by hand. Each one carries a unique ID
            and a QR code linked to a public verification page, so anyone relying on a credential can check it
            for themselves.
          </p>

          <dl className="mt-10 divide-y divide-line border-y border-line">
            {assurances.map((item) => (
              <div key={item.title} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-6">
                <dt className="text-[15px] font-medium text-ink">{item.title}</dt>
                <dd className="text-small text-muted">{item.body}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 flex items-center gap-2.5 text-[15px] font-medium text-forest">
            <Icon name="shieldCheck" className="h-5 w-5" />
            Verify credentials with confidence.
          </p>
        </Reveal>

        <Reveal delay={140} className="lg:col-span-7">
          <CertificatePreview />
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * A specimen certificate. Sized with container query units so it scales
 * like a printed document at every screen width.
 */
function CertificatePreview() {
  return (
    <figure className="relative sm:pb-[72px] lg:pl-6">
      <div className="@container">
        <div className="relative w-full rounded-[3px] bg-[#fdfdfa] p-[max(8px,2.4cqw)] shadow-paper @min-[540px]:aspect-[1.414/1]">
          <div className="relative flex h-full flex-col border border-forest/25 px-[max(18px,5.5cqw)] pb-[max(18px,4.2cqw)] pt-[max(20px,4.6cqw)] outline outline-1 -outline-offset-[max(5px,1.1cqw)] outline-forest/10">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-[max(8px,1.6cqw)]">
                <LogoMark className="h-[max(24px,4.4cqw)] w-[max(24px,4.4cqw)]" />
                <p className="text-[length:max(10px,1.55cqw)] leading-tight text-muted">
                  Training, Certification &amp; Employment
                  <br />
                  Solar PV Programme
                </p>
              </div>
              <span className="rounded-[3px] border border-sun/60 px-[max(6px,1.2cqw)] py-[max(2px,0.45cqw)] text-[length:max(9px,1.35cqw)] font-medium tracking-[0.14em] text-[#8a6416]">
                SPECIMEN
              </span>
            </div>

            {/* Body */}
            <div className="mt-[max(22px,4.2cqw)] @min-[540px]:max-w-[70%]">
              <p className="text-[length:max(11px,1.75cqw)] font-medium tracking-[0.02em] text-leaf">
                Certificate of Competence
              </p>
              <p className="mt-[max(10px,2.2cqw)] text-[length:max(11px,1.6cqw)] text-muted">This certifies that</p>
              <p className="mt-[max(2px,0.6cqw)] text-[length:max(24px,5.4cqw)] font-medium leading-[1.05] tracking-[-0.02em] font-stretch-semi-condensed text-ink">
                {specimen.trainee}
              </p>
              <p className="mt-[max(8px,1.6cqw)] text-[length:max(11px,1.6cqw)] text-muted">
                has met the assessed requirements for
              </p>
              <p className="mt-[max(2px,0.5cqw)] text-[length:max(14px,2.5cqw)] font-medium leading-tight text-forest">
                {specimen.qualification}
              </p>
              <p className="mt-[max(3px,0.6cqw)] text-[length:max(10.5px,1.45cqw)] text-muted">
                Theory and practical assessment
              </p>
            </div>

            {/* Seal (wide certificates only) */}
            <div className="absolute right-[5.5cqw] top-[15cqw] hidden h-[12.5cqw] w-[12.5cqw] items-center justify-center rounded-full border border-sun/70 @min-[540px]:flex">
              <div className="flex h-[10.4cqw] w-[10.4cqw] flex-col items-center justify-center rounded-full border border-sun/40 text-center">
                <svg viewBox="0 0 32 20" className="w-[5cqw]" aria-hidden="true">
                  <path d="M4.5 16.5a11.5 11.5 0 0 1 23 0" fill="none" stroke="var(--color-sun)" strokeWidth="1.4" />
                  <path d="M2 16.5h28" stroke="var(--color-forest)" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="24.1" cy="8.4" r="2.3" fill="var(--color-sun)" />
                </svg>
                <span className="mt-[0.5cqw] text-[length:max(7px,1cqw)] font-medium tracking-[0.12em] text-[#8a6416]">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-[max(22px,2cqw)]">
              <div className="flex items-end justify-between gap-[max(14px,3cqw)] border-t border-line pt-[max(12px,2.6cqw)]">
                <dl className="grid flex-1 grid-cols-1 gap-[max(10px,2.4cqw)] @min-[400px]:grid-cols-2 @min-[540px]:grid-cols-3">
                  <div>
                    <dt className="text-[length:max(10px,1.3cqw)] text-muted">Certificate ID</dt>
                    <dd className="mt-[max(2px,0.4cqw)] text-[length:max(11.5px,1.6cqw)] font-medium tabular-nums tracking-[0.01em] text-ink">
                      {specimen.certificateId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[length:max(10px,1.3cqw)] text-muted">Date of issue</dt>
                    <dd className="mt-[max(2px,0.4cqw)] text-[length:max(11.5px,1.6cqw)] font-medium text-ink">
                      {specimen.issued}
                    </dd>
                  </div>
                  <div className="hidden @min-[540px]:block">
                    <dt className="text-[length:max(10px,1.3cqw)] text-muted">Authorised by</dt>
                    <dd className="mt-[max(2px,0.4cqw)] text-[length:max(11.5px,1.6cqw)] font-medium text-ink">
                      Programme Coordinator
                    </dd>
                  </div>
                </dl>
                <div className="flex shrink-0 flex-col items-center">
                  <QrCode
                    className="h-[max(68px,10.5cqw)] w-[max(68px,10.5cqw)] text-ink"
                    label={`QR code for certificate ${specimen.certificateId}`}
                  />
                  <span className="mt-[max(4px,0.6cqw)] text-[length:max(9.5px,1.15cqw)] text-muted">Scan to verify</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification result, as a public visitor would see it */}
      <div className="relative mx-4 -mt-4 flex items-start gap-3 rounded-[10px] border border-line/70 bg-surface p-4 shadow-float sm:absolute sm:bottom-0 sm:right-[-12px] sm:m-0 sm:w-[300px] lg:-right-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-paper">
          <Icon name="shieldCheck" className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="text-[14.5px] font-medium text-ink">Certificate is valid</p>
          <p className="mt-0.5 text-[13px] leading-snug text-muted">
            {specimen.certificateId}, issued {specimen.issued} to {specimen.trainee}.
          </p>
        </div>
      </div>

      <figcaption className="sr-only">
        Specimen digital certificate for {specimen.trainee}, {specimen.qualification}, certificate ID{" "}
        {specimen.certificateId}, issued {specimen.issued}, with a QR code for public verification.
      </figcaption>
    </figure>
  );
}
