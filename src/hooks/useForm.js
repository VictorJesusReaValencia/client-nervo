import { useState } from "react";

export const useForm = (objetoinicial = {}) => {
  const [formulario, setFormulario] = useState(objetoinicial);

  const serializarFormulario = (formulario) => {
    const formdata = new FormData();
    const objetocompleto = {};

    for (let [name, value] of formdata) {
      objetocompleto[name] = value;
    }
    return objetocompleto;
  };

  const enviado = (e) => {
    e.preventDefault();
    console.log(serializarFormulario(e.target));
  };

  const cambiado = ({ target }) => {
  
    const { name, value } = target;

    setFormulario({
      ...formulario,
      [name]: value,
    });

  };

  const resetFormulario = () => {
    setFormulario(objetoinicial);
  };

  return {
    formulario,
    enviado,
    cambiado,
    resetFormulario,
    setFormulario
  };
};
