import { create } from "zustand";
import TermInfo from "./TermInfo";
import Course from "./Course";

type Store = {
  terms: TermInfo[];
  currentTerm: TermInfo;
  savedClasses: Course[];
  campus: string;
  setTerms: (terms: TermInfo[]) => void;
  setCurrentTerm: (term: TermInfo) => void;
  setCampus: (campus: string) => void;
  setSavedClasses: (savedClasses: Course[]) => void;
};

const useStore = create<Store>()((set) => ({
  terms: [],
  currentTerm: new TermInfo(0, "", "", ""),
  campus: "o",
  savedClasses: [],
  setTerms: (terms: TermInfo[]) => set({ terms }),
  setCurrentTerm: (currentTerm: TermInfo) => set({ currentTerm }),
  setCampus: (campus: string) => set({ campus }),
  setSavedClasses: (savedClasses: Course[]) => set({ savedClasses }),
}));

export default useStore;
