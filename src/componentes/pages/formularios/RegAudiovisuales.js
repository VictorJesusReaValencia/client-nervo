import React from 'react'


export const RegAudiovisuales = () => {
  return (
    <div>
        <main id='main2'>
            <div id="container2">
           

            <h3>Campos específicos audiovisuales</h3>
                <div id="esp1">
                    <label for="duracion">Duración</label>
                    <input type="text" id="duracion" name="duracion" placeholder="Duración"/>

                    <label for="formato">Formato</label>
                    <input type="text" id="formato" name="formato" placeholder="Formato"/>

                    <label for="resolucion">Resolución</label>
                    <input type="text" id="resolucion" name="resolucion" placeholder="Resolución"/>

                    <label for="tamanoArchivo">Tamaño del archivo</label>
                    <input type="text" id="tamanoArchivo" name="tamanoArchivo" placeholder="Tamaño del archivo"/>

                    <label for="calidad">Calidad</label>
                    <input type="text" id="calidad" name="calidad" placeholder="Calidad"/>

                    <label for="notas">Notas</label>
                    <input type="text" id="notas" name="notas" placeholder="Notas"/>
                        

                </div>
            </div>
        </main>
    </div>
  )
}
