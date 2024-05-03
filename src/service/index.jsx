import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const consultaPautas = () => api.get('/v1/pautas');

const criaPauta = (body) => api.post('/v1/pautas', body);

const registraVoto = (idPauta, body) => api.post(`/v1/pautas/${idPauta}/voto`, body);

const abreSessao = (idPauta, body) => api.patch(`/v1/pautas/${idPauta}/sessao`, body);

const consultaResultado = (idPauta) => api.get(`/v1/pautas/${idPauta}/resultado`);

export { consultaPautas, criaPauta, registraVoto, abreSessao, consultaResultado };
