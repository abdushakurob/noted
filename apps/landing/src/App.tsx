import {
  BuildBand,
  CloseBand,
  FaqBand,
  FeedbackBand,
  IntelligenceBand,
  PricingBand,
  ShareBand,
  StackBand,
  StagesBand,
  StoryBand,
  TogetherBand,
  ToolsBand,
} from "@/components/page-bands";
import { HeroSection } from "@/components/hero-section";
import { DemoPage } from "@/demo/demo-page";
import { DocsPage } from "@/docs/docs-page";
import SiteFooter from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path === "/demo") return <DemoPage />;
  if (path === "/docs" || path.startsWith("/docs/")) return <DocsPage path={path} />;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main>
        <HeroSection />
        <StoryBand />
        <BuildBand />
        <ShareBand />
        <FeedbackBand />
        <TogetherBand />
        <IntelligenceBand />
        <ToolsBand />
        <StackBand />
        <StagesBand />
        <PricingBand />
        <FaqBand />
        <CloseBand />
      </main>
      <SiteFooter />
    </div>
  );
}
