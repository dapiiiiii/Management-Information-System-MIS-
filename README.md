# TCE MIS: public homepage

The public homepage for the **Training, Certification & Employment Management Information System**, built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4. It has no runtime dependencies beyond those three.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure

```
src/
  app/            layout (fonts, metadata), page, global tokens (globals.css), icon
  content/site.ts all copy, navigation, links and specimen data, in one place
  components/
    layout/       Navbar (switches tone over dark sections), Footer
    sections/     Hero, CapabilityStrip, Lifecycle, Capabilities + CapabilityCard,
                  DataToImpact, OfflineSync, Certification, OutcomesTimeline, FinalCta
    ui/           Button, Container, Icon, Logo, QrCode, Reveal, SectionIntro
  hooks/          useStepSequence (plays a step illustration once, then hands control to the visitor)
  assets/         photography (cropped and toned)
```

Design tokens (colours, type scale, motion) live in `src/app/globals.css` under `@theme`.

## Before launch

- **Access Platform link:** set `NEXT_PUBLIC_PLATFORM_URL` to the platform's sign-in URL. It falls back to `#`.
- **Privacy, Terms, Contact:** these point to `#` in `src/content/site.ts` until those pages exist.
- **Photography:** both images are openly licensed placeholders. Replace them with the programme's own documentary photography when it is available, and update `photoCredits` in `site.ts`.
  - Solar training lab: USAID in Africa, public domain.
  - Field workshop: UN Women/Laura Cleary, CC BY-SA 2.0 (cropped and toned). The credit must stay visible while the image is used.
  If you replace the hero photo, re-check the positions of the three annotation pins in `Hero.tsx`. They are percentages of the photo.
- **Specimen data:** the trainee name, certificate ID and attendance names are illustrative and labelled as samples.

## Accessibility and motion

Every animation respects `prefers-reduced-motion`. Content is rendered visible on the server; scroll reveals only hide elements that are below the fold after hydration, so nothing is hidden if JavaScript fails. Interactive steps are real buttons with `aria-pressed`, and focus styles are visible on both light and dark backgrounds.
