import { nanoid } from "nanoid";
import { create } from "zustand";

/**
 * Example zustand store demonstrating the project conventions:
 * - Co-locate types with the store
 * - Use `nanoid()` for client-side IDs
 * - Keep actions inside the store (not separate hooks)
 *
 * Delete this file once a real store exists.
 */

type Item = {
  id: string;
  label: string;
};

type ExampleState = {
  items: Item[];
  addItem: (label: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

export const useExampleStore = create<ExampleState>((set) => ({
  items: [],
  addItem: (label) =>
    set((state) => ({
      items: [...state.items, { id: nanoid(), label }],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clear: () => set({ items: [] }),
}));
