import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ToolCard } from "@/components/tools/ToolCard";
import { ComingSoonToolCard } from "@/components/tools/ComingSoonToolCard";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight, ArrowLeft } from "@/components/ui/Icons";
import { LIVE_TOOLS, COMING_SOON_TOOLS, SITE_URL } from "@/lib/tools/config";
import { toolsHubJsonLd } from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "Free Online Fitness & Developer Tools",
  description:
    "A growing collection of free fitness, developer and productivity tools built by Kartavya Pathak. Start with the Protein Intake Calculator.",
  alternates: { canonical: `${SITE_URL}/tools` },
  openGraph: {
    title: "Free Online Tools | Kartavya Pathak",
    description:
      "A growing collection of free fitness, developer and productivity tools built by Kartavya Pathak.",
    url: `${SITE_URL}/tools`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools | Kartavya Pathak",
    description:
      "A growing collection of free fitness, developer and productivity tools built by Kartavya Pathak.",
  },
  robots: { index: true, follow: true },
};

export default function ToolsPage() {
  const jsonLd = toolsHubJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader variant="tools" />

      <div className="min-h-screen pt-20">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6"
          aria-labelledby="tools-hero-heading"
        >
          {/* Background blobs */}
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-site-accent/[0.04] blur-3xl" />
            <div className="absolute top-1/3 right-0 w-[400px] h-[300px] rounded-full bg-site-orange/[0.04] blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            {/* Eyebrow */}
            <Badge variant="accent" className="mb-7 px-4 py-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-site-accent animate-pulse" aria-hidden="true" />
              Built by Kartavya Pathak · 100% Free
            </Badge>

            <h1
              id="tools-hero-heading"
              className="font-display text-6xl sm:text-7xl md:text-8xl tracking-wide mb-5 leading-none text-balance"
            >
              Free{" "}
              <span className="text-site-accent">Online</span>
              <br />
              Tools
            </h1>

            <p className="text-site-muted text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto text-balance">
              A growing collection of fitness, developer and productivity tools.
              No sign-up. No cost. Ever.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/tools/protein-calculator"
                className="inline-flex items-center justify-center gap-2.5 bg-site-accent text-site-bg font-bold px-7 py-3.5 rounded-xl transition-all hover:shadow-glow hover:-translate-y-px text-sm focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:outline-none"
              >
                <span aria-hidden="true">🥩</span>
                Open Protein Calculator
                <ArrowUpRight size={14} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 border border-site-border text-site-muted font-medium px-7 py-3.5 rounded-xl transition-all hover:border-site-text hover:text-site-text text-sm focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:outline-none"
              >
                <ArrowLeft size={14} />
                Back to Portfolio
              </Link>
            </div>

            {/* Stats row */}
            <dl className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {[
                { value: LIVE_TOOLS.length.toString(), label: "Tool live" },
                { value: COMING_SOON_TOOLS.length.toString(), label: "Coming soon" },
                { value: "100%", label: "Free forever" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <dt className="font-display text-3xl text-site-accent leading-none">
                    {value}
                  </dt>
                  <dd className="text-xs text-site-muted mt-1 font-mono">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Main content ─────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 space-y-16">
          {/* Available tools */}
          <section aria-labelledby="live-tools-heading">
            <div className="flex items-center gap-3 mb-8">
              <h2
                id="live-tools-heading"
                className="font-display text-2xl sm:text-3xl tracking-wide"
              >
                Available Now
              </h2>
              <Badge variant="green">{LIVE_TOOLS.length} Live</Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {LIVE_TOOLS.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>

          {/* Coming soon */}
          <section aria-labelledby="coming-soon-heading">
            <div className="flex items-center gap-3 mb-8">
              <h2
                id="coming-soon-heading"
                className="font-display text-2xl sm:text-3xl tracking-wide text-site-muted"
              >
                Coming Soon
              </h2>
              <Badge variant="orange">{COMING_SOON_TOOLS.length} In Pipeline</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {COMING_SOON_TOOLS.map((tool) => (
                <ComingSoonToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>

          {/* Suggestion CTA */}
          <section
            className="relative overflow-hidden bg-gradient-to-br from-site-card via-site-card to-site-elevated border border-site-border rounded-2xl p-8 sm:p-12 text-center"
            aria-label="Suggest a tool"
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-site-accent/[0.03] to-transparent pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-widest text-site-accent mb-3">
                Suggestion Box
              </p>
              <h2 className="font-display text-3xl sm:text-4xl tracking-wide mb-4">
                Want a Specific Tool?
              </h2>
              <p className="text-site-muted max-w-md mx-auto mb-8 text-sm leading-relaxed">
                I&apos;m actively building new tools. Have a fitness, developer
                or productivity tool in mind? Drop me a message.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 bg-site-accent text-site-bg font-bold px-6 py-3 rounded-xl hover:shadow-glow hover:-translate-y-px transition-all text-sm focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:outline-none"
              >
                Suggest a Tool
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
