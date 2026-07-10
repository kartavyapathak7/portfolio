import type { Metadata } from "next";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";

export const metadata: Metadata = {
  title: "Software Engineer",
  description:
    "Kartavya Pathak — CSE student at MSRIT. Python developer, AI automation enthusiast and 120 WPM typist.",
  openGraph: {
    title: "Kartavya Pathak | Software Engineer",
    url: "https://kartavyapathak.com",
  },
};

export default function HomePage() {
  return <PortfolioPage />;
}
