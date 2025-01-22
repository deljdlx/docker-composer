import { create } from "zustand";

interface PanelState {
    leftPanelSize: number;
    rightPanelSize: number;
    setSizes: (sizes: { leftPanelSize: number; rightPanelSize: number }) => void;
}

export const usePanelStore = create<PanelState>((set) => ({
  leftPanelSize: 30,
  rightPanelSize: 70,
  setSizes: (sizes) => set(sizes),
}));