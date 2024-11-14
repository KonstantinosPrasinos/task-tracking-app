import { createContext, useReducer } from "react";

export const ComponentCommunicationContext = createContext();

export const componentCommunicationReducer = (state, action) => {
  switch (action.type) {
    case "SET_SEARCH_SCREEN_VISIBLE":
      return { searchScreenVisible: action.payload };
    default:
      return state;
  }
};

const ComponentCommunicationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(componentCommunicationReducer, {
    searchScreenVisible: false,
  });

  return (
    <ComponentCommunicationContext.Provider value={{ state, dispatch }}>
      {children}
    </ComponentCommunicationContext.Provider>
  );
};

export default ComponentCommunicationContextProvider;
