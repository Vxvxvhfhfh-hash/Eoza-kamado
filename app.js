const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const colors = require('colors');

// Configuration du bot médiéval
const MEDIEVAL_CONFIG = {
    botName: '🏰 Sir Bot le Médiéval 🗡️',
    kingdom: 'Royaume de WhatsApp',
    responses: {
        welcome: '🏰 Salutations, noble voyageur ! Je suis Sir Bot, gardien de ce royaume numérique. Comment puis-je vous servir en ce jour béni ?',
        help: `🗡️ *COMMANDES DU ROYAUME* 🏰

📜 */start* - Débuter votre quête
🎨 */image [description]* - Invoquer une image magique
🏰 */castle* - Voir notre château
⚔️ */quest* - Partir en quête
🧙‍♂️ */magic* - Sorts et enchantements
🛡️ */knight* - Devenir chevalier
👑 */king* - Parler au roi
📖 */story* - Entendre une légende`,
        
        error: '⚠️ Pardonnez-moi, noble seigneur, mais je ne comprends point votre requête...',
        magic: '🧙‍♂️✨ *SORTS DISPONIBLES* ✨🧙‍♂️\n\n🔮 Divination\n⚡ Éclair foudroyant\n🌟 Lumière sacrée\n🛡️ Protection divine\n🗡️ Épée enchantée'
    },
    images: {
        castle: './images/castle.jpg',
        knight: './images/knight.jpg',
        magic: './images/magic.jpg',
        quest: './images/quest.jpg',
        king: './images/king.jpg'
    }
};

class MedievalWhatsAppBot {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth({
                clientId: "medieval-bot"
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            }
        });
        
        this.initializeBot();
        this.setupEventHandlers();
    }

    initializeBot() {
        console.log('🏰 Initialisation du Bot Médiéval WhatsApp...'.blue.bold);
        
        // QR Code pour connexion
        this.client.on('qr', (qr) => {
            console.log('\n🗡️ SCANNEZ CE QR CODE POUR VOUS CONNECTER 🗡️'.yellow.bold);
            qrcode.generate(qr, { small: true });
            console.log('\n📱 Ou utilisez le pairing code ci-dessous:'.cyan);
        });

        // Pairing Code (alternative au QR)
        this.client.on('code', (code) => {
            console.log(`\n🔑 CODE DE PAIRING: ${code}`.green.bold);
            console.log('💡 Entrez ce code dans WhatsApp Web > Appareils liés > Lier un appareil > Lier avec numéro de téléphone'.yellow);
        });

        // Connexion réussie
        this.client.on('ready', () => {
            console.log('🏰 LE BOT MÉDIÉVAL EST PRÊT ! 🗡️'.green.bold);
            console.log(`👑 Connecté en tant que: ${this.client.info.pushname}`.cyan);
            console.log(`🏰 Royaume: ${MEDIEVAL_CONFIG.kingdom}`.magenta);
        });

        // Gestion des erreurs
        this.client.on('auth_failure', (msg) => {
            console.error('❌ Échec de l\'authentification:', msg);
        });

        this.client.on('disconnected', (reason) => {
            console.log('🔌 Déconnecté:', reason);
        });
    }

    setupEventHandlers() {
        this.client.on('message', async (message) => {
            try {
                await this.handleMessage(message);
            } catch (error) {
                console.error('❌ Erreur lors du traitement du message:', error);
            }
        });
    }

    async handleMessage(message) {
        // Ignorer les messages du bot
        if (message.fromMe) return;

        const chat = await message.getChat();
        const contact = await message.getContact();
        const text = message.body.toLowerCase().trim();

        console.log(`📜 Message de ${contact.pushname || contact.number}: ${message.body}`.gray);

        // Commandes du royaume
        if (text.startsWith('/')) {
            await this.handleCommand(text, chat, contact);
        } else {
            // Réponse IA médiévale
            await this.handleAIResponse(text, chat, contact);
        }
    }

    async handleCommand(command, chat, contact) {
        const cmd = command.split(' ')[0];
        const args = command.substring(cmd.length).trim();

        switch (cmd) {
            case '/start':
                await this.sendMedievalWelcome(chat, contact);
                break;

            case '/help':
                await chat.sendMessage(MEDIEVAL_CONFIG.responses.help);
                break;

            case '/image':
                await this.generateImage(args, chat);
                break;

            case '/castle':
                await this.sendCastleImage(chat);
                break;

            case '/quest':
                await this.startQuest(chat, contact);
                break;

            case '/magic':
                await this.showMagicSpells(chat);
                break;

            case '/knight':
                await this.makeKnight(chat, contact);
                break;

            case '/king':
                await this.talkToKing(chat, contact);
                break;

            case '/story':
                await this.tellLegend(chat);
                break;

            default:
                await chat.sendMessage(MEDIEVAL_CONFIG.responses.error);
        }
    }

    async sendMedievalWelcome(chat, contact) {
        const welcomeMsg = `🏰 *BIENVENUE AU ROYAUME* 🏰

Salutations, ${contact.pushname || 'Noble Voyageur'} !

${MEDIEVAL_CONFIG.responses.welcome}

🗡️ Tapez */help* pour voir les commandes disponibles
👑 Que votre aventure commence !`;

        await chat.sendMessage(welcomeMsg);
        
        // Envoyer une image de bienvenue si disponible
        if (fs.existsSync('./images/welcome.jpg')) {
            const media = MessageMedia.fromFilePath('./images/welcome.jpg');
            await chat.sendMessage(media, { caption: '🏰 Le château royal vous souhaite la bienvenue !' });
        }
    }

    async generateImage(description, chat) {
        if (!description) {
            await chat.sendMessage('🎨 Veuillez décrire l\'image que vous souhaitez: */image [description]*');
            return;
        }

        await chat.sendMessage('🧙‍♂️ Invocation de l\'image en cours... ✨');

        try {
            // Simulation de génération d'image (remplacez par votre API IA)
            const medievalPrompt = `Medieval fantasy art: ${description}, castle, knights, dragons, magical atmosphere, detailed, fantasy art style`;
            
            // Ici vous pouvez intégrer DALL-E, Midjourney, ou Stable Diffusion
            // Pour la démo, on envoie une image placeholder
            await this.sendPlaceholderImage(chat, description);
            
        } catch (error) {
            console.error('❌ Erreur génération image:', error);
            await chat.sendMessage('🔥 Les dragons ont perturbé la magie... Réessayez plus tard !');
        }
    }

    async sendPlaceholderImage(chat, description) {
        const imageUrl = `https://picsum.photos/800/600?random=${Date.now()}`;
        
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            const media = new MessageMedia('image/jpeg', buffer.toString('base64'));
            await chat.sendMessage(media, { 
                caption: `🎨 *Image Magique Générée* ✨\n\n📝 Description: ${description}\n🧙‍♂️ Créée par la magie du royaume !` 
            });
        } catch (error) {
            console.error('❌ Erreur envoi image:', error);
            await chat.sendMessage('⚠️ Les sorts d\'images sont temporairement indisponibles...');
        }
    }

    async sendCastleImage(chat) {
        const castleMsg = `🏰 *LE CHÂTEAU ROYAL* 🏰

Voici notre magnifique forteresse !
🗡️ Défendue par 1000 chevaliers
👑 Domaine de Sa Majesté
🔮 Protégée par la magie ancienne`;

        await chat.sendMessage(castleMsg);

        // Envoyer image du château
        if (fs.existsSync(MEDIEVAL_CONFIG.images.castle)) {
            const media = MessageMedia.fromFilePath(MEDIEVAL_CONFIG.images.castle);
            await chat.sendMessage(media);
        } else {
            await this.sendPlaceholderImage(chat, 'magnificent medieval castle');
        }
    }

    async startQuest(chat, contact) {
        const quests = [
            '🐉 Terrasser le Dragon des Montagnes Noires',
            '👑 Retrouver la Couronne Perdue du Roi Arthur',
            '🗡️ Forger l\'Épée Légendaire d\'Excalibur',
            '🏰 Défendre le château contre les envahisseurs',
            '🔮 Trouver la Pierre Philosophale',
            '⚔️ Combattre le Chevalier Noir',
            '🧙‍♂️ Apprendre la magie auprès de Merlin'
        ];

        const randomQuest = quests[Math.floor(Math.random() * quests.length)];
        
        const questMsg = `⚔️ *NOUVELLE QUÊTE* ⚔️

Brave ${contact.pushname || 'Chevalier'}, votre mission:

${randomQuest}

🏆 Récompense: 1000 pièces d'or
⏰ Délai: 7 jours
🛡️ Difficulté: Légendaire

Acceptez-vous cette quête ? (Oui/Non)`;

        await chat.sendMessage(questMsg);
    }

    async showMagicSpells(chat) {
        await chat.sendMessage(MEDIEVAL_CONFIG.responses.magic);
        
        // Envoyer image de magie
        if (fs.existsSync(MEDIEVAL_CONFIG.images.magic)) {
            const media = MessageMedia.fromFilePath(MEDIEVAL_CONFIG.images.magic);
            await chat.sendMessage(media, { caption: '🔮 Livre des sorts anciens' });
        }
    }

    async makeKnight(chat, contact) {
        const knightMsg = `⚔️ *CÉRÉMONIE D'ADOUBEMENT* ⚔️

🛡️ Par la grâce de ce royaume,
👑 Au nom de Sa Majesté,
🗡️ Je vous nomme Chevalier !

*Sir ${contact.pushname || 'Noble'}*, vous êtes désormais:
🏰 Protecteur du royaume
⚔️ Défenseur des innocents
🔮 Gardien de la justice

🎉 Félicitations, nouveau chevalier !`;

        await chat.sendMessage(knightMsg);
    }

    async talkToKing(chat, contact) {
        const kingResponses = [
            `👑 Mon fidèle sujet ${contact.pushname || 'Chevalier'}, que me vaut l'honneur de votre visite ?`,
            '🏰 Approchez-vous, brave âme, et dites-moi ce qui vous préoccupe.',
            '👑 En tant que roi de ce royaume, je vous écoute attentivement.',
            '🗡️ Parlez librement, car un bon roi écoute toujours son peuple.'
        ];

        const response = kingResponses[Math.floor(Math.random() * kingResponses.length)];
        await chat.sendMessage(response);
    }

    async tellLegend(chat) {
        const legends = [
            `📖 *LA LÉGENDE DU DRAGON D'OR* 🐉

Il était une fois, dans les temps anciens, un dragon d'or qui gardait le trésor du royaume. Seul un cœur pur pouvait l'approcher...`,

            `📜 *L'HISTOIRE DE L'ÉPÉE MAGIQUE* ⚔️

Dans les profondeurs de la forêt enchantée se trouve une épée plantée dans la pierre. Celui qui la libérera deviendra le roi légitime...`,

            `🏰 *LA PROPHÉTIE DU CHÂTEAU VOLANT* ✨

Les anciens racontent qu'un jour, quand les étoiles s'aligneront, le château s'élèvera dans les cieux pour protéger le royaume...`
        ];

        const randomLegend = legends[Math.floor(Math.random() * legends.length)];
        await chat.sendMessage(randomLegend);
    }

    async handleAIResponse(text, chat, contact) {
        // Réponses IA contextuelle médiévale
        const medievalResponses = this.generateMedievalResponse(text, contact);
        await chat.sendMessage(medievalResponses);
    }

    generateMedievalResponse(text, contact) {
        const name = contact.pushname || 'Noble Voyageur';
        
        // Mots-clés et réponses
        if (text.includes('bonjour') || text.includes('salut') || text.includes('hello')) {
            return `🏰 Salutations ${name} ! Que la paix soit avec vous en ce beau jour !`;
        }
        
        if (text.includes('dragon')) {
            return `🐉 Ah, vous parlez des dragons ! Ces créatures majestueuses gardent les trésors du royaume. Seuls les plus braves osent les affronter !`;
        }
        
        if (text.includes('château') || text.includes('castle')) {
            return `🏰 Notre château est le plus beau du royaume ! Ses tours touchent les nuages et ses murs sont imprenables. Tapez /castle pour le voir !`;
        }
        
        if (text.includes('roi') || text.includes('king')) {
            return `👑 Sa Majesté règne avec sagesse et justice. Souhaitez-vous une audience ? Tapez /king pour lui parler !`;
        }
        
        if (text.includes('magie') || text.includes('magic')) {
            return `🔮 La magie coule dans les veines de ce royaume ! Tapez /magic pour découvrir les sorts disponibles !`;
        }
        
        // Réponse par défaut
        return `🏰 Pardonnez-moi ${name}, je n'ai point saisi votre requête. Tapez /help pour connaître mes pouvoirs !`;
    }

    async start() {
        try {
            await this.createImagesDirectory();
            await this.client.initialize();
        } catch (error) {
            console.error('❌ Erreur démarrage bot:', error);
        }
    }

    async createImagesDirectory() {
        const imagesDir = './images';
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
            console.log('📁 Dossier images créé'.green);
        }
    }
}

// Démarrage du bot
console.log('🏰 DÉMARRAGE DU BOT WHATSAPP MÉDIÉVAL 🗡️'.rainbow.bold);
console.log('=' .repeat(50).yellow);

const bot = new MedievalWhatsAppBot();
bot.start();

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
    console.log('\n🏰 Arrêt du royaume... Au revoir !'.red.bold);
    process.exit(0);
});

module.exports = MedievalWhatsAppBot;