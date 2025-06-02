// =======================
// 1. DEPENDENCIAS Y CONFIGURACIÓN
// =======================
const express = require("express");
const fs = require("fs");
const path = require("path");
const DeviceDetector = require("node-device-detector");
let config = require("./config.json");

// =======================
// 2. CATÁLOGOS DE DATOS
// =======================
const osSystems = Object.values(require('node-device-detector/parser/os/os_systems')).sort();
const deviceTypes = Object.values(require('node-device-detector/parser/const/device-type')).sort();
const clientTypes = Object.values(require('node-device-detector/parser/const/client-type')).sort();
const browsers = Object.values(require('node-device-detector/parser/client/browser-short')).sort();
const brands = Object.values(require('node-device-detector/parser/device/brand-short')).sort();

// =======================
// 3. INICIALIZACIÓN DE EXPRESS
// =======================
const app = express();
const detector = new DeviceDetector();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// =======================
// 4. FUNCIONES UTILITARIAS
// =======================
function limpieza(v) {
  return Array.isArray(v)
    ? v.map((s) => s.trim()).filter(Boolean)
    : typeof v === "string"
    ? v.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];
}

function obtenerMotivosBloqueo(config, result) {
  const motivos = [];
  if (config.bloqueo.dispositivos?.includes(result.device?.type)) {
    motivos.push(`Tipo de dispositivo: ${result.device?.type}`);
  }
  if (config.bloqueo.marcas?.includes(result.device?.brand)) {
    motivos.push(`Marca: ${result.device?.brand}`);
  }
  if (config.bloqueo.modelos?.includes(result.device?.model)) {
    motivos.push(`Modelo: ${result.device?.model}`);
  }
  if (config.bloqueo.sistemas_operativos?.includes(result.os?.name)) {
    motivos.push(`Sistema operativo: ${result.os?.name}`);
  }
  if (config.bloqueo.navegadores?.includes(result.client?.name)) {
    motivos.push(`Navegador: ${result.client?.name}`);
  }
  if (config.bloqueo.tipos_cliente?.includes(result.client?.type)) {
    motivos.push(`Tipo de cliente: ${result.client?.type}`);
  }
  return motivos;
}

// =======================
// 5. RUTAS
// =======================

// Página principal
app.get("/", (req, res) => {
  const ua = req.headers["user-agent"] || "";
  const result = detector.detect(ua);
  const motivosBloqueo = obtenerMotivosBloqueo(config, result);
  const bloqueado = motivosBloqueo.length > 0;
  res.render("resultado", { ua, result, bloqueado, motivosBloqueo });
});

// Formulario de configuración
app.get("/formulario", (req, res) => {
  res.render("formulario", {
    osSystems,
    deviceTypes,
    clientTypes,
    browsers,
    brands,
    bloqueo: config.bloqueo
  });
});

// Guardar configuración
app.post("/config", (req, res) => {
  const entradas = req.body.bloqueo || {};
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
    res.render("config-guardada");
  });
});

// =======================
// 6. ARRANQUE DEL SERVIDOR
// =======================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
