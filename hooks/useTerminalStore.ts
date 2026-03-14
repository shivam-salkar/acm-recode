import { create } from 'zustand';

interface TerminalState {
  symbol: string;
  setSymbol: (symbol: string) => void;
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  activeTool: number | null;
  setActiveTool: (index: number | null) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  layoutAction: any;
  setLayoutAction: (action: any) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  symbol: 'BTC/USD',
  setSymbol: (symbol) => set({ symbol }),
  timeframe: '1m',
  setTimeframe: (timeframe) => set({ timeframe }),
  activeTool: null,
  setActiveTool: (activeTool) => set({ activeTool }),
  isSearchOpen: false,
  setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
  isSettingsOpen: false,
  setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  isNotificationsOpen: false,
  setNotificationsOpen: (isNotificationsOpen) => set({ isNotificationsOpen }),
  isProfileOpen: false,
  setProfileOpen: (isProfileOpen) => set({ isProfileOpen }),
  layoutAction: null,
  setLayoutAction: (layoutAction) => set({ layoutAction }),
}));
