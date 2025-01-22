import { create } from "zustand";

interface TestState {
    foo: string;
    setFoo: (foo: string) => void;
}

export const useTestStore = create<TestState>((set) => ({
    foo: "bar",
    setFoo: (foo) => {
      console.log("🛑 setFoo called");
      set({ foo });
    },

}));