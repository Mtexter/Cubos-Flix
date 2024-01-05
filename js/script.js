const movies = document.querySelector(".movies");
const btnCarroceuRetroc = document.querySelector(".btn-prev");
const btnCarroceuAvanc = document.querySelector(".btn-next");
const input = document.querySelector(".input");
const btTema = document.querySelector(".btn-theme");

const trailerHighlight = document.querySelector(".highlight__video-link");
const divHighlight = document.querySelector(".highlight__video");
const tituloHighlight = document.querySelector(".highlight__title");
const votacaoHighlight = document.querySelector(".highlight__rating");
const generoHighlight = document.querySelector(".highlight__genres");
const lancamentoHighlight = document.querySelector(".highlight__launch");
const resumoHighlight = document.querySelector(".highlight__description");

const modalClose = document.querySelector(".modal__close");
const modal = document.querySelector(".modal");
const modalBody = document.querySelector(".modal__body");
const titutoModal = document.querySelector(".modal__title");
const imgbackModal = document.querySelector(".modal__img");
const sobreModal = document.querySelector(".modal__description");
const votocaoModal = document.querySelector(".modal__average");
const generosModal = document.querySelector(".modal__genres");

let marcoInicSlice = 0;
let marcoFinalSlice = 6;
let filmesLista = "";
let filmeHighlight = "";

async function ativacaoModal(id) {
    const filme = await requisicaoModal(id)

    titutoModal.textContent = filme.title
    sobreModal.textContent = filme.overview
    votocaoModal.textContent = filme.vote_average
    if (!filme.backdrop_path) {
        imgbackModal.src = ""
    } else {
        imgbackModal.src = filme.backdrop_path
    }
    generosModal.textContent = ""

    filme.genres.forEach((elemento) => {
        const span = document.createElement("span")

        span.textContent = elemento.name
        span.classList.add("modal__genre")

        generosModal.appendChild(span)
    })
}

async function adicfilmeDoDia() {
    const filmeDiario = await filmeDoDia()
    filmeHighlight = filmeDiario

    function dataConvertida(dataCompleta) {
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        let numeroDoMes = ""

        if (dataCompleta.slice(5, 7)[0] == 0) {
            numeroDoMes = dataCompleta.slice(5, 7)[1]
        }

        const dia = dataCompleta.slice(7)
        const mes = meses[parseInt(numeroDoMes) + 1]
        const ano = dataCompleta.slice(0, 5)
        return `${dia} DE ${mes} DE ${ano}`
    }

    let generos = filmeHighlight[1].genres.map((elemento) => {
        return elemento.name
    })

    trailerHighlight.href = `https://www.youtube.com/watch?v=` + filmeHighlight[0][1].key
    divHighlight.style.backgroundImage = `url(${filmeHighlight[1].backdrop_path})`
    divHighlight.style.backgroundPosition = "center"
    divHighlight.style.backgroundSize = "550px"
    tituloHighlight.textContent = filmeHighlight[1].title
    votacaoHighlight.textContent = filmeHighlight[1].vote_average
    generoHighlight.textContent = generos
    lancamentoHighlight.textContent = dataConvertida(filmeHighlight[1].release_date)
    resumoHighlight.textContent = filmeHighlight[1].overview
}

async function cubosFlix() {
    const filmes = await dadosFilmes();
    filmesLista = filmes
    inicio()
}

function paginacaoEBusca() {
    async function resultsBusca(input) {
        const filmes = await buscaDoInput(input);
        if (input) {
            filmesLista = filmes
            removerFilmesAtuais()
            inicio()

        } else {
            removerFilmesAtuais()
            cubosFlix()
        }
    }

    input.addEventListener("focus", (event) => {
        marcoInicSlice = 0
        marcoFinalSlice = 6
        removerFilmesAtuais()
        inicio()
    })

    input.addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            resultsBusca(event.target.value)
            input.value = ""

        }
    })

    btnCarroceuAvanc.addEventListener("click", (event) => {
        event.stopPropagation()

        if (marcoFinalSlice < filmesLista.length) {
            marcoInicSlice += 6
            marcoFinalSlice += 6

            filmesAtuais()
        } else {
            marcoInicSlice = 0
            marcoFinalSlice = 6

            filmesAtuais()
        }
    })

    btnCarroceuRetroc.addEventListener("click", (event) => {
        event.stopPropagation()

        if (marcoInicSlice > 0) {
            marcoInicSlice -= 6
            marcoFinalSlice -= 6

            filmesAtuais()
        } else if (filmesLista.length > 6 && filmesLista.length < 12) {
            marcoInicSlice = filmesLista.length - (filmesLista.length - 6)
            marcoFinalSlice = filmesLista.length + (12 - filmesLista.length)

            filmesAtuais()
        } else if (filmesLista.length > 12 && filmesLista.length < 18) {
            marcoInicSlice = filmesLista.length - (filmesLista.length - 12)
            marcoFinalSlice = filmesLista.length + (18 - filmesLista.length)

            filmesAtuais()
        } else if (filmesLista.length < 6) {
            return
        } else {
            marcoInicSlice = filmesLista.length - 6
            marcoFinalSlice = filmesLista.length
            filmesAtuais()
        }
    })

}

function filmeNaDiv(indice, array) {
    const movie = document.createElement("div");
    const movieInfor = document.createElement("div");
    const movieTitle = document.createElement("span");
    const movieRating = document.createElement("span");
    const imgEstrela = document.createElement("img");

    let img = array[indice].poster_path

    movie.classList.add("movie")
    movieInfor.classList.add("movie__info")
    movieTitle.classList.add("movie__title")
    movieRating.classList.add("movie__rating")

    if (img) {
        movie.style.backgroundImage = `url(${img})`;
    } else {
        movie.textContent = "Desculpe esse não tem uma capa bonita no momento, mas quem sabe em breve :)"
        movie.style.color = "darkRed"
        movie.style.textAlign = "center"
        movie.style.paddingTop = "55px"
    }
    movieTitle.textContent = array[indice].title
    movieRating.textContent = array[indice].vote_average
    imgEstrela.src = "assets/estrela.svg"
    movie.id = array[indice].id

    movies.appendChild(movie)
    movie.appendChild(movieInfor)
    movieInfor.appendChild(movieTitle)
    movieInfor.appendChild(movieRating)
    movieRating.appendChild(imgEstrela)

    movie.addEventListener("click", (event) => {
        event.stopPropagation()
        modal.classList.remove("hidden")
        ativacaoModal(event.target.id)

    })
}

function filmesAtuais(array) {
    removerFilmesAtuais()
    const container = filmesLista.slice(marcoInicSlice, marcoFinalSlice)
    const exibirFilmes = container.map((elemento, index) => {

        return filmeNaDiv(index, container)
    })
}

function removerFilmesAtuais() {
    while (movies.firstChild) {
        movies.removeChild(movies.firstChild);
    }
}

function inicio() {
    filmesLista.forEach((elemento, indice) => {
        if (indice < 6)
            filmeNaDiv(indice, filmesLista)
    });
}

function eventosModal() {
    modalBody.addEventListener("click", () => {
        modal.classList.add("hidden")
    })

    modalClose.addEventListener("click", () => {
        modal.classList.add("hidden")
    })
}

function mudancaTema() {
    const logoCubos = document.querySelector("header img")
    const efeito = document.querySelectorAll(".efeito")

    let noite = 0;

    function noiteAtivada(status) {
        document.documentElement.style.setProperty('--background', '#1b2028');
        document.documentElement.style.setProperty('--input-color', '#ffffff');
        document.documentElement.style.setProperty('--text-color', '#ffffff');
        document.documentElement.style.setProperty('--bg-secondary', '#2D3440');
        document.documentElement.style.setProperty('--bg-modal', '#2D3440');
        logoCubos.src = "./assets/logo.svg"
        btTema.src = "./assets/dark-mode.svg"
        btnCarroceuAvanc.src = "./assets/arrow-right-light.svg"
        btnCarroceuRetroc.src = "./assets/arrow-left-light.svg"
        modalClose.src = "./assets/close.svg"
        input.style.backgroundColor = "#3E434D"

        noite = 1
        localStorage.setItem("tema", "ativo")
    }
    function noiteDesativada(status) {
        document.documentElement.style.setProperty('--background', '#ffffff');
        document.documentElement.style.setProperty('--input-color', '#979797');
        document.documentElement.style.setProperty('--text-color', '#1b2028');
        document.documentElement.style.setProperty('--bg-secondary', '#ededed');
        document.documentElement.style.setProperty('--bg-modal', '#ededed');
        logoCubos.src = "./assets/logo-dark.png"
        btTema.src = "./assets/light-mode.svg"
        btnCarroceuAvanc.src = "./assets/arrow-right-dark.svg"
        btnCarroceuRetroc.src = "./assets/arrow-left-dark.svg"
        modalClose.src = "./assets/close-dark.svg"
        input.style.backgroundColor = "var(--background)"

        noite = 0
        localStorage.setItem("tema", "desativado")
    }

    if (localStorage.getItem("tema") === "ativo") {
        noiteAtivada()
    } else {
        noiteDesativada()
    }

    btTema.addEventListener("click", (evento) => {
        if (!noite) {
            noiteAtivada()
        } else {
            noiteDesativada()
        }

    })

    efeito.forEach(elemento => {
        elemento.classList.add("transition")
    })

}

paginacaoEBusca(filmesLista);
adicfilmeDoDia();
eventosModal();
mudancaTema();
cubosFlix();