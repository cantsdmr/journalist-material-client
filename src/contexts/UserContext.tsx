import { createContext, useContext } from "react"
import { useAuth } from "../hooks/useAuth"
import { firebaseAuth } from "../util/firebase";

const UserContext = createContext(null as any)
const useUserContext = () => useContext(UserContext)

const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const auth = useAuth(firebaseAuth)

    return <UserContext.Provider value={auth}>
        {children}
    </UserContext.Provider>
}

export { useUserContext, UserProvider }