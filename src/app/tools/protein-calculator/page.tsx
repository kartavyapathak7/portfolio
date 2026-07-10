import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProteinCalculator } from "@/components/tools/protein/ProteinCalculator";
import { SITE_URL, PROTEIN_FAQS } from "@/lib/tools/config";
import { proteinCalculatorJsonLd, proteinFaqJsonLd } from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "Protein Intake Calculator",
  description:
    "Calculate your ideal daily protein intake based on your weight, fitness goals and activity level. Free online protein calculator by Kartavya Pathak.",
  alternates: { canonical: `${SITE_URL}/tools/protein-calculator` },
  openGraph: {
    title: "Protein Intake Calculator | Kartavya Pathak",
    description:
      "Calculate your ideal daily protein intake based on your weight, fitness goals and activity level. Free and science-based.",
    url: `${SITE_URL}/tools/protein-calculator`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Protein Intake Calculator | Kartavya Pathak",
    description:
      "Calculate your ideal daily protein intake based on your weight, fitness goals and activity level. Free and science-based.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function ProteinCalculatorPage() {
  const appLd = proteinCalculatorJsonLd();
  const faqLd = proteinFaqJsonLd(PROTEIN_FAQS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <SiteHeader variant="tools" />
      {/* pt-16 = exact header height; avoids content jumping under fixed bar */}
      <main className="pt-16 pb-20 px-4 sm:px-6 min-h-screen">
        <div className="py-12">
          <ProteinCalculator />
        </div>
      </main>
    </>
  );
}
