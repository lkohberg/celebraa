import React, { createContext, useContext, useState, useCallback } from "react";

interface GuestNameContextType {
  guestName: string;
  setGuestName: (name: string) => void;
}

const GuestNameContext = createContext<GuestNameContextType>({
  guestName: "",
  setGuestName: () => {},
});

export const GuestNameProvider = ({ children }: { children: React.ReactNode }) => {
  const [guestName, setGuestNameState] = useState("");

  const setGuestName = useCallback((name: string) => {
    setGuestNameState(name);
  }, []);

  return (
    <GuestNameContext.Provider value={{ guestName, setGuestName }}>
      {children}
    </GuestNameContext.Provider>
  );
};

export const useGuestName = () => useContext(GuestNameContext);
