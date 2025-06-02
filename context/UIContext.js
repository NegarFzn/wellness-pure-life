import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  const openSignup = () => setShowSignup(true);
  const closeSignup = () => setShowSignup(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <UIContext.Provider
      value={{
        showLogin,
        showSignup,
        openLogin,
        closeLogin,
        openSignup,
        closeSignup,
        isChatOpen, 
        openChat,
        closeChat,
        setIsChatOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
