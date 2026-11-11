import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Capabilities } from "@/components/sections/Capabilities";
import { CapabilityStrip } from "@/components/sections/CapabilityStrip";
import { Certification } from "@/components/sections/Certification";
import { DataToImpact } from "@/components/sections/DataToImpact";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Lifecycle } from "@/components/sections/Lifecycle";
import { OfflineSync } from "@/components/sections/OfflineSync";
import { OutcomesTimeline } from "@/components/sections/OutcomesTimeline";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <CapabilityStrip />
        <Lifecycle />
        <Capabilities />
        <DataToImpact />
        <OfflineSync />
        <Certification />
        <OutcomesTimeline />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
