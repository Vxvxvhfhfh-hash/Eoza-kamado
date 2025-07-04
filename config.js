module.exports = {
    // Configuration du Bot
    BOT_CONFIG: {
        name: 'Sir Bot le Médiéval',
        version: '1.0.0',
        prefix: '/',
        kingdom: 'Royaume de WhatsApp',
        language: 'fr'
    },

    // Configuration WhatsApp
    WHATSAPP_CONFIG: {
        session: 'medieval-bot-session',
        qrCodeInTerminal: true,
        headless: true,
        timeout: 60000
    },

    // Configuration IA
    AI_CONFIG: {
        provider: 'openai', // ou 'local'
        model: 'gpt-3.5-turbo',
        maxTokens: 150,
        temperature: 0.8,
        medievalPersonality: true
    },

    // Configuration des images
    IMAGE_CONFIG: {
        directory: './images',
        maxSize: '10MB',
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
        placeholderAPI: 'https://picsum.photos'
    },

    // Messages du royaume
    MESSAGES: {
        startup: '🏰 Bot Médiéval démarré avec succès !',
        shutdown: '🏰 Bot Médiéval arrêté. Au revoir !',
        error: '⚠️ Une erreur s\'est produite dans le royaume...',
        unauthorized: '🚫 Vous n\'avez pas l\'autorisation, noble voyageur.'
    },

    // Paramètres de sécurité
    SECURITY: {
        adminNumbers: [], // Numéros autorisés pour les commandes admin
        allowGroups: true,
        rateLimit: {
            maxMessages: 10,
            timeWindow: 60000 // 1 minute
        }
    }
};