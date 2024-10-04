import { createSelectors } from '@/lib/zustand';
import { create } from 'zustand';

type PostState = {
  isOpen: boolean;
};

type PostActions = {
  setIsOpen: (value: boolean) => void;
};

const initialValues: PostState = {
  isOpen: false,
};

export const usePostStore = create<PostState & PostActions>((set, get) => ({
  ...initialValues,
  setIsOpen: (value) => {
    set((state) => ({ ...state, isOpen: value }));
  },
}));

export const postSelectors = createSelectors(usePostStore).use;
