const express = require("express");
const fs = require("fs");
const path = require("path");
const DeviceDetector = require("node-device-detector");
let config = require("./config.json");

const app = express();
const detector = new DeviceDetector();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta principal que detecta y muestra info del dispositivo
app.get("/", (req, res) => {
  const ua = req.headers["user-agent"] || "";
  const result = detector.detect(ua);

  const bloqueado =
    config.bloqueo.dispositivos?.includes(result.device?.type) ||
    config.bloqueo.marcas?.includes(result.device?.brand) ||
    config.bloqueo.modelos?.includes(result.device?.model) ||
    config.bloqueo.sistemas_operativos?.includes(result.os?.name) ||
    config.bloqueo.navegadores?.includes(result.client?.name) ||
    config.bloqueo.tipos_cliente?.includes(result.client?.type);

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Resultado de Detección</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
      <div class="container py-5">
        <h1 class="mb-4">${bloqueado ? "🚫 Acceso restringido" : "✅ Acceso permitido"}</h1>

        <div class="card mb-4">
          <div class="card-header fw-bold">Dispositivo Detectado</div>
          <div class="card-body">
            <p><strong>User-Agent:</strong> ${ua}</p>
            <p><strong>Tipo:</strong> ${result.device?.type || "N/A"}</p>
            <p><strong>Marca:</strong> ${result.device?.brand || "N/A"}</p>
            <p><strong>Modelo:</strong> ${result.device?.model || "N/A"}</p>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header fw-bold">Sistema Operativo</div>
          <div class="card-body">
            <p><strong>Nombre:</strong> ${result.os?.name || "N/A"}</p>
            <p><strong>Versión:</strong> ${result.os?.version || "N/A"}</p>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header fw-bold">Cliente</div>
          <div class="card-body">
            <p><strong>Tipo:</strong> ${result.client?.type || "N/A"}</p>
            <p><strong>Nombre:</strong> ${result.client?.name || "N/A"}</p>
            <p><strong>Versión:</strong> ${result.client?.version || "N/A"}</p>
          </div>
        </div>

        <a href="/formulario" class="btn btn-secondary">Volver al formulario de bloqueo</a>
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

// Muestra el formulario de configuración
app.get("/formulario", (req, res) => {
  res.sendFile(path.join(__dirname, "formulario.html"));
});

// Actualiza la configuración desde el formulario
app.post("/config", (req, res) => {
  const entradas = req.body.bloqueo || {};
  const limpieza = (v) =>
    Array.isArray(v)
      ? v.map((s) => s.trim()).filter(Boolean)
      : typeof v === "string"
      ? v.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];

  const nuevaConfig = {
    bloqueo: {
      dispositivos: limpieza(entradas.dispositivos),
      marcas: limpieza(entradas.marcas),
      modelos: limpieza(
        entradas.modelos
          ? entradas.modelos.split(",").map((m) => m.trim())
          : []
      ),
      sistemas_operativos: limpieza(entradas.sistemas_operativos),
      navegadores: limpieza(entradas.navegadores),
      tipos_cliente: limpieza(entradas.tipos_cliente),
    },
  };

  fs.writeFile("config.json", JSON.stringify(nuevaConfig, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: "Error al guardar configuración" });
    }

    delete require.cache[require.resolve("./config.json")];
    config = require("./config.json");

    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Configuración actualizada</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body class="bg-light">
        <div class="container py-5">
          <h1 class="mb-4 text-success">✅ Configuración guardada correctamente</h1>
          <a href="/" class="btn btn-primary">Volver al inicio</a>
        </div>
      </body>
      </html>
    `);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
