import {useContext} from "react";
import {ContextAuth} from "../context/createContext";

export const useContextAuth = () => {
const context = useContext(ContextAuth);

if(!context) {
    throw new Error("useContextAuth must be used within a AuthProvider");
}

return context;

}