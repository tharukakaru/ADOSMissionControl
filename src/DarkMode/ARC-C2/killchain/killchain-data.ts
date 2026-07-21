export type KillChainAccent = "yellow" | "purple" | "blue" | "teal" | "amber" | "red" | "green";

export type EntityStatus = "hostile" | "neutral" | "friendly";

export interface KillChainEntity {
  id: string;
  label: string;
  pct: number;
  priority: "P1" | "P2" | "P3";
  edited: string;
  status: EntityStatus;
  actor?: string;
  selected?: boolean;
}

export interface KillChainColumn {
  id: string;
  title: string;
  subtitle: string;
  accent: KillChainAccent;
  entities: KillChainEntity[];
}

export const KILL_CHAIN_COLUMNS: KillChainColumn[] = [
  {
    id: "detect",
    title: "DETECT",
    subtitle: "ISR",
    accent: "yellow",
    entities: [
      { id: "KC-0612", label: "Fast Attack", pct: 63, priority: "P2", edited: "5m", status: "hostile" },
      { id: "KC-0613", label: "Fast Attack", pct: 92, priority: "P1", edited: "8m", status: "hostile" },
      { id: "KC-0614", label: "Fast Attack", pct: 45, priority: "P2", edited: "12m", status: "neutral" },
      { id: "KC-0615", label: "Fast Attack", pct: 78, priority: "P1", edited: "3m", status: "hostile" },
    ],
  },
  {
    id: "fix",
    title: "FIX",
    subtitle: "CLASSIFY / IDG",
    accent: "purple",
    entities: [
      { id: "KC-0553", label: "Group-3 UAS", pct: 88, priority: "P1", edited: "6m", status: "hostile" },
      { id: "KC-0554", label: "Group-3 UAS", pct: 71, priority: "P2", edited: "14m", status: "neutral" },
    ],
  },
  {
    id: "track",
    title: "TRACK",
    subtitle: "CUSTODY",
    accent: "blue",
    entities: [
      { id: "KC-0421", label: "Naval Vel", pct: 95, priority: "P1", edited: "2m", status: "hostile" },
    ],
  },
  {
    id: "pair",
    title: "PAIR",
    subtitle: "EFFECTOR",
    accent: "teal",
    entities: [
      { id: "KC-0331", label: "SAM Site", pct: 82, priority: "P1", edited: "4m", status: "friendly", actor: "STRIKER" },
      { id: "KC-0332", label: "SAM Site", pct: 67, priority: "P2", edited: "9m", status: "friendly", actor: "STRIKER" },
      { id: "KC-0333", label: "SAM Site", pct: 54, priority: "P2", edited: "11m", status: "neutral" },
    ],
  },
  {
    id: "decide",
    title: "DECIDE",
    subtitle: "FORCE CAT.",
    accent: "amber",
    entities: [
      {
        id: "KC-0288",
        label: "EW Radar",
        pct: 91,
        priority: "P1",
        edited: "1m",
        status: "hostile",
        selected: true,
        actor: "STRIKER",
      },
    ],
  },
  {
    id: "execute",
    title: "EXECUTE",
    subtitle: "ENGAGE",
    accent: "red",
    entities: [
      { id: "KC-0199", label: "Fast Ark Craft", pct: 76, priority: "P1", edited: "7m", status: "hostile", actor: "STRIKER" },
    ],
  },
  {
    id: "assess",
    title: "ASSESS",
    subtitle: "BDA",
    accent: "green",
    entities: [
      { id: "KC-0101", label: "Cache", pct: 100, priority: "P1", edited: "15m", status: "friendly" },
      { id: "KC-0102", label: "Cache", pct: 88, priority: "P2", edited: "18m", status: "friendly" },
      { id: "KC-0103", label: "Cache", pct: 92, priority: "P1", edited: "20m", status: "neutral" },
      { id: "KC-0104", label: "Cache", pct: 65, priority: "P2", edited: "22m", status: "friendly" },
      { id: "KC-0105", label: "Cache", pct: 79, priority: "P1", edited: "25m", status: "friendly" },
    ],
  },
];
