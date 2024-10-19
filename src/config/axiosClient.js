import axios from 'axios';

// Crear una instancia de Axios con configuración predeterminada
export const axiosClient = axios.create({
    baseURL: 'https://costaflores.openvino.exchange',
    headers: {
        'Content-Type': 'application/json',
    }
});