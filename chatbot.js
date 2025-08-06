const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const qrcodeBrowser = require('qrcode');

const delay = ms => new Promise(res => setTimeout(res, ms));

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'default' }),
  puppeteer: {
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
    ],
  },
});

client.on('qr', (qr) => {
  console.log('QR RECEIVED');
  
  // Opção para terminal (mantida)
  qrcode.generate(qr, { small: true, type: 'terminal' });
  
  // Nova opção para navegador (mais limpo)
  qrcodeBrowser.toDataURL(qr, (err, url) => {
    if (!err) {
      console.log(`Acesse este link para escanear no navegador: ${url}`);
    }
  });
});

client.on('ready', () => {
  console.log('✅ Bot pronto!');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Falha de autenticação:', msg);
});

client.on('disconnected', (reason) => {
  console.error('⚠️ Desconectado:', reason);
});

client.on('message', async (msg) => {
  try {
    if (/(menu|dia|tarde|noite|oi|olá|ola)/i.test(msg.body) && msg.from.endsWith('@c.us')) {
      const chat = await msg.getChat();
      const contact = await msg.getContact();
      const firstName = (contact.pushname || 'amigo').split(' ')[0];

      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);

      await client.sendMessage(
        msg.from,
        `Olá, ${firstName}! Sou o assistente virtual da empresa tal. Como posso ajudar?\n\n` +
        `1 - Como funciona\n2 - Valores dos planos\n3 - Benefícios\n4 - Como aderir\n5 - Outras perguntas`
      );

      await delay(3000);
      await chat.sendStateTyping();
      await delay(5000);
    }
  } catch (err) {
    console.error('Erro ao processar mensagem:', err);
  }
});

client.initialize();

