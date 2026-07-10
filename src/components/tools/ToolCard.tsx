import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight } from "@/components/ui/Icons";
import type { ToolDefinition } from "@/lib/tools/config";

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="group relative bg-site-card border border-site-border rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-site-accent/30 hover:shadow-glow overflow-hidden">
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-site-accent/0 via-transparent to-site-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        aria-hidden="true"
      />

      {/* Live badge */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-4xl select-none" aria-hidden="true">
          {tool.icon}
        </span>
        <Badge variant="green">Live</Badge>
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-semibold text-site-text mb-2 group-hover:text-site-accent transition-colors duration-200 leading-snug">
          {tool.title}
        </h2>
        <p className="text-site-muted text-sm leading-relaxed">
          {tool.description}
        </p>
      </div>

      <Link
        href={tool.href}
        className="inline-flex items-center justify-center gap-2 bg-site-accent text-site-bg font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-glow hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-2 focus-visible:ring-offset-site-card focus-visible:outline-none"
        aria-label={`Open ${tool.title}`}
      >
        Open Tool
        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </article>
  );
}
