"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ComparisonStore {
  watchIds: number[]
  addWatch: (id: number) => void
  removeWatch: (id: number) => void
  clearAll: () => void
  isInComparison: (id: number) => boolean
}

export const useComparison = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      watchIds: [],
      addWatch: (id) => {
        const current = get().watchIds
        if (current.length >= 4) {
          alert("You can compare up to 4 watches at a time")
          return
        }
        if (!current.includes(id)) {
          set({ watchIds: [...current, id] })
        }
      },
      removeWatch: (id) => set((state) => ({ watchIds: state.watchIds.filter((wId) => wId !== id) })),
      clearAll: () => set({ watchIds: [] }),
      isInComparison: (id) => get().watchIds.includes(id),
    }),
    {
      name: "watch-comparison",
    },
  ),
)
