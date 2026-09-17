import Image from "next/image";
import type { Project } from "@/content/projects";
import { ArrowUpRight } from "./Icons";
import { cx } from "@/lib/utils";

/**
 * A live product, framed. The chrome carries the real domain because that is
 * the proof: these are sites you can open, not mockups.
 */
export function ProjectFrame({
  project,
  className,
  priority = false,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
}) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ouvrir ${project.name} sur ${project.domain} (nouvelle fenêtre)`}
      className={cx(
        "group block rounded-[7px] focus-visible:outline-offset-4",
        className,
      )}
    >
      <figure
        className={cx(
          "overflow-hidden rounded-[7px] border border-rule bg-surface",
          "shadow-[0_1px_2px_#0b1a2112,0_16px_38px_-26px_#0b1a2159]",
          "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:-translate-y-1 group-hover:border-[#0b1a2130]",
          "group-hover:shadow-[0_2px_4px_#0b1a2114,0_30px_60px_-30px_#0b1a2173]",
        )}
      >
        {/* Chrome */}
        <div className="flex items-center gap-3 border-b border-rule bg-wash/70 px-3 py-2.5 sm:px-4">
          <span className="flex shrink-0 gap-[5px]" aria-hidden="true">
            <span className="size-[7px] rounded-[1px] bg-[#0b1a2124]" />
            <span className="size-[7px] rounded-[1px] bg-[#0b1a2124]" />
            <span className="size-[7px] rounded-[1px] bg-[#0b1a2124]" />
          </span>

          <span className="min-w-0 flex-1 truncate rounded-[3px] border border-rule bg-paper px-2.5 py-1 font-mono text-xs text-ink-mute">
            {project.domain}
          </span>

          <ArrowUpRight
            className="size-4 shrink-0 text-ink-mute transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-prussian"
            aria-hidden="true"
          />
        </div>

        {/* The product */}
        <div className="relative overflow-hidden bg-paper">
          <Image
            src={project.shot.src}
            alt={project.shot.alt}
            preload={priority}
            placeholder="blur"
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="block h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.018]"
          />
        </div>
      </figure>
    </a>
  );
}
