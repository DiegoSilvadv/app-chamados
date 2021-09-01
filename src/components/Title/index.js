import './styles.css';

export default function Title({name, children}){
    return(
       <div className="title">
           {children}
           <span>{name}</span>
       </div>
    )
}