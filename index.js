const { Client } = require('whatsapp-web.js');
const client = new Client();
const qrcode = require('qrcode-terminal');
const nodemailer = require('nodemailer'); // npm install nodemailer
const readline = require('readline');
 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu-email@gmail.com',
    pass: 'tu-contraseña'
  }
});
 
async function run() {
  try {
    client.on('qr', qr => {
      qrcode.generate(qr, { small: true });
    });
 
    client.on('ready', () => {
      console.log('¡Bien! WhatsApp conectado.');
    });
 
    await client.initialize();
 
    function cumprimentar() {
      const dataAtual = new Date();
      const hora = dataAtual.getHours();
 
      let saudacao;
 
      if (hora >= 6 && hora < 12) {
        saudacao = "Hola buenos días!";
      } else if (hora >= 12 && hora < 17) {
        saudacao = "Hola buenas tardes!";
      } else {
        saudacao = "Hola buenas noches!";
      }
 
      return saudacao;
    }
 
    function obtenerFechaHora() {
      const fechaHoraActual = new Date();
      return `La fecha y hora actuales son: ${fechaHoraActual}`;
    }
 
    const menu = `
    Bienvenido al Bot de Servicios:
    1. Saludo
    2. Obtener fecha y hora
    `;
 
    const delay = ms => new Promise(res => setTimeout(res, ms));
 
    client.on('message', async msg => {
      if (
        msg.body.match(/(buenas noches|buenos dias|buenas tardes|hola|dia|informacion|Imagen|videos|audios|teste)/i) &&
        msg.from.endsWith('@c.us')
      ) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        await delay(2000);
        const saudacoes = cumprimentar();
        await client.sendMessage(msg.from, `${menu} `);
      } else if (msg.body.match(/(1|saludo)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        const saudacoes = cumprimentar();
        await client.sendMessage(msg.from, saudacoes);
      } else if (msg.body.match(/(2|fecha y hora)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        const fechaHora = obtenerFechaHora();
        await client.sendMessage(msg.from, fechaHora);
      } else if (msg.body.match(/menu/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        await client.sendMessage(msg.from, menu);
      }
    });
 
    function waitForResponse() {
      return new Promise((resolve, reject) => {
        client.on('message', async msg => {
          if (msg.from.endsWith('@c.us')) {
            resolve(msg);
          }
        });
      });
    }
  } catch (error) {
    console.error('Error en la ejecución:', error);
  }
}
 
run().catch(err => console.error(err));