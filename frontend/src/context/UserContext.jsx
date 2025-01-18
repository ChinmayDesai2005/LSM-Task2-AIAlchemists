/* eslint-disable react/prop-types */
import { createContext, useContext, useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

const UserProvider = ({children}) =>{
    const [user,setUser] = useState();

    const navigate= useNavigate()

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("LSMUser"));

        setUser(userInfo);

        if(!userInfo) navigate();
    }, [navigate])
    

    return(
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const UserState = () => {
    return useContext(UserContext);
}

export default UserProvider;