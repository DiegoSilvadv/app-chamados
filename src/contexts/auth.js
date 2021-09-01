import { useState, useEffect, createContext } from 'react';
import firebase from '../services/firebaseConnection.js';
import { toast } from 'react-toastify'

export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [user, setUser] = useState(null);    
    const [loadingAuth, setLoadingAuth] = useState(false);    
    const [loading, setLoading] = useState(true);   
    
    useEffect(()=>{
    
        function LoadStorage(){
             // consulta o localStorage para verificar se tem algum usuario logado
            const storageUser = localStorage.getItem('SistemaUser');

            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }

            setLoading(false);
        }

        LoadStorage();
       

    }, [])

    async function SignIn(email, password){
        setLoadingAuth(true);
        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then( async (value) => {
                let uid = value.user.uid;

                const userProfile = await firebase.firestore().collection('user')
                    .doc(uid).get();

                    let data = {
                        uid: uid,
                        name: userProfile.data().name,
                        avatarUrl: userProfile.data().avatarUrl,
                        email: value.user.email
                    }

                    setUser(data);
                    storageUser(data);
                    setLoadingAuth(false);
                    toast.success('Bem vindo de volta');


            }).catch((error)=>{
                console.log(error);
                toast.error('Algo deu errado!')
                setLoadingAuth(false);
            })
    }

    async function signUp(email, password, name){
        setLoading(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then( async (value)=> {
                let uid = value.user.uid;

                await firebase.firestore().collection('user')
                    .doc(uid).set({
                        name: name,
                        avatarUrl: null,
                    })
                    .then(() => {
                        let data = {
                            uid: uid,
                            name: name,
                            email: value.user.email,
                            avatarUrl: null
                        }

                        setUser(data);
                        storageUser(data);
                        setLoadingAuth(false);
                        toast.success('Bem vindo a plataforma!');
                    })
                    
            }).catch((error) => {
                console.log(error);
                toast.error('Ops, algo deu errado!')
                setLoadingAuth(false);
            })
    }

    function storageUser(data){
        localStorage.setItem('SistemaUser', JSON.stringify(data));
    }

    async function signOut(){
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        setUser(null)
    }

    return(
        // expressao "!!" converte o "user" para true ou false depende se tem algo dentro dele ou não
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            loading, 
            signUp,
            signOut,
            SignIn,
            loadingAuth,
            setUser,
            storageUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}
// AuthProvider que vai ir dentro do nosso arquivo de app.js por volta de todas as rotas para que todos possam acessar s
export default AuthProvider;