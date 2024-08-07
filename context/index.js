import { useContext, createContext, useReducer } from "react";
import reducer from "./reducer";
import initialState from "./state";

export const UserContext = createContext()

export const useUserContext = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('Context to be used within provider')
    }
    return context
}

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    )



}