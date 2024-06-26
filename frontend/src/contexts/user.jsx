import { useState, createContext, useEffect} from "react";
import UserServices from "../Services/UserService";
import Cookies from "universal-cookie"



const cookies = new Cookies();
export const UserContext = createContext({});
const userService = new UserServices();

export default function UserProvider({children}){
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAuthenticatedStore, setIsAuthenticatedStore] = useState(false)
    const [tokenUser, setTokenUser] = useState(cookies.get("t0k3N_user"))
    const [tokenStore, setTokenStore] = useState(cookies.get("t0k3N_store"))
    const [nameUser, setNameUser] = useState("")
    const [emailUser, setEmailUser] = useState("")
    const [nameStore, setNameStore] = useState("")
    const [emailStore, setEmailStore] = useState("")
    const [idStore, setIdStore] = useState("")
    const [loadProdutos, setLoadProdutos] = useState(null)

    function updateToken(){
        setTokenUser(cookies.get("t0k3N_user"))
        setTokenStore(cookies.get("t0k3N_store"))
    }

    useEffect(() => {
        async function checkAuthentication() {
            const [isLogged, isLoggedStore, loadProd] = await Promise.all([
                userService.userAutheticatedUser(tokenUser),
                userService.userAutheticatedStore(tokenStore),
                userService.loadItems()
            ]);

            if (isLogged) {
                setIsAuthenticated(isLogged.auth);
                setNameUser(isLogged.name);
                setEmailUser(isLogged.email);
            }
            if (isLoggedStore) {
                setIsAuthenticatedStore(isLoggedStore.auth);
                setNameStore(isLoggedStore.name);
                setEmailStore(isLoggedStore.email);
                setIdStore(isLoggedStore.idStore)
            }

            setLoadProdutos(loadProd)
            
          }
        checkAuthentication();
      }, [tokenUser, tokenStore]);


    return(
        <UserContext.Provider value={ {
            isAuthenticated: isAuthenticated,
            isAuthenticatedStore: isAuthenticatedStore,
            updateToken,
            nameUser: nameUser,
            emailUser: emailUser,
            nameStore: nameStore,
            emailStore: emailStore ,
            loadProdutos: loadProdutos,
            idStore : idStore 
            } }>
            {children}
        </UserContext.Provider>
    )
}