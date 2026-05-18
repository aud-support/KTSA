// src/contexts/ModalContext.tsx
import { createContext, useContext } from "react";

interface ModalContextType {
  openLogin: () => void;
  openSignup: () => void;
}

export const ModalContext = createContext<ModalContextType>({
  openLogin: () => {},
  openSignup: () => {},
});

export const useModal = () => useContext(ModalContext);
