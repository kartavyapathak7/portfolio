import { Badge } from "@/components/ui/Badge";
import type { ToolDefinition } from "@/lib/tools/config";

interface ComingSoonToolCardProps {
  tool: ToolDefinition;
}

export function ComingSoonToolCard({ tool }: ComingSoonToolCardProps) {
  return (
    <article className="group relative bg-site-card/40 border border-dashed border-site-border/70 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:border-site-border hover:bg-site-card/70 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-200 select-none"
          aria-hidden="true"
        >
          {tool.icon}
        </span>
        <Badge variant="orange">Soon</Badge>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-site-muted group-hover:text-site-text/60 transition-colors duration-200 leading-snug">
          {tool.title}
        </h3>
        <p className="text-site-muted/60 text-xs leading-relaxed mt-1">
          {tool.description}
        </p>
      </div>
    </article>
  );
}
