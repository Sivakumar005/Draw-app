const TOKEN_KEY='auth_token';
export const tokenStorage={
    set:(token:string)=>{
        if(typeof window!=='undefined'){
            localStorage.setItem(TOKEN_KEY,token);
        }
    },
    get:():string|null=>{
        if(typeof window!=='undefined'){
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },
    remove:()=>{
        if(typeof window!=='undefined'){
            localStorage.removeItem(TOKEN_KEY);
        }
    }
}

export const isAuthenticated=():boolean=>{
    return !!tokenStorage.get();
}

export const getAuthHeader=()=>{
    const token=tokenStorage.get();
    return token?{Authorization: `Bearer ${token}` }:{};
}