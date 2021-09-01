import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { useHistory, useParams } from 'react-router-dom'
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify'
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlus } from 'react-icons/fi';
import './styles.css'

export default function New() {

    const {id } = useParams();
    const history = useHistory();

    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0);
    const [idCustomer, setIdCustomer] = useState(false); 
    
    const [description, setDescription] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complement, setComplement] = useState('');

    const { user } = useContext(AuthContext);

    useEffect(()=>{
        async function LoadCustomers(){
            await firebase.firestore().collection('customer')
            .get()
            .then((snapshot)=>{
              let list = [];
      
              snapshot.forEach((doc) => {
                list.push({
                  id: doc.id,
                  fantasyName: doc.data().fantasyName,
                })
              })
      
              setCustomers(list);
      
              if(id){
                loadId(list);
              }
      
            })
            .catch((error)=>{
              console.log('DEU ALGUM ERRO!', error);
            })
      
        }

        LoadCustomers();
    },[id]);

    async function loadId(list) {

        await firebase.firestore().collection('tasks').doc(id)
            .get()
            .then((snapshot) => {
                setDescription(snapshot.data().description);
                setStatus(snapshot.data().status);
                setComplement(snapshot.data().complement);

                let index = list.findIndex(item => item.id === snapshot.data().customerId );
                setCustomerSelected(index);
                setIdCustomer(true);

            })
            .catch((err)=>{
                console.log('ERRO NO ID PASSADO: ', err);
                setIdCustomer(false);
            })
    }

    // criando um novo chamado
    async function handleRegister(e) {
        e.preventDefault();

        if(idCustomer) {
            await firebase.firestore().collection('tasks')
                .doc(id)
                .update({
                    customer: customers[customerSelected].fantasyName,
                    customerId: customers[customerSelected].id,
                    description: description,
                    status: status,
                    complement: complement,
                    userId: user.uid
                }).then(() => {
                    toast.success("Alterado com Sucesso!");
                    setCustomerSelected(0);
                    setComplement('');
                    history.push("/dashboard");
                }).catch((error) => {
                    toast.error("Ops erro ao alterar tente mais tarde");
                    console.log(error);
                })

                return;

        }

        await firebase.firestore().collection('tasks')
        .add({
            created: new Date(),
            customer: customers[customerSelected].fantasyName,
            customerId: customers[customerSelected].id,
            description: description,
            status: status,
            complement: complement,
            userId: user.uid
        }).then(() => {
            toast.success("Chamado criado com sucesso");
            setComplement('');
            setCustomerSelected(0);

        }).catch((error) => {
            toast.error("Ops erro ao registrar tente mais tarde.")
            console.log(error)
        })
        
    }


    //função que pega a posição do select de cliente
    function handleChangeCustomers(e) {
        setCustomerSelected(e.target.value)
    }

    function handleChangeSelect(e) {
        setDescription(e.target.value);

    }

    function handelOptionOnChange(e) {
        setStatus(e.target.value);
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Novo Chamado">
                    <FiPlus size={25} />
                </Title>
            </div>
            <div className="container">
                <form className="form-profile" onSubmit={handleRegister}>
                    <label>Cliente</label>
                    <select value={customerSelected} onChange={handleChangeCustomers}>
                        {
                            customers.map((item, index) => { 
                                return (
                                    <option key={item.id} value={index}>
                                        {item.fantasyName}
                                    </option>
                                )
                            })
                        }
                    </select>

                    <label>Assunto</label>
                    <select value={description} onChange={handleChangeSelect}>
                        <option value="Suporte" >Suporte</option>
                        <option value="Visita Técnica" >Visita Técnica</option>
                        <option value="Financeiro" >Financeiro</option>
                    </select>

                    <label>Status</label>
                    <div className="status">
                        <input 
                            type="radio"
                            name="radio"
                            value="Aberto" 
                            checked={status === 'Aberto'}
                            onChange={handelOptionOnChange}
                        />
                        <span>Em Aberto</span>
                        <input 
                            type="radio"
                            name="radio"
                            value="Progresso" 
                            checked={status === 'Progresso'}
                            onChange={handelOptionOnChange}
                        />
                        <span>Progresso</span>
                        <input 
                            type="radio"
                            name="radio"
                            value="Atendido" 
                            checked={status === 'Atendido'}
                            onChange={handelOptionOnChange}
                        />
                        <span>Atendido</span>
                    </div>
                    <label>Complemento</label>
                    <textarea 
                        type="text"
                        placeholder="Descreva seu problema (opcional)"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                    />
                    <button type="submit">Salvar</button>
                </form>
            </div>
        </div>
        
    )
}