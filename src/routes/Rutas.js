import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '../componentes/layout/Header';
import { Nav } from '../componentes/layout/Nav';
import { Inicio } from '../componentes/pages/Inicio';
import { Registro } from '../componentes/pages/Registro';
import { Menuiconografia } from '../componentes/pages/Menuiconografia';
import { RegFotografia } from '../componentes/pages/formularios/RegFotografia';
import { RegIconografia } from '../componentes/pages/formularios/RegIconografia';
import { RegLibros } from '../componentes/pages/formularios/RegLibros';
import { RegPeriodicos } from '../componentes/pages/formularios/RegPeriodicos';
import { RegCorrespondencia } from '../componentes/pages/formularios/RegCorrespondencia';
import { RegDocumentacion } from '../componentes/pages/formularios/RegDocumentacion';
import { RegObjetos } from '../componentes/pages/formularios/RegObjetos';
import { RegPartituras } from '../componentes/pages/formularios/RegPartituras';
import { RegMonumentos } from '../componentes/pages/formularios/RegMonumentos';
import { RegAudiovisuales } from '../componentes/pages/formularios/RegAudiovisuales';
import { Acervo } from '../componentes/pages/Acervo';

import { Croonologia } from '../componentes/pages/Croonologia';
import { Instituciones } from '../componentes/pages/Instituciones';
import { Formugeneral } from '../componentes/pages/formularios/Formugeneral';
import { FotoDetalle } from '../componentes/pages/acervo/FotoDetalle';
import { Fotografias2 } from '../componentes/pages/acervo/Fotografias2';
import { Cortejo } from '../componentes/pages/acervo/temas/Cortejo';
import { AlbumFotos } from '../componentes/pages/acervo/temas/AlbumFotos';
import { PublicLayout2 } from '../componentes/layout/publico/PublicLayout2';
import { Login } from '../componentes/layout/publico/Login';
import { Register } from '../componentes/layout/publico/Register';
import { PrivateLayout } from '../componentes/layout/privado/PrivateLayout';
import { AuthProvider } from '../context/AuthProvider';
import { Logout } from '../componentes/layout/publico/Logout';
import { EditarFotografia } from '../componentes/pages/formularios/Editores/EditarFotografia';
import { Hemerografia } from '../componentes/pages/acervo/Hemerografia';
import { HemerografiaTema } from '../componentes/pages/acervo/temas/HemerografiaTema';
import { HemerografiaDetalle } from '../componentes/pages/acervo/detalles/HemerografiaDetalle';
import { EditarHemerografia } from '../componentes/pages/formularios/Editores/EditarHemerografia';
import { Iconografia } from '../componentes/pages/acervo/Iconografia';
import { IconografiaTema } from '../componentes/pages/acervo/temas/IconografiaTema';
import { IconografiaDetalle } from '../componentes/pages/acervo/detalles/IconografiaDetalle';
import { EditarIconografia } from '../componentes/pages/formularios/Editores/EditarIconografia';
import { Libros } from '../componentes/pages/acervo/Libros';
import { LibrosTema } from '../componentes/pages/acervo/temas/LibrosTema';
import { LibrosDetalle } from '../componentes/pages/acervo/detalles/LibrosDetalle';
import { EditarLibros } from '../componentes/pages/formularios/Editores/EditarLibros';
import { Correspondencia } from '../componentes/pages/acervo/Correspondencia';
import { CorrespondenciaTema } from '../componentes/pages/acervo/temas/CorrespondenciaTema';
import { CorrespondenciaDetalle } from '../componentes/pages/acervo/detalles/CorrespondenciaDetalle';
import { EditarCorrespondencia } from '../componentes/pages/formularios/Editores/EditarCorrespondencia';
import { Documentacion } from '../componentes/pages/acervo/Documentacion';
import { DocumentacionDetalle } from '../componentes/pages/acervo/detalles/DocumentacionDetalles';
import { DocumentacionTema } from '../componentes/pages/acervo/temas/DocumentacionTemas';
import { Partituras } from '../componentes/pages/acervo/Partituras';
import { Objetos } from '../componentes/pages/acervo/Objetos';
import { Monumentos } from '../componentes/pages/acervo/Monumentos';
import { PartiturasTema } from '../componentes/pages/acervo/temas/PartiturasTema';
import { ObjetosTema } from '../componentes/pages/acervo/temas/ObjetosTemas';
import { MonumentosTema } from '../componentes/pages/acervo/temas/MonumentosTemas';
import { MonumentosDetalle } from '../componentes/pages/acervo/detalles/MonumentosDetalle';
import { ObjetosDetalle } from '../componentes/pages/acervo/detalles/ObjetosDetalle';
import { PartiturasDetalle } from '../componentes/pages/acervo/detalles/PartiturasDetalle';
import { EditarDocumentacion } from '../componentes/pages/formularios/Editores/EditarDocumentacion';
import { EditarPartituras } from '../componentes/pages/formularios/Editores/EditarPartituras';
import { EditarObjetos } from '../componentes/pages/formularios/Editores/EditarObjetos';
import { EditarMonumentos } from '../componentes/pages/formularios/Editores/EditarMonumentos';
import { RegInstituciones } from '../componentes/pages/formularios/RegInstituciones';
import { InstitucionesDetalle } from '../componentes/pages/acervo/detalles/InstitucionesDetalles';
import { FotografiasInstitucion} from '../componentes/pages/instituciones/FotografiasInstitucion';
import { IconografiaInstitucion } from '../componentes/pages/instituciones/IconografiaInstitucion';
import { LibrosInstitucion } from '../componentes/pages/instituciones/LibrosInstitucion';
import { HemerografiaInstitucion } from '../componentes/pages/instituciones/HemerografiaInstitucion';
import { PartiturasInstitucion } from '../componentes/pages/instituciones/PartiturasInstitucion';
import { ObjetosInstitucion } from '../componentes/pages/instituciones/ObjetosInstitucion';
import { MonumentosInstitucion } from '../componentes/pages/instituciones/MonumentosInstitucion';
import { CorrespondenciaInstitucion } from '../componentes/pages/instituciones/CorrespondenciaInstitucion';
import { DocumentacionInstitucion } from '../componentes/pages/instituciones/DocumentacionInstitucion';
import { HemerografiaInstitucionTema } from '../componentes/pages/instituciones/temas/HemerografiaInstitucionTema';
import { IconografiaInstitucionTema } from '../componentes/pages/instituciones/temas/IconografiaInstitucionTema';
import { DocumentacionInstitucionTema } from '../componentes/pages/instituciones/temas/DocumentacionInstitucionTemas';
import { LibrosInstitucionTema } from '../componentes/pages/instituciones/temas/LibrosInstitucionTema';
import { PartiturasInstitucionTema } from '../componentes/pages/instituciones/temas/PartiturasInstitucionTema';
import { CorrespondenciaInstitucionTema } from '../componentes/pages/instituciones/temas/CorrespondenciaInstitucionTema';
import { ObjetosInstitucionTema } from '../componentes/pages/instituciones/temas/ObjetosInstitucionTemas';
import { MonumentosInstitucionTema } from '../componentes/pages/instituciones/temas/MonumentosInstitucionTemas';
import { FotografiaInstitucionTema } from '../componentes/pages/instituciones/temas/FotografiaInstitucionTema';
import { EditarInstitucion } from '../componentes/pages/formularios/Editores/EditarInstitucion';
import { FotografiaTema } from '../componentes/pages/acervo/temas/FotografiaTema';
import { CarpetasRecortes } from '../componentes/pages/acervo/temas/CarpetasRecortes';
import { CarpetaRecortes } from '../componentes/pages/acervo/temas/CarpetaRecortes';
import { RegPeriodicos2 } from '../componentes/pages/formularios/RegPeriodicos2';
import { EditarPeriodicos } from '../componentes/pages/formularios/Editores/EditarPeriodicos';
import { Secciones } from '../componentes/pages/acervo/temas/Secciones';
import { Seccion } from '../componentes/pages/acervo/temas/Seccion';
import { PendientesHemerografia } from '../componentes/pages/acervo/temas/PendientesHemerografia';
import RequireRole from '../context/RequireRole';
import { Tienda } from '../componentes/pages/Tienda';
import { PagoSuccess } from '../componentes/pages/PagoSuccess';
import { Bien } from '../componentes/pages/acervo/Bien';
import { Tema } from '../componentes/pages/acervo/temas/Tema';
import { PeriodicoDetalle } from '../componentes/pages/acervo/detalles/PeriodicoDetalle';
import { Detalle } from '../componentes/pages/acervo/detalles/Detalle';

export const Rutas = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<PublicLayout2 />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="registrar" element={<Register />} />
            <Route path="inicio" element={<Inicio />} />
            <Route path="registro" element={<Registro />} />
            <Route path="acervo" element={<Acervo />} />
            <Route path="cronologia" element={<Croonologia />} />
            <Route path="instituciones" element={<Instituciones />} />
            <Route path="registro/menu-iconografia" element={<Menuiconografia />} />
            <Route path="registro/fotografia" element={<RegFotografia />} />
            <Route path="registro/iconografia" element={<RegIconografia />} />
            <Route path="registro/libros" element={<RegLibros />} />
            <Route path="registro/periodicos" element={<RegPeriodicos />} />
            <Route path="registro/correspondencia" element={<RegCorrespondencia />} />
            <Route path="registro/documentacion" element={<RegDocumentacion />} />
            <Route path="registro/objetos" element={<RegObjetos />} />
            <Route path="registro/partituras" element={<RegPartituras />} />
            <Route path="registro/monumentos" element={<RegMonumentos />} />
            <Route path="registro/audiovisuales" element={<RegAudiovisuales />} />
            <Route path="fotografias" element={<Fotografias2 />} />
            
            <Route path="fotografias/:id" element={<FotoDetalle />} />
            <Route path="fotografias2" element={<Fotografias2 />} />
            <Route path="tema/Cortejo fúnebre" element={<Cortejo />} />
            <Route path="album/:id" element={<AlbumFotos />} />
          </Route>

          <Route path="/admin" element={<PrivateLayout />}>
            <Route index element={<Inicio />} />
            <Route path="/admin/login" element={<RequireRole allowedRoles={["admin", "premium"]}><Login /> </RequireRole>} />
            <Route path="/admin/registrar" element={<Register />} />
<Route path="/admin/inicio" element={
  <RequireRole allowedRoles={["admin", "premium"]}>
    <Inicio />
  </RequireRole>
} />
            <Route path="/admin/registro" element={<Registro />} />
            <Route path="/admin/acervo" element={<Acervo />} />
            <Route path="/admin/Tienda" element={<Tienda />} /> 
            <Route path="/admin/success" element={<PagoSuccess />} /> 
            <Route path="/admin/Tienda" element={<Tienda />} /> 

            <Route path="/admin/instituciones" element={
  <RequireRole allowedRoles={["admin", "premium"]}>
    <Instituciones />
  </RequireRole>
} />
            <Route path="/admin/registro/menu-iconografia" element={<Menuiconografia />} />
            <Route path="/admin/registro/fotografia" element={<RegFotografia />} />
            <Route path="/admin/editar/fotografia/:id" element={<EditarFotografia />} />
            <Route path="/admin/registro/iconografia" element={<RegIconografia />} />
            <Route path="/admin/registro/libros" element={<RegLibros />} />
            <Route path="/admin/registro/periodicos" element={<RegPeriodicos />} />
            <Route path="/admin/registro/periodicos2" element={<RegPeriodicos2 />} />
            <Route path="/admin/editar/periodicos/:id" element={<EditarPeriodicos />} />
            <Route path="/admin/registro/correspondencia" element={<RegCorrespondencia />} />
            <Route path="/admin/registro/documentacion" element={<RegDocumentacion />} />
            <Route path="/admin/registro/objetos" element={<RegObjetos />} />
            <Route path="/admin/registro/partituras" element={<RegPartituras />} />
            <Route path="/admin/registro/monumentos" element={<RegMonumentos />} />
            <Route path="/admin/registro/audiovisuales" element={<RegAudiovisuales />} />
            <Route path="/admin/registro/instituciones" element={<RegInstituciones />} />

            <Route path="/admin/fotografias" element={ <Bien
      titulo="Temas de Fotografías"
      apiTemasUrl="https://backend-prueba-apel.onrender.com/api/fotografia/listar-temas"
      apiItemsUrl="https://backend-prueba-apel.onrender.com/api/fotografia/listar"
      apiBuscarUrl="https://backend-prueba-apel.onrender.com/api/fotografia/buscar"
      rutaItem="/admin"
      camposBusqueda={[]} // No se necesita búsqueda aquí, pero puedes poner campos si lo agregas después
      campoComparacion="tema" // No se compara con otro dataset, así que este campo será irrelevante
    />} />
            <Route path="/admin/fotografias/:id" element={<FotoDetalle />} />
            <Route path="/admin/fotografias2" element={<Fotografias2 />} />
            <Route path="/admin/tema/Repatriación de los restos de Amado Nervo" element={<Cortejo />} />
            <Route path="/admin/tema/:id" element={<FotografiaTema />} />
            <Route path="/admin/album/:id" element={<AlbumFotos />} />
            

            <Route path="/admin/hemerografia" element={<Bien
  titulo="Periódicos y Revistas"
  apiTemasUrl="http://localhost:3900/api/hemerografia/listar-temas"
  apiItemsUrl="http://localhost:3900/api/periodicos/listar"
  apiBuscarUrl="http://localhost:3900/api/hemerografia/buscar"
  rutaItem="/admin/hemerografia"
  camposBusqueda={["texto", "anioInicio", "anioFin", "fecha_publicacion", "pais", "ciudad", "periodico"]}
/>} />
            <Route path="/admin/hemerografia/tema/Recortes de prensa" element={<CarpetasRecortes />} />
            <Route path="/admin/hemerografia/tema/Secciones" element={<Secciones />} />
            <Route path="/admin/hemerografia/tema/pendientes" element={<PendientesHemerografia/>} />
            <Route path="/admin/hemerografia/tema/:id" element={<Tema
                             apiBaseUrl="https://backend-prueba-apel.onrender.com/api/hemerografia"
                             campoNombre="nombre_periodico"
                             rutaItem="/admin/hemerografia"
                             componenteDetalle={PeriodicoDetalle}
                           />} />
            <Route path="/admin/hemerografia/:id" element={<Detalle
    apiBaseUrl="https://backend-prueba-apel.onrender.com/api/hemerografia"
    campoImagenes="imagenes_fb"
    campoPDFs="pdfs"
    tituloCampo="tema"
    camposNavegacion={["pais", "institucion", "tema"]}
    camposFicha={[
      { etiqueta: "Título", valor: "encabezado" },
      { etiqueta: "Periódico", valor: "nombre_periodico" },
      { etiqueta: "Número de edición", valor: "numero_edicion" },
      { etiqueta: "Fecha de publicación", valor: "fecha_publicacion" },
      { etiqueta: "Autor", valor: "autor" },
      { etiqueta: "Seudónimo", valor: "seudonimo" },
      { etiqueta: "Páginas", valor: "numero_paginas" },
      { etiqueta: "Columnas", valor: "columnas" },
      { etiqueta: "Género periodístico", valor: "genero_periodistico" },
      { etiqueta: "Lugar de publicación", valor: "lugar_publicacion" },
      { etiqueta: "Periodicidad", valor: "periodicidad" },
    ]}
  />} />
            <Route path="/admin/editar/hemerografia/:id" element={<EditarHemerografia />} />
            <Route path="/admin/hemerografia/carpeta/:id" element={<CarpetaRecortes/>} />
            <Route path="/admin/hemerografia/seccion/:id" element={<Seccion/>} />
           

            <Route path="/admin/iconografia" element={<Iconografia />} />
            <Route path="/admin/iconografia/tema/:id" element={<IconografiaTema />} />
            <Route path="/admin/iconografia/:id" element={<IconografiaDetalle />} />
            <Route path="/admin/editar/iconografia/:id" element={<EditarIconografia />} />

            <Route path="/admin/libros" element={<Libros />} />
            <Route path="/admin/libros/tema/:id" element={<LibrosTema />} />
            <Route path="/admin/libros/:id" element={<LibrosDetalle />} />
            <Route path="/admin/editar/libros/:id" element={<EditarLibros />} />


            <Route path="/admin/correspondencia" element={<Correspondencia/>} />
            <Route path="/admin/correspondencia/tema/:id" element={<CorrespondenciaTema />} />
            <Route path="/admin/correspondencia/:id" element={<CorrespondenciaDetalle />} />
            <Route path="/admin/editar/correspondencia/:id" element={<EditarCorrespondencia />} />


            <Route path="/admin/documentacion" element={<Documentacion/>} />
            <Route path="/admin/documentacion/tema/:id" element={<DocumentacionTema />} />
            <Route path="/admin/documentacion/:id" element={<DocumentacionDetalle />} />
            <Route path="/admin/editar/documentacion/:id" element={<EditarDocumentacion />} />

            <Route path="/admin/partituras" element={<Partituras/>} />
            <Route path="/admin/partituras/tema/:id" element={<PartiturasTema />} />
            <Route path="/admin/partituras/:id" element={<PartiturasDetalle />} />
            <Route path="/admin/editar/partituras/:id" element={<EditarPartituras />} />
            
            <Route path="/admin/objetos" element={<Objetos/>} />
            <Route path="/admin/objetos/tema/:id" element={<ObjetosTema />} />
            <Route path="/admin/objetos/:id" element={<ObjetosDetalle />} />
            <Route path="/admin/editar/objetos/:id" element={<EditarObjetos />} />
            
            <Route path="/admin/monumentos" element={<Monumentos/>} />
            <Route path="/admin/monumentos/tema/:id" element={<MonumentosTema />} />
            <Route path="/admin/monumentos/:id" element={<MonumentosDetalle />} />
            <Route path="/admin/editar/monumentos/:id" element={<EditarMonumentos />} />

            <Route path="/admin/instituciones/:id" element={<InstitucionesDetalle />} />
            <Route path="/admin/fotografias/institucion/:id" element={<FotografiasInstitucion/>} />
            <Route path="/admin/iconografia/institucion/:id" element={<IconografiaInstitucion/>} />
            <Route path="/admin/libros/institucion/:id" element={<LibrosInstitucion/>} />
            <Route path="/admin/hemerografia/institucion/:id" element={<HemerografiaInstitucion/>} />
            <Route path="/admin/correspondencia/institucion/:id" element={<CorrespondenciaInstitucion/>} />
            <Route path="/admin/documentacion/institucion/:id" element={<DocumentacionInstitucion/>} />
            <Route path="/admin/partituras/institucion/:id" element={<PartiturasInstitucion/>} />
            <Route path="/admin/objetos/institucion/:id" element={<ObjetosInstitucion/>} />
            <Route path="/admin/monumentos/institucion/:id" element={<MonumentosInstitucion/>} />

            <Route path="/admin/fotografia/:institucionId/:tema" element={<FotografiaInstitucionTema />} />
            <Route path="/admin/hemerografia/:institucionId/:tema" element={<HemerografiaInstitucionTema />} />
            <Route path="/admin/iconografia/:institucionId/:tema" element={<IconografiaInstitucionTema />} />
            <Route path="/admin/documentacion/:institucionId/:tema" element={<DocumentacionInstitucionTema />} />
            <Route path="/admin/libros/:institucionId/:tema" element={<LibrosInstitucionTema />} />
            <Route path="/admin/partituras/:institucionId/:tema" element={<PartiturasInstitucionTema />} />
            <Route path="/admin/correspondencia/:institucionId/:tema" element={<CorrespondenciaInstitucionTema />} />
            <Route path="/admin/objetos/:institucionId/:tema" element={<ObjetosInstitucionTema />} />
            <Route path="/admin/monumentos/:institucionId/:tema" element={<MonumentosInstitucionTema />} />

            <Route path="/admin/editar/institucion/:id" element={<EditarInstitucion />} />

            <Route path='/admin/logout' element={<Logout/>}/>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
