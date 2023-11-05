import { create } from "zustand";
import TermInfo from "./TermInfo";

type Store = {
  terms: TermInfo[];
  currentTerm: TermInfo;
  campus: string;
  setTerms: (terms: TermInfo[]) => void;
  setCurrentTerm: (term: TermInfo) => void;
  setCampus: (campus: string) => void;
};

const useStore = create<Store>()((set) => ({
  terms: [],
  currentTerm: new TermInfo(0, "", "", ""),
  campus: "o",
  setTerms: (terms: TermInfo[]) => set({ terms }),
  setCurrentTerm: (currentTerm: TermInfo) => set({ currentTerm }),
  setCampus: (campus: string) => set({ campus }),
}));

export default useStore;
