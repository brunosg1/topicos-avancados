import axios from "axios";
import { AuthService } from '../services/authService';

const API_BASE = "http://localhost:8080";
const API_BASE_AUTH = "http://localhost:8080/auth";
const API2 = "http://localhost:8080/auth";

export const api = axios.create({ baseURL: API_BASE });
export const api_auth = axios.create({ baseURL: API_BASE_AUTH });

api.interceptors.request.use((config) => {
  console.log('Token via AuthService:', AuthService.getToken());
  
  config.headers.Authorization = `Bearer ${AuthService.getToken()}`;
  return config;
});

export const cadastrarPropriedade = (data) => api.post("/propriedades", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
export const cadastrarCultura = (data) => api.post("/culturas", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
export const cadastrarTipoPraga = (data) => api.post("/pragas", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
export const cadastrarTipoDoenca = (data) => api.post("/doencas", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

export const registrarOcorrencia = (data) => api.post("/ocorrencias", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
export const listarOcorrencias = () => api.get("/ocorrencias", {
    headers: {
      'Content-Type': 'application/json'
    }
  });
export const Login = (data) => api_auth.post("/login", data);