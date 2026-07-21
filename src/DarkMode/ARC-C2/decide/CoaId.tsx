"use client";

export function CoaId({ id, selected }: { id: string; selected: boolean }) {
  return (
    <span className={`coa-id${selected ? " coa-id--selected" : ""}`}>{id}</span>
  );
}
