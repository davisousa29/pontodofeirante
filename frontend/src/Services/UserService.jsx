import axios from 'axios'
import Cookies from "universal-cookie"



const cookies = new Cookies();

export default class UserServices{
    constructor () {
        this.axios = axios.create({
            baseURL: import.meta.env.VITE_REACT_APP_LOGIN_API
        })
    }

    //registrar usuário
    async registerUser(dados){
        const {data} = await this.axios.post("/api/register_user", dados);
        
        if (data.existe) {
            return data;
        }
        return data
    }

    //registrar loja
    async registerStore(dados){
        const {data} = await this.axios.post("/api/register_store", dados);

        if (data.existe) {
            return data;
        }
        return data
    }

    //login usuário
    async signInUser(dados) {
        const {data} = await this.axios.post("/api/user_login", {
            email: dados.email, senha:dados.senha 
        });

        
        if (!data.erro) {
            const token = data.user.token
            localStorage.setItem("name_user", data.user.name);
            localStorage.setItem("email_user", data.user.email);

            cookies.set("t0k3n_user", token);
        }

        return data;
    }

    //login loja
    // async signInStore(dados){
    //     const {data} = await this.axios.post("/api/store_login", {
    //         email: dados.email, senha:dados.senha 
    //     });

        

    //     if (!data.erro) {
    //         localStorage.setItem("nome", data.user.name);
    //         localStorage.setItem("email", data.user.email);

            
    //         cookies.set("t0k3n_store", data.user.token, {
    //             httpOnly: true,
    //             sameSite:true,
    //             secure: true,
    //         });
    //     }

    //     return data;

    // }

    //autenticar token usuario ou loja
    async userAutheticatedUser (){
        const token = cookies.get("t0k3n_user")

        try {
            const {data} = await this.axios.get("/api/validate_token", {token: token})
        } catch {
            return false;
        }
    }

    async userAutheticatedStore (){
        const token = cookies.get("t0k3n_store")

        try {
            const {data} = await this.axios.get("/api/validate_token", {token: token})
        } catch {
            return false;
        }
    }

    async logoutUser(){
        localStorage.removeItem("name_user");
        localStorage.removeItem("email_user");
        cookies.remove("t0k3n_user")
    }

    async logoutStore(){
        localStorage.removeItem("name_store");
        localStorage.removeItem("email_store");
        cookies.remove("t0k3n_store")
    }


}