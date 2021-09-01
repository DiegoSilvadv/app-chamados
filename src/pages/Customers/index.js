import { useState } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import {FiUser} from 'react-icons/fi';
import firebase from '../../services/firebaseConnection'
import "./styles.css";

import {toast} from 'react-toastify'

export default function Customers(){

    const [fantasyName, setFantasyName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [address, setAddress] = useState('');

    async function handleAdd(e) {
        e.preventDefault();

        if(fantasyName !== '' && cnpj !== '' && address !== ''){
            await firebase.firestore().collection('customer')
            .add({
                fantasyName: fantasyName,
                cnpj: cnpj,
                address: address,
            }).then(() => {
                setAddress('');
                setFantasyName('');
                setCnpj('');
                toast.info('Empresa cadastrada com sucesso!')
            }).catch((error) => {
                console.log(error)
                toast.error('Erro ao cadastrar empresa.')
            })
        }else {
            toast.error('Preencha todos os campos')
        }
        
    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Clientes">
                    <FiUser size={25} />
                </Title>
                <div className="container">
                    <form className="form-profile customers" onSubmit={handleAdd}>
                        <label>Nome fantasia</label>
                        <input 
                            type="text"
                            placeholder="Nome da empresa"
                            value={fantasyName}
                            onChange={(e) => setFantasyName(e.target.value)}
                        />
                        <label>CNPJ</label>
                        <input 
                            type="text"
                            placeholder="Seu CNPJ"
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                        />
                        <label>Endereço</label>
                        <input 
                            type="text"
                            placeholder="Endereço da empresa"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <button type="submit">Cadastrar</button>  
                    </form>
                </div>
            </div>
        </div>
    )
}