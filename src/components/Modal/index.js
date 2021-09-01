import './styles.css';
import { FiX } from 'react-icons/fi'

export default function Modal({ content, close }){
    return (
        <div className="modal">
            <div className="container">
                <button className="close" onClick={close}>
                    <FiX size={23} color="#fff" />
                    Voltar
                </button>

                <div>
                    <h2>Detalhe do chamado</h2>

                    <div className="row">
                        <span>
                            Cliente: <i>{ content.customer }</i>
                        </span>
                    </div>
                    <div className="row">
                        <span>
                            Assunto: <i>{ content.description }</i>
                        </span>
                        <span>
                            Cadastrado em: <i>{ content.createdFormated }</i>
                        </span>
                    </div>

                    <div className="row">
                        <span className="status">
                            Status: <p style={{ color: '#fff', backgroundColor: content.status === 'Aberto' ? '#5cb85c' : '#999' }}>{ content.status }</p>
                        </span>
                    </div>
                    {
                        content.complement !== '' && (
                            <>
                                <h3>Complemento</h3>
                                <p>{content.complement}</p>
                            </>
                        )
                    }

                </div>
            </div>
        </div>
    )
}