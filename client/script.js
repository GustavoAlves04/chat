function changeTitle(){
    document.getElementById("title").innerHTML = "Front-End Developers"   
}
function changeTitle2(){
    document.getElementById("title").innerHTML = "Back-End Developers"
}
function changeTitle3(){
    document.getElementById("title").innerHTML = "Random"
}
function changeTitle4(){
    document.getElementById("title").innerHTML = "Welcome"
}

const inputTexto = document.getElementById('enviarMensagem');
const btnSair  = document.getElementById('btnSair');
const getLocalStorage = () =>JSON.parse(localStorage.getItem('usuario')) ?? [];

const socket = io();
const { usuarionome, meuid } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.emit('entrarSala', { usuarionome, meuid});

inputTexto.addEventListener('keyup', function(e){
    let key = e.key === 'Enter';
    
    if(key && this.value) {
        socket.emit('mensagemChat', this.value);
        this.value = '';
    }
});

btnSair.addEventListener('click', function() {
    
    const sairSala = confirm('Certeza que deseja sair da sala?');
    
    if (sairSala) {
        socket.emit('sairSala');
        window.location.href='index.html';
    }
    
});

function adicionarNovaMensagem(mensagem) {
    const usuarioStorage = getLocalStorage();
    let minhaMensagem = false;
    
    if(mensagem.meuid) {
        minhaMensagem = mensagem.meuid === usuarioStorage.meuId;
    }

    let divMensagem = '';
    let divDetalhes = '';

    let quadroMensagens = document.getElementById('quadro-mensagens');
    let li = criarElementoHtml('li', ['clearfix']);
    let span = criarElementoHtml('span', ['message-data-time']);

    if(minhaMensagem) {
        divMensagem = criarElementoHtml('div', ['message', 'other-message', 'float-right' ]);
        divDetalhes = criarElementoHtml('div', ['message-data', 'text-right']);
    } else {
        divMensagem = criarElementoHtml('div', ['message', 'my-message']);
        divDetalhes = criarElementoHtml('div', ['message-data']);
    }

    span.innerHTML = (minhaMensagem ? "eu" : mensagem.usuarioNome) + ', ' + mensagem.horario;
    divMensagem.innerHTML = mensagem.mensagem;

    divDetalhes.appendChild(span);
    li.appendChild(divDetalhes);
    li.appendChild(divMensagem);
    quadroMensagens.appendChild(li);
    realizarScrollChat();
}

function criarElementoHtml(nomeElemento, classeElemento, atributosElemento) {
    let elemento = document.createElement(nomeElemento);
    for (let classe of classeElemento) {
        elemento.classList.add(classe);
    }

    return elemento;
}

function realizarScrollChat() {
    let elem = document.getElementById('chat');
    elem.scrollTop = elem.scrollHeight;
}

/*Socket.io*/
socket.on('salaUsuarios', ({sala, usuarios}) => {
    document.getElementById("salaId").innerHTML = sala;
    document.getElementById("listaUsuarios").innerHTML = '';
    for (let usuario of usuarios) {
        criarListaUsuarios(usuario.nome);
    }
});

socket.on('novaMensagem', (mensagem) => {
    adicionarNovaMensagem(mensagem);
});

function criarListaUsuarios(usuarioNome) {
    
    let listaUsuarios = document.getElementById("listaUsuarios");
    let liUsuario = criarElementoHtml("li", ["clearfix"]);
    let divDescricaoUsuario = criarElementoHtml('div', ["about"]);
    let divNomeUsuario = criarElementoHtml('div', ["name"]);
    let divStatusUsuario = criarElementoHtml('div', ["status"]);
    let iconeStatus = criarElementoHtml("i" , ["fa", "fa-circle", "online"]);

    iconeStatus.innerHTML = "online";
    divNomeUsuario.innerHTML = usuarioNome;

    divStatusUsuario.appendChild(iconeStatus);
    divDescricaoUsuario.appendChild(divNomeUsuario);
    divDescricaoUsuario.appendChild(divStatusUsuario);
    liUsuario.appendChild(divDescricaoUsuario);
    listaUsuarios.appendChild(liUsuario);
}