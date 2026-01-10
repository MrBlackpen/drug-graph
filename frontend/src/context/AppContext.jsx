// frontend/src/context/AppContext.jsx
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [vizData, setVizData] = useState(null);
  const [vizEnabled, setVizEnabled] = useState(true);

  return (
    <AppContext.Provider
      value={{
        messages,
        setMessages,
        vizData,
        setVizData,
        vizEnabled,
        setVizEnabled
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
