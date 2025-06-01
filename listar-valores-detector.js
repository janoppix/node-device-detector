const osSystems = require('node-device-detector/parser/os/os_systems');
const deviceTypes = require('node-device-detector/parser/const/device-type');
const clientTypes = require('node-device-detector/parser/const/client-type');

console.log('Sistemas Operativos posibles:');
Object.values(osSystems).sort().forEach(os => console.log(os));

console.log('Tipos de dispositivo posibles:');
Object.values(deviceTypes).sort().forEach(type => console.log(type));

console.log('Tipos de cliente posibles:');
Object.values(clientTypes).sort().forEach(type => console.log(type));