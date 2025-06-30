import React from 'react'
import { NavLink } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';
import { Api } from '../../../hooks/Api';
import { useState, useEffect } from 'react';

const data = {
    México: {
        Tepic: [
            "Casa Museo Amado Nervo",
            "Biblioteca Magna de la Universidad Autónoma de Nayarit (UAN)",
            "Hemeroteca de la UAN",
            "Archivo General del Estado de Nayarit",
            "Archivo Histórico de la Diócesis de Tepic",
            "Fototeca Centro INAH Tepic"
        ],
        Compostela: ["Colecciones Particulares"],
        Mazatlán: ["Archivo Histórico Municipal de Mazatlán"],
        Guadalajara: [
            "Biblioteca Pública del Estado de Jalisco “Juan José Arreola”",
            "Colecciones Particulares"
        ],
        Monterrey: [
            "Biblioteca Miguel de Cervantes Saavedra. Tecnológico de Monterrey (ITESM)",
            "Biblioteca Universitaria de la Universidad Autónoma de Nuevo León (UANL)"
        ],
        Pachuca: ["Fototeca Nacional del Instituto Nacional de Antropología e Historia (INAH)"],
        CDMX: [
            "Biblioteca Nacional de México",
            "Hemeroteca Nacional de México",
            "Casa Museo Alfonso Reyes (Capilla Alfonsina)",
            "Archivo Histórico Genaro Estrada. Secretaria de Relaciones Exteriores",
            "Archivo General de la Nación",
            "Colecciones Particulares"
        ]
    },
    España: {
        Madrid: [
            "Biblioteca Nacional de España",
            "Instituto del Patrimonio Cultural de España /Universidad Complutense de Madrid",
            "Ateneo de Madrid",
            "Biblioteca Octavio Paz. Instituto de México en España",
            "Archivo Histórico Nacional",
            "Real Academia Española",
            "Registro Civil de Madrid",
            "Cementerio Sacramental San Lorenzo y San José",
            "Hemeroteca Municipal del Ayuntamiento de Madrid",
            "Archivo General de Palacio"
        ],
        Barcelona: ["Archivo Histórico Fotográfico"]
    },
    Francia: {
        París: [
            "Embajada de México en Francia",
            "Mairie De París Du 14",
            "Archivo de París",
            "Instituto Cultural México en Francia",
            "Biblioteca Nacional de Francia"
        ]
    },
    Portugal: {
        Lisboa: [
            "Embajada de México en Portugal",
            "Archivo Diplomático del Ministerio de Negocios Extranjeros en Portugal",
            "Torre Do Tombo de la Universidad de Portugal",
            "Biblioteca Nacional de Portugal",
            "Hemeroteca Municipal de Lisboa"
        ]
    },
    Argentina: {
        Buenos_Aires: [
            "Biblioteca de la Legislatura Portuaria",
            "Biblioteca del Congreso de la Nación",
            "Biblioteca Nacional Mariano Moreno",
            "Embajada de México en Argentina",
            "Archivo Ministerio de Relaciones Exteriores, cancillería Argentina",
            "Archivo General de la Nación",
            "Jardín del Rosedal"
        ]
    },
    Uruguay: {
        Montevideo: [
            "Palacio Santos- Ministerio de Relaciones Exteriores, Instituto Artiga",
            "Archivo General de la Nación",
            "Biblioteca Nacional de Uruguay",
            "Archivo Nacional de la Imagen y la Palabra",
            "Museo Naval",
            "Parque Hotel. Merco-sur",
            "Ateneo de Montevideo",
            "Biblioteca Amado Nervo",
            "Cementerio Central",
            "Centro de Estudios Históricos Navales y Marítimos",
            "Palacio Legislativo",
            "Calle Amado Nervo",
            "Universidad de la República de Uruguay",
            "Museo Zorrilla",
            "Busto-monumento Amado Nervo"
        ]
    },

    Brasil: {
        "Rio de Janeiro": ["NA"]
    }
};

export const RegInstituciones = () => {
    const { formulario, enviado, cambiado, resetFormulario } = useForm({})
    const [resultado, setResultado] = useState(false)
    const [fileName, setFileName] = useState('');
    const [paises, setPaises] = useState(Object.keys(data));
    const [ciudades, setCiudades] = useState([]);
    const [instituciones, setInstituciones] = useState([]);
    const [selectedPais, setSelectedPais] = useState('');
    const [selectedCiudad, setSelectedCiudad] = useState('');
    const [saved, setSaved] = useState('not sended');

    useEffect(() => {
        setSaved("")
    }, [formulario])

    useEffect(() => {

        if (formulario.pais) {
            const ciudades = Object.keys(data[formulario.pais]);
            setCiudades(ciudades);
            if (ciudades.length === 1) {
                setSelectedCiudad(ciudades[0]);

            } else {
                setSelectedCiudad('');
                setInstituciones([]);
            }
        }
    }, [formulario.pais]);

    useEffect(() => {
        if (formulario.ciudad && formulario.pais) {
            const instituciones = data[formulario.pais][formulario.ciudad];
            setInstituciones(instituciones);
        }
    }, [formulario.ciudad]);


    const guardar_foto = async (e) => {
        e.preventDefault();
        let nueva_foto = formulario;
        const { datos } = await Api("https://backend-prueba-apel.onrender.com/api/instituciones/registrar", "POST", nueva_foto);
        console.log(nueva_foto)
        if (datos.status === "successs") {
            console.log("status success")
            const fileInput = document.querySelector("#file");
            const formData = new FormData();
            Array.from(fileInput.files).forEach((file, index) => {
                formData.append(`files`, file);
            });
            console.log("formdata",formData)
            const { subida2 } = await Api(`https://backend-prueba-apel.onrender.com/api/instituciones/registrar-imagen/${datos.publicacionGuardada._id}`, "POST", formData, true);
            //const { subida } = await Api(`https://backend-google-fnsu.onrender.com/api/instituciones/registrar-imagen/${datos.publicacionGuardada._id}`, "POST", formData, true);

            setResultado(true);
            setSaved("saved");
        } else {
            console.log("status error")
            setSaved("error");
        }
    };

    return (
        <div>
            <main className='main_registro'>
                <div className='contenedor_formulario_foto'>

                    <h1>Formulario de registro de bienes</h1>


                    <div className='frame_botones_registro' id="regresar_boton">
                        <NavLink to="/registro">
                            <button className="button">Regresar</button>
                        </NavLink>
                    </div>
                    <form onSubmit={guardar_foto}>
                        <h2>Campos generales</h2>

                        <div className='divisor_form'>
                        
                            <div className="form-group" id="nombrePeriodico">
                                <label htmlFor="nombrePeriodico">Nombre de la institución</label>
                                <input
                                    type='text'
                                    id="nombrePeriodicoSelect"
                                    name="nombre"
                                    value={formulario.nombre || ''}
                                    onChange={cambiado}
                                >
                    
                     

                                </input>


                            </div>
                            <div className="form-group" id="numeroEdicion">
                                <label htmlFor="numeroEdicion">Tipo de institución</label>
                                <input
                                    type="text"
                                    id="numeroEdicionInput"
                                    name="tipo_institucion"
                                    value={formulario.tipo_institucion}
                                    onChange={cambiado}
                                />
                            </div>
                        

                            <div className="form-group" id="numeroEdicion">
                                <label htmlFor="numeroEdicion">Número de registro</label>
                                <input
                                    type="number"
                                    id="numeroEdicionInput"
                                    name="numero_registro"
                                    value={formulario.numero_registro || ''}
                                    onChange={cambiado}
                                />
                            </div>
                            </div>
                            <div className='divisor_form2'>
                           
                            
                            <div className="form-group" id="lugarPublicacion">
                                <label htmlFor="encabezado">Maps</label>
                                <input
                                    type="text"
                                    id="lugarPublicacionInput"
                                    name="maps"
                                    placeholder=""
                                    value={formulario.maps || ''}
                                    onChange={cambiado}
                                />
                            </div>
                            <div className="form-group" id="lugarPublicacion">
                                <label htmlFor="encabezado">Página web</label>
                                <input
                                    type="text"
                                    id="lugarPublicacionInput"
                                    name="pagina_web"
                                    placeholder=""
                                    value={formulario.pagina_web || ''}
                                    onChange={cambiado}
                                />
                            </div>
                            
                            <div className='form-group'>
                                <label htmlFor='file0'>Imagen</label>
                                <input type='file' name='file0' id="file" multiple/>
                            </div>
                            <div className="form-group"id="resumen">
                                <label htmlFor="resumen" id='resumenLabel'>Notas</label>
                                <textarea
                                    type="text"
                                    id="resumenInput"
                                    name="notas_relevantes"
                                    placeholder="Resumen"
                                    value={formulario.notas_relevantes || ''}
                                    onChange={cambiado}
                                />
                            </div>

                            <div className="form-group"id="transcripcion">
                                <label htmlFor="transcripcion" id="transcripcionLabel">Pendiente</label>
                                <textarea
                                    type="text"
                                    id="transcripcionInput"
                                    name="pendiente"
                                    value={formulario.pendiente || ''}
                                    onChange={cambiado}
                                />
                            </div>
                        

                            <div className="form-group">
                                <label>País:</label>
                                <select
                                    id="pais"
                                    name='pais'
                                    value={formulario.pais || ''}
                                    onChange={cambiado}>

                                    <option value="">Seleccionar país</option>
                                    {paises.map((pais) => (
                                        <option key={pais} name="paises" value={pais}>
                                            {pais}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Ciudad:</label>
                                <select
                                    id="ciudad"
                                    name="ciudad"
                                    value={formulario.ciudad || ''}
                                    onChange={cambiado}
                                >
                                    <option value="">Seleccionar ciudad</option>
                                    {ciudades.map((ciudad) => (
                                        <option key={ciudad} value={ciudad}>
                                            {ciudad}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Persona que registra:</label>
                                <select name="persona_registra" value={formulario.persona_registra || ''} onChange={cambiado}>
                                    <option value="">Seleccionar persona que registra</option>
                                    <option value="Mayra Fonseca">Mayra</option>
                                    <option value="Robin">Robin</option>
                                    <option value="Xoely">Xoely</option>
                                    <option value="Perla">Perla</option>
                                </select>
                            </div>

                        
                            
                            </div>
   
                          
                        <button className="button" onClick={guardar_foto}>Enviar</button>
              <strong id='saved_text'>{saved === 'saved' ? 'Fotografia registrada correctamente' : ''}</strong>
              <strong id="error_text">{saved === 'error' ? 'No se ha registrado la foto ' : ''}</strong>
                    </form>
                </div>
            </main>
        </div>
    )
}
