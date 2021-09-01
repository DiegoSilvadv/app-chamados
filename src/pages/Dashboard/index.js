import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { format } from 'date-fns'
import { Link } from 'react-router-dom';
import firebase from '../../services/firebaseConnection';

import Modal from '../../components/Modal';

import './styles.css';

const listRef = firebase.firestore().collection('tasks').orderBy('created', 'desc')

export default function Dashboard() {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoanding] = useState(true);
    const [loadingMore, setLoandingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();

    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(() => {
        LoadTasks();
        return () => {

        }
    }, [])

    async function LoadTasks() {
        await listRef.limit(5)
            .get()
            .then((snapshot) => {
                updateState(snapshot);
            }).catch((error) => {
                console.log(error);
                setLoandingMore(false);
            })

        setLoanding(false)
    }

    async function updateState(snapshot) {

        const isCollectionEmpty = snapshot.size === 0;

        if (!isCollectionEmpty) {
            const list = [];

            snapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    description: doc.data().description,
                    customer: doc.data().customer,
                    customerId: doc.data().customerId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complement: doc.data().complement,
                })
            })
            const lastDoc = snapshot.docs[snapshot.docs.length - 1]// pegando o ultimo documento buscado
            //colocando todos os chamado já existentes e adicionando tambem a list
            setTasks(tasks => [...tasks, ...list])
            setLastDocs(lastDoc)
        } else {
            setIsEmpty(true)
        }

        setLoandingMore(false)

    }

    async function handelMore(e) {
        setLoandingMore(true);

        await listRef.startAfter(lastDocs).limit(5)
            .get()
            .then((snapshot) => {
                updateState(snapshot)
            })
    }

    if (loading) {
        return (
            <div>
                <Header />
                <div className="content">
                    <Title name="Dashboard">
                        <FiMessageSquare size={25} />
                    </Title>

                    <div className="container dashboard">
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div>
        )
    }

    function togglePostModal(item) {
        setShowPostModal(!showPostModal); //trocando de true para false
        setDetail(item);
    }



    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Dashboard">
                    <FiMessageSquare size={25} />
                </Title>

                {
                    tasks.length === 0 ? (
                        <div className="container dashboard">
                            <span>Nenhum chamado registrado...</span>
                            <Link to="/new" className="new">
                                <FiPlus size={25} color="#fff" />
                                Novo Chamado
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link to="/new" className="new">
                                <FiPlus size={25} color="#fff" />
                                Novo Chamado
                            </Link>
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Assunto</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        tasks.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td data-label="Cliente" >{item.customer}</td>
                                                    <td data-label="Assunto" >{item.description}</td>
                                                    <td data-label="status" >
                                                        <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? 'Green' : '#999' }} >{item.status}</span>
                                                    </td>
                                                    <td data-label="Cadastrado" >{item.createdFormated}</td>
                                                    <td data-label="#" >
                                                        <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={() => togglePostModal(item)}>
                                                            <FiSearch color="#fff" size={17} />
                                                        </button>
                                                        <Link to={ `/new/${item.id}` } className="action" style={{ backgroundColor: '#f6a935' }}>
                                                            <FiEdit2 color="#fff" size={17} />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>

                            {!loadingMore && !isEmpty && <button className="btn-more" onClick={handelMore}>Buscar mais</button>}
                        </>
                    )
                }

            </div>
            {showPostModal && (
                <Modal
                    content={detail}
                    close={togglePostModal}
                />
            )}

        </div>

    )
}

