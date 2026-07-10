import { SITE_URL } from "@/lib/tools/config";

export function proteinCalculatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Protein Intake Calculator",
    url: `${SITE_URL}/tools/protein-calculator`,
    applicationCategory: "HealthApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: {
      "@type": "Person",
      name: "Kartavya Pathak",
      url: SITE_URL,
    },
    description:
      "Free protein intake calculator based on body weight, activity level and fitness goals.",
  };
}

export function proteinFaqJsonLd(
  faqs: readonly { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function toolsHubJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Online Fitness & Developer Tools",
    url: `${SITE_URL}/tools`,
    description:
      "Simple, fast and free fitness and developer tools built by Kartavya Pathak.",
    author: {
      "@type": "Person",
      name: "Kartavya Pathak",
      url: SITE_URL,
    },
  };
}
