# Node Device Detector Demo

Este proyecto es una demo de cómo usar el plugin [`node-device-detector`](https://www.npmjs.com/package/node-device-detector) en un servidor Express para detectar dispositivos, sistemas operativos, navegadores y más a partir del User-Agent, y restringir el acceso según una configuración editable desde un formulario web.

## Características
- Detecta tipo de dispositivo, marca, modelo, sistema operativo, navegador y tipo de cliente.
- Permite configurar restricciones desde un formulario web con selects dinámicos.
- Muestra el motivo del bloqueo cuando el acceso es restringido.
- Todo el frontend está separado en vistas EJS.

## Requisitos
- Node.js 18 (desarrollado y probado con esta versión)
- npm

## Instalación
1. Clona este repositorio o descarga los archivos.
2. Si usas nvm, cambia a Node 18:
   ```bash
   nvm use 18
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso
1. Inicia el servidor:
   ```bash
   node index.js
   ```
   O si prefieres recarga automática:
   ```bash
   npx nodemon index.js
   ```
2. Abre tu navegador y visita:
   - [http://localhost:3000/formulario](http://localhost:3000/formulario) para configurar los bloqueos.
   - [http://localhost:3000/](http://localhost:3000/) para ver la detección y si el acceso está permitido o restringido.

## Personalización de bloqueos
- Puedes bloquear por:
  - Tipo de dispositivo (ej: smartphone, tablet, desktop...)
  - Marca (ej: Apple, Samsung, etc)
  - Modelo (escribe los modelos separados por coma)
  - Sistema operativo
  - Navegador
  - Tipo de cliente
- El formulario muestra todas las opciones posibles extraídas del plugin.

## Estructura del proyecto
- `index.js`: Lógica principal del servidor y la detección.
- `views/`: Plantillas EJS para el frontend.
- `config.json`: Archivo donde se guarda la configuración de bloqueos.

## Notas
- El campo de modelos es de texto libre porque el plugin no expone un listado completo de modelos.
- Si tienes problemas con dependencias, asegúrate de usar Node.js 18.

## Licencia
MIT 