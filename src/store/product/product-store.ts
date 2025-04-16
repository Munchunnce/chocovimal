import { create } from "zustand";

type NewProductState = {
    isOpen: boolean;
    onOpen: () => void;
    onClsose: () => void;
};

export const useNewProduct = create<NewProductState>((set) => {
    return {
        isOpen: false,
        onOpen: () => set({ isOpen: true }),
        onClsose: () => set({ isOpen: false }),
    }
})