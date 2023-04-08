const setLocalStorage = (usuario) => localStorage.setItem("usuario", JSON.stringify(usuario))

function btnEntrar(){
    const inputNome = document.getElementById("nome").value
    const idUsuario = (Math.random() * 10).toString()

    setLocalStorage({
        nome: inputNome,
        meuId: idUsuario
    })

    window.location.href="./index.html?usuarionome=" + inputNome + "&meuId=" + idUsuario
}