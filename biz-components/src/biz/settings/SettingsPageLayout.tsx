import * as React from "react";
import { ScrollableOverlay } from "@components/ui/ScrollableOverlay";
import { cn } from "@/lib/utils";
import { SETTINGS_DESCRIPTION_CLASS, SETTINGS_PAGE_TITLE_CLASS } from "./SettingsSection";

interface SettingsPageLayoutProps {
  /** Page content */
  children: React.ReactNode;
  /** Optional page title shown above settings content. */
  title?: React.ReactNode;
  /** Optional content rendered before a string/number page title. */
  titleLeading?: React.ReactNode;
  /** Optional content rendered after a string/number page title. */
  titleAccessory?: React.ReactNode;
  /** Optional supporting description under the page title. */
  description?: React.ReactNode;
  /** Optional content rendered at the end of the header row. */
  headerEnd?: React.ReactNode;
  /** Additional className for the content container */
  className?: string;
  /** Additional className for the outer ScrollableOverlay */
  outerClassName?: string;
}

/**
 * Standard layout wrapper for settings page content.
 * UI Kit: max-width 840px, padding 32px vertical / 48px horizontal.
 *
 * Migrated from openchamber sections/shared/SettingsPageLayout.tsx.
 * Decoupling changes:
 *   - Removed `showSaveStatus` prop + SettingsSaveStatus subcomponent (used
 *     `i18n hook` + external persistence store). Callers now render their own
 *     status indicator via `headerEnd` — keeps this component pure layout.
 *   - `@/lib/persistence` dependency dropped.
 */

export const SettingsPageLayout: React.FC<SettingsPageLayoutProps> = ({
  children,
  className,
  outerClassName,
  title,
  titleLeading,
  titleAccessory,
  description,
  headerEnd,
}) => {
  const hasHeader =
    (title !== null && title !== undefined) ||
    (description !== null && description !== undefined) ||
    (headerEnd !== null && headerEnd !== undefined);
  const isPlainTitle = typeof title === "string" || typeof title === "number";
  const hasTitleChrome =
    (titleLeading !== null && titleLeading !== undefined) ||
    (titleAccessory !== null && titleAccessory !== undefined);

  return (
    <ScrollableOverlay outerClassName={cn("h-full", outerClassName)} className="w-full @container">
      <div
        className={cn(
          "mx-auto max-w-[840px] space-y-0 px-6 py-6 @3xl:px-12 @3xl:py-8",
          // The first visible section never needs the top divider, no matter
          // which platform-conditional sections above it rendered null.
          "[&>section:first-of-type]:border-t-0 [&>section:first-of-type]:pt-0",
          className,
        )}
      >
        {hasHeader && (
          <div className="mb-2 flex items-start justify-between gap-4 pb-6">
            <div className="min-w-0 space-y-1">
              {title !== null && title !== undefined ? (
                isPlainTitle ? (
                  hasTitleChrome ? (
                    <div className="flex min-w-0 items-center gap-2">
                      {titleLeading}
                      <h1 className={cn(SETTINGS_PAGE_TITLE_CLASS, "min-w-0 truncate")}>{title}</h1>
                      {titleAccessory}
                    </div>
                  ) : (
                    <h1 className={SETTINGS_PAGE_TITLE_CLASS}>{title}</h1>
                  )
                ) : (
                  title
                )
              ) : null}
              {description !== null && description !== undefined ? (
                typeof description === "string" || typeof description === "number" ? (
                  <p className={SETTINGS_DESCRIPTION_CLASS}>{description}</p>
                ) : (
                  description
                )
              ) : null}
            </div>
            {headerEnd !== null && headerEnd !== undefined ? (
              <div className="flex shrink-0 items-center gap-3">{headerEnd}</div>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </ScrollableOverlay>
  );
};
