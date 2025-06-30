
export const Api = async (url, metodo, datos_guardar = "",archivo = false) => {

    
    let cargando = true
    //console.log("llegoaqui1")
    let opciones = {
        method: "POST"
    }
    if (metodo == "GET" || metodo == "DELETE") {
        opciones = {
            method: metodo
        }

    }


    if (metodo == "POST" || metodo == "PUT") {

        if (archivo){
           // console.log("llegoaqui",datos_guardar)
            opciones = {
                method: metodo,
                body: datos_guardar,
            }
        }else{
            opciones = {
                method: metodo,
                body: JSON.stringify(datos_guardar),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        }



        
    }
    //console.log("aqui es antes de la peticion")
    const peticion = await fetch(url, opciones);
    const datos = await peticion.json()
   // console.log("regreso",datos)
    cargando = false


    return {
        datos
 
    }
}
