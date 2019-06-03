import React,{Component} from 'react';
import firebase from '../../services/firebase';

export default class EventosIndex extends Component{

    constructor(){
        super();

        this.state={
            listaEventos : [],
            titulo:'',
            descricao:'',
            data:'',
            hora:'',
            ativo:false,
            acessoLivre:false,
            idEvento: 0
        }
    }

    atualizaEstado(event){
        this.setState({[event.target.name] : event.target.value});
    }

    salvarEvento(event){
        event.preventDefault();

        if(this.state.idEvento === 0){
            firebase.firestore().collection("eventos")
            .add({
                data : firebase.firestore.Timestamp.fromDate(new Date(this.state.data + " " + this.state.hora)),
                titulo : this.state.titulo,
                descricao : this.state.descricao,
                ativo : Boolean(this.state.ativo),
                acessoLivre : Boolean(this.state.acessoLivre)
            }) .then(() => {
                alert("Evento Cadastrado")
            }).catch((erro) => {
                console.log('tag', erro);
            })
        } else{
            firebase.firestore().collection("eventos")
                .doc(this.state.idEvento)
                .set({
                    data : firebase.firestore.Timestamp.fromDate(new Date(this.state.data + " " + this.state.hora)),
                    titulo : this.state.titulo,
                    descricao : this.state.descricao,
                    ativo : Boolean(this.state.ativo),
                    acessoLivre : Boolean(this.state.acessoLivre)
                }).then((result) => {
                    alert("Evento Alterado");
                }).catch((erro) =>{
                    console.log('erro', erro)
                })
        }
    }

    listaEventosRealTime(){
        firebase.firestore().collection("eventos")
        .where("ativo", "==", true)
        .onSnapshot((eventos) => {
            let eventosArray = [];

                eventos.forEach((evento) =>{
                    eventosArray.push({
                        id : evento.id,
                        titulo : evento.data().titulo,
                        descricao : evento.data().descricao,
                        data: evento.data().data,
                        acessoLivre : evento.data().acessoLivre,
                        ativo : evento.data().ativo
                    })
                })

                this.setState({listaEventos : eventosArray}, () => {
                    console.log(this.state.listaEventos);
                })

        })
    }

    componentDidMount(){
        this.listaEventosRealTime();
    }

    delete(event){
        event.preventDefault();

        if(window.confirm("Deseja excluir, tem certeza?")){
        firebase.firestore().collection("eventos")
            .doc(event.target.id)
            .delete()
            .then((result) => {
                alert("Evento Excluido");
            }).catch((erro) =>{
                console.log('erro', erro)
    })
    }
}

    deleteTodos(event){
        event.preventDefault();

           if(window.confirm("Deseja Excluir todos, agora é sério")){
               this.state.listaEventos.map((evento) => {
                   firebase.firestore().collection("eventos")
                   .doc(evento.id)
                   .detele()
               })
               alert("Excluido Todos com Suucesso")
           }
        
    }

    buscarPorId(event){
        event.preventDefault();

        firebase.firestore().collection("eventos")
            .doc(event.target.id)
            .get()
            .then((evento) => {
                this.setState({
                    idEvento : evento.id,
                    titulo : evento.data().titulo,
                    descricao : evento.data().descricao,
                    ativo : evento.data().data.ativo,
                    acessoLivre : evento.data().acessoLivre,
                    data : evento.data().data.toDate().toISOString().split("T")[0],
                    hora : evento.data().data.toDate().toTimeString().slice(0,5)
                })
            })
    }

    render(){
        return(
            <div>

            <div>
                <h2>Eventos - Index</h2>

                {
                    this.state.listaEventos.map((evento) => {
                        return(
                            <li key= {evento.id}>{evento.id} - {evento.titulo} - {evento.descricao} -
                            <button id={evento.id} onClick={this.buscarPorId.bind(this)}>Editar</button>
                            <button id={evento.id} onClick={this.delete.bind(this)}>Excluir</button>
                            <button id={evento.id} onClick={this.deleteTodos.bind(this)}>Delete Todos</button>
                            </li> 
                            );
                        })
                    } <br></br>
            </div>


            <div className="cadastrar">

            <form onSubmit={this.salvarEvento.bind(this)}>
            
                <input type="text" name="titulo" placeholder="Titulo" value={this.state.titulo} onChange={this.atualizaEstado.bind(this)}/> <br></br>

                <input type="text" name="descricao" placeholder="Descrição" value={this.state.descricao} onChange={this.atualizaEstado.bind(this)}/> <br></br>

                <input type="date" name="data" placeholder="Data" value={this.state.data} onChange={this.atualizaEstado.bind(this)}/> <br></br>

                <input type="time" name="hora" placeholder="Hora" value={this.state.hora} onChange={this.atualizaEstado.bind(this)}/> <br></br>

                <input type="checkbox" name="ativo" placeholder="Ativo" defaultValue={this.state.ativo} onChange={this.atualizaEstado.bind(this)}/> Ativo<br></br>

                <input type="checkbox"  name="acessoLivre" placeholder="Acesso Livre" defaultValue={this.state.acessoLivre} onChange={this.atualizaEstado.bind(this)}/>  Acesso Livre<br></br>

            <button type="submit">Enviar</button>
                    </form>
            </div>
                    </div>
        )
    }
}