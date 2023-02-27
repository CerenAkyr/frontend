import React, { useState } from "react";
import { useEffect } from "react";
import jwt_decode from 'jwt-decode';
import "../Login/Login.css";
import {useSearchParams} from "react-router-dom";


function RegisterPage() {

    const [pwd, setPwd] = useState()
    const [searchParams, setSearchParams] = useSearchParams();
    console.log(searchParams.get("code"))
    function handleSubmit() {
        console.log(pwd)
        
        fetch('http://localhost:8080/api/login?code=' + searchParams.get("code") + "&pwd=" + pwd , {
            method: 'PUT',
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    
    }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <label htmlFor="password" className="login-form__label">
        Password:
      </label>
      <input
        type="password"
        id="password"
        value={pwd}
        onChange={(event) => setPwd(event.target.value)}
        className="login-form__input"
      />
      <button type="submit" className="login-form__button">
        Reset Password
      </button>
    </form>
  );
}

export default RegisterPage;
