import {
    FORMULARIO_PROYECTO,
    OBTENER_PROYECTOS,
    AGREGAR_PROYECTO,
    VALIDAR_FORMULARIO,
    PROYECTO_ACTUAL,
} from '../../types';

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (state, action) => {
    switch (action.type) {
        case FORMULARIO_PROYECTO:
            return {
                ...state,
                formulario: true,
            };
        case OBTENER_PROYECTOS:
            return {
                ...state,
                proyectos: action.payload,
            };
        case AGREGAR_PROYECTO:
            return {
                ...state,
                proyectos: [...state.proyectos, action.payload],
                formulario: false,
                errorFormulario: false,
            };
        case VALIDAR_FORMULARIO:
            return {
                ...state,
                errorFormulario: true,
            };
        case PROYECTO_ACTUAL:
            return {
                ...state,
                proyecto: state.proyectos.filter(
                    (proyecto) => proyecto.id === action.payload
                ),
            };

        default:
            return state;
    }
};
