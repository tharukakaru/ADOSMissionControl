import { create } from "zustand";
import { DEFAULT_SELECTED_ID, TABS, FILTERS } from "../data/dummyData";

type Tab = (typeof TABS)[number];
type Filter = (typeof FILTERS)[number];

interface ArcState {
  activeTab: Tab;
  trackFilter: Filter;
  selectedTrackId: string;
  hyenaOpen: boolean;
  isPlaying: boolean;

  setTab: (tab: Tab) => void;
  setFilter: (filter: Filter) => void;
  selectTrack: (id: string) => void;
  toggleHyena: () => void;
  setHyenaOpen: (open: boolean) => void;
  togglePlay: () => void;
}

/**
 * Single UI store for the SENTINEL screen. In the wider app this would be one
 * of the ~70 feature stores; kept self-contained here with dummy defaults.
 */
export const useArcStore = create<ArcState>((set) => ({
  activeTab: "SENTINEL",
  trackFilter: "ALL",
  selectedTrackId: DEFAULT_SELECTED_ID,
  hyenaOpen: true,
  isPlaying: false,

  setTab: (activeTab) => set({ activeTab }),
  setFilter: (trackFilter) => set({ trackFilter }),
  selectTrack: (selectedTrackId) => set({ selectedTrackId }),
  toggleHyena: () => set((s) => ({ hyenaOpen: !s.hyenaOpen })),
  setHyenaOpen: (hyenaOpen) => set({ hyenaOpen }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
}));
