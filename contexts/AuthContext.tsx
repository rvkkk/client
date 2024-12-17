import React,{
    createContext,
    useContext,
    useEffect,
    useState,
    Dispatch,
    SetStateAction,
  } from "react";
  
  import { getMyProfile } from "../utils/api/users";
  import { User } from "../constants/types";
  
  export interface Context {
    isLogged?: boolean;
    setIsLogged?: Dispatch<SetStateAction<boolean>>;
    user?: User;
    setUser?: Dispatch<SetStateAction<User | undefined>>;
    loading?: boolean;
  }
  
  const defaultContext = {
    isLogged: false,
    setIsLogged: (isLogged: boolean) => {},
    user: {},
    setUser: (user: User) => {},
    loading: false,
  } as Context;
  
  const GlobalContext = createContext(defaultContext);
  export const useAuth = () => useContext(GlobalContext);
  
  const AuthProvider = ({ children }: any) => {
    const [isLogged, setIsLogged] = useState<boolean>(false);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      getMyProfile()
        .then((res) => {
          if (res) {
            console.log(res);
            setIsLogged(true);
            setUser(res);
          } else {
            setIsLogged(false);
            setUser(undefined);
          }
        })
        .catch((error: Error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [isLogged]);
  
    return (
      <GlobalContext.Provider
        value={{
          isLogged,
          setIsLogged,
          user,
          setUser,
          loading,
        }}
      >
        {children}
      </GlobalContext.Provider>
    );
  };
  
  export default AuthProvider;