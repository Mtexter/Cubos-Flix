const api = axios.create({
    baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev/3',
    timeout: 10000,
    headers: { 'Content-type': 'Application/json' }
})

async function dadosFilmes() {
    try {
        const dados = await api.get('/discover/movie?language=pt-BR&include_adult=false')
        const data = dados.data.results.slice(0, 18)
        return data
    } catch (error) {
        return error
    }
}

async function buscaDoInput(input) {
    try {
        const valorDoInput = input.toLowerCase()
        const dados = await api.get(`/search/movie?language=pt-BR&include_adult=false&query=${valorDoInput}`)
        const data = dados.data.results.slice(0, 18)
        return data
    } catch (error) {
        return error
    }
}

async function filmeDoDia() {
    try {
        const dadosEndpointVideos = await api.get(`/movie/436969/videos?language=pt-BR`)
        const dataEndpointVideos = dadosEndpointVideos.data.results

        const dadosEndpointGeral = await api.get(`/movie/436969?language=pt-BR`)
        const dataEndpointGeral = dadosEndpointGeral.data

        return [dataEndpointVideos, dataEndpointGeral]
    } catch (error) {
        return error
    }
}

async function requisicaoModal(id) {
    try {
        const dados = await api.get(`/movie/${id}?language=pt-BR`)
        const data = dados.data
        return data
    } catch (error) {
        return error
    }
}