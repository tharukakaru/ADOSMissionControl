"use client";

import {
  ChevronRight, Plus, Map as MapIcon, Table2, Globe,
} from "lucide-react";
import { DATA_SOURCES, LIVE_LAYERS } from "../data";
import type { DataSource } from "../types";
import { LiveDataLayerRow } from "./LiveDataLayerRow";

const DS_ICON = { map: MapIcon, sheet: Table2, globe: Globe } as const;

function SourceRow({ source }: { source: DataSource }) {
  const Icon = DS_ICON[source.icon];
  return (
    <button type="button" className="drow">
      <span className="di"><Icon size={15} /></span>
      {source.label}
      <span className="arr">
        {source.action === "plus" ? <Plus size={14} /> : <ChevronRight size={14} />}
      </span>
    </button>
  );
}

function DataSourceGroup({
  title,
  count,
  sources,
}: {
  title: string;
  count: number;
  sources: readonly DataSource[];
}) {
  return (
    <div className="dsrc">
      <div className="dsrc-h">
        <ChevronRight size={13} className="cx" />
        <span className="t">{title}</span>
        <span className="n">{count}</span>
      </div>
      {sources.map((source) => (
        <SourceRow key={source.label} source={source} />
      ))}
      <button type="button" className="viewall">View all</button>
    </div>
  );
}

function LiveDataLayerGroup({
  title,
  count,
  sources,
}: {
  title: string;
  count: number;
  sources: readonly DataSource[];
}) {
  return (
    <div className="dsrc dsrc--layers">
      <div className="dsrc-h">
        <ChevronRight size={13} className="cx" />
        <span className="t">{title}</span>
        <span className="n">{count}</span>
      </div>
      {sources.map((source) => (
        <LiveDataLayerRow
          key={source.label}
          label={source.label}
          action={source.action}
        />
      ))}
      <button type="button" className="viewall">View all</button>
    </div>
  );
}

export function DataSourcesSection() {
  return (
    <div className="dec-data-card">
      <DataSourceGroup title="Integrated data sources" count={9} sources={DATA_SOURCES} />
      <LiveDataLayerGroup title="Live data layers" count={21} sources={LIVE_LAYERS} />
    </div>
  );
}
