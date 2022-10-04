import { createContext, useReducer } from "react";

export const ScreenSizeContext = createContext();

export const screenSizeReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SIZE':
            return action.payload;
        default:
            return state;
    }
}

const ScreenSizeContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(screenSizeReducer, 'small');

    return (
        <ScreenSizeContext.Provider value={{state, dispatch}}>
            {children}
        </ScreenSizeContext.Provider>
    );
}
 
export default ScreenSizeContextProvider;