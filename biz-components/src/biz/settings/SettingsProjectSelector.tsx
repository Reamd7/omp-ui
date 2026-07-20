import * as React from "react";
import { ChevronDown, Folder } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ProjectOption {
  id: string;
  label?: string;
  path: string;
}

interface SettingsProjectSelectorProps {
  /** All available projects (sorted by the caller; component renders in given order). */
  projects: ProjectOption[];
  /** Currently active project id. Null selects nothing. */
  activeProjectId: string | null;
  /** Called when user picks a project. */
  onSelectProject: (id: string) => void;
  className?: string;
  /** Fallback label when project has no label / empty path. @default "Untitled" */
  fallbackProjectLabel?: string;
  /** aria-label for the trigger button. @default "Switch project" */
  switchProjectAriaLabel?: string;
  /** title tooltip for the trigger button. @default "Switch project" */
  switchProjectTitle?: string;
}

const formatProjectLabel = (label: string): string => {
  return label.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Project switcher dropdown for settings pages.
 *
 * Migrated from openchamber sections/shared/SettingsProjectSelector.tsx.
 * Decoupling changes:
 *   - useProjectsStore → controlled props (projects / activeProjectId / onSelectProject)
 *   - i18n hook → 3 hardcoded text props (fallbackProjectLabel / switchProjectAriaLabel / switchProjectTitle)
 *   - isVSCodeRuntime → removed (caller decides whether to mount)
 *   - <Icon name="folder" /> → <Folder />, <Icon name="arrow-down-s" /> → <ChevronDown />
 *   - openchamber typography (ui-label / ui) → standard Tailwind utility (text-sm font-medium)
 */
export const SettingsProjectSelector: React.FC<SettingsProjectSelectorProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  className,
  fallbackProjectLabel = "Untitled",
  switchProjectAriaLabel = "Switch project",
  switchProjectTitle = "Switch project",
}) => {
  const sortedProjects = React.useMemo(() => {
    return [...projects].sort((a, b) => (a.label || a.path).localeCompare(b.label || b.path));
  }, [projects]);

  const activeProject = React.useMemo(() => {
    if (sortedProjects.length === 0) {
      return null;
    }
    return sortedProjects.find((p) => p.id === activeProjectId) ?? sortedProjects[0];
  }, [activeProjectId, sortedProjects]);

  if (sortedProjects.length === 0) {
    return null;
  }

  const rawLabel =
    activeProject?.label && activeProject.label.trim().length > 0
      ? activeProject.label
      : activeProject?.path.split("/").filter(Boolean).pop() ||
        activeProject?.path ||
        fallbackProjectLabel;
  const label = formatProjectLabel(rawLabel);

  return (
    <div className={cn(className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={switchProjectAriaLabel}
            title={switchProjectTitle}
            className={cn(
              "flex h-8 w-full min-w-0 appearance-none items-center gap-1.5 rounded-lg border border-border/80 bg-transparent px-3 py-1 text-left text-foreground outline-none",
              "hover:border-input focus-visible:border-primary/70 focus-visible:ring-1 focus-visible:ring-primary/50",
            )}
          >
            <Folder className="h-4 w-4 opacity-70" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
            <ChevronDown className="size-4 opacity-50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-auto">
          <DropdownMenuRadioGroup
            value={activeProject?.id ?? ""}
            onValueChange={(value) => {
              if (!value) return;
              onSelectProject(value);
            }}
          >
            {sortedProjects.map((project) => {
              const raw = project.label?.trim()
                ? project.label.trim()
                : project.path.split("/").filter(Boolean).pop() || project.path;
              const itemLabel = formatProjectLabel(raw);
              return (
                <DropdownMenuRadioItem key={project.id} value={project.id}>
                  <span className="min-w-0 truncate text-sm">{itemLabel}</span>
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
