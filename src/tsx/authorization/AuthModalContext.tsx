import { createContext, useContext, useState, ReactNode } from "react";

type OpenOptions = {
  reason?: "manual" | "protected";
  onSuccess?: () => void;
};

type AuthModalContextType = {
  isOpen: boolean;
  options: OpenOptions;
  openAuthModal: (opts?: OpenOptions) => void;
  closeAuthModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<OpenOptions>({});

  const openAuthModal = (opts: OpenOptions = {}) => {
    setOptions(opts);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    setOptions({});
  };

  return (
    <AuthModalContext.Provider
      value={{ isOpen, options, openAuthModal, closeAuthModal }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx)
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  return ctx;
}
