import React, { useReducer } from 'react';
import authContext from './authContext';
import authReducer from './authReducer';

import clienteAxios from '../../config/axios';
import tokenAuth from '../../config/token';

import {
    REGISTRO_EXITOSO,
    REGISTRO_ERROR,
    OBTENER_USUARIO,
    LOGIN_EXITOSO,
    LOGIN_ERROR,
    CERRAR_SESION,
} from '../../types/index';

function AuthState(props) {
    const initialState = {
        token: localStorage.getItem('token'),
        autenticado: null,
        usuario: null,
        mensaje: null,
        cargando: true,
    };

    // Crear state y dispatch
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Crear las funciones
    // * Registrar un usuario
    const registrarUsuario = async (datos) => {
        try {
            const respuesta = await clienteAxios.post('/api/usuarios', datos);
            console.log(respuesta.data);

            dispatch({
                type: REGISTRO_EXITOSO,
                payload: respuesta.data,
            });

            // Obtener el usuario
            usuarioAutenticado();
        } catch (error) {
            // console.log(error.response.data.msg);
            const alerta = {
                msg: error.response.data.msg,
                categoria: 'alerta-error',
            };

            dispatch({
                type: REGISTRO_ERROR,
                payload: alerta,
            });
        }
    };

    // * Retorna el usuario autenticado
    const usuarioAutenticado = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            // Función para enviar el token por headers
            tokenAuth(token);
        }

        try {
            const respuesta = await clienteAxios.get('/api/auth');
            /* console.log(respuesta); */
            dispatch({
                type: OBTENER_USUARIO,
                payload: respuesta.data.usuario,
            });
        } catch (error) {
            console.log(error.response);
            dispatch({
                type: LOGIN_ERROR,
            });
        }
    };

    // Cuando el usuario inicia sesión
    const iniciarSesion = async (datos) => {
        try {
            const respuesta = await clienteAxios.post('/api/auth', datos);

            dispatch({
                type: LOGIN_EXITOSO,
                payload: respuesta.data,
            });

            // Obtener el usuario
            usuarioAutenticado();
        } catch (error) {
            console.log(error.response.data.msg);
            const alerta = {
                msg: error.response.data.msg,
                categoria: 'alerta-error',
            };

            dispatch({
                type: LOGIN_ERROR,
                payload: alerta,
            });
        }
    };

    // Cuando el usuario cierra sesión
    const cerrarSesion = async () => {
        dispatch({
            type: CERRAR_SESION,
        });
    };

    return (
        <authContext.Provider
            value={{
                token: state.token,
                autenticado: state.autenticado,
                usuario: state.usuario,
                mensaje: state.mensaje,
                cargando: state.cargando,
                registrarUsuario,
                usuarioAutenticado,
                iniciarSesion,
                cerrarSesion,
            }}
        >
            {props.children}
        </authContext.Provider>
    );
}

export default AuthState;
