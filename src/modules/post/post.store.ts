import { createSelectors } from '@/lib/zustand';
import { create } from 'zustand';
import { PostDetails } from './types/post-response.type';

type PostState = {
  isOpen: boolean;
  postSelected: PostDetails | null;
};

type PostActions = {
  setIsOpen: (value: boolean) => void;
  setPostSelected: (post: PostDetails | null) => void;
  reset: () => void;
};

const initialValues: PostState = {
  isOpen: false,
  postSelected: null,
};

export const usePostStore = create<PostState & PostActions>((set) => ({
  ...initialValues,
  setIsOpen: (value) => {
    set((state) => ({ ...state, isOpen: value }));
  },
  setPostSelected: (post) => {
    set((state) => ({ ...state, postSelected: post }));
  },
  reset: () => {
    set(initialValues);
  },
}));

export const postSelectors = createSelectors(usePostStore).use;
