import type { ReactNode } from "react";

type TagVariant = "act" | "eng" | "tewa" | "on";

/** Small status chip used in card headers (ACTIVE, TEWA, ENGAGEMENT, …). */
export function Tag({
  variant,
  children,
}: {
  variant: TagVariant;
  children: ReactNode;
}) {
  return <span className={`tag tag-${variant} up`}>{children}</span>;
}
