import React from "react"

import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"

function Logout(props) {
    Cookies.remove("session")
    Cookies.remove("username")
    Cookies.remove("isAuth")
    const navigate = useNavigate()
    props.setIsLoggedIn(false)
    navigate("/")
    // navigate(0)


  
    return (
      <div >
        
      </div>
      
      
    );
  }
  
  export default Logout;
  