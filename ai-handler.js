const OpenAI = require('openai');
const config = require('./config');

class MedievalAIHandler {
    constructor(apiKey) {
        this.openai = apiKey ? new OpenAI({ apiKey }) : null;
        this.medievalContext = this.buildMedievalContext();
    }

    buildMedievalContext() {
        return `Tu es Sir Bot le Médiéval, un bot WhatsApp avec une personnalité de chevalier du moyen-âge. 
        Caractéristiques:
        - Tu parles avec un langage médiéval mais compréhensible
        - Tu utilises des emojis : 🏰🗡️⚔️🛡️👑🐉🧙‍♂️✨🔮
        - Tu es noble, courtois et brave
        - Tu fais référence au royaume, aux quêtes, à la magie
        - Tu appelles les utilisateurs "Noble voyageur", "Brave chevalier", etc.
        - Tes réponses sont courtes (max 100 mots)
        - Tu proposes souvent des commandes du bot (/castle, /quest, etc.)`;
    }

    async generateResponse(userMessage, userName = 'Noble Voyageur') {
        // Si pas d'API OpenAI, utiliser les réponses locales
        if (!this.openai) {
            return this.generateLocalResponse(userMessage, userName);
        }

        try {
            const prompt = `${this.medievalContext}

L'utilisateur ${userName} dit: "${userMessage}"

Réponds en tant que Sir Bot le Médiéval:`;

            const completion = await this.openai.chat.completions.create({
                model: config.AI_CONFIG.model,
                messages: [
                    { role: "system", content: this.medievalContext },
                    { role: "user", content: userMessage }
                ],
                max_tokens: config.AI_CONFIG.maxTokens,
                temperature: config.AI_CONFIG.temperature,
            });

            return completion.choices[0].message.content;

        } catch (error) {
            console.error('❌ Erreur IA OpenAI:', error);
            return this.generateLocalResponse(userMessage, userName);
        }
    }

    generateLocalResponse(text, userName) {
        const responses = {
            greetings: [
                `🏰 Salutations ${userName} ! Que la paix soit avec vous !`,
                `⚔️ Bien le bonjour, brave ${userName} ! Prêt pour l'aventure ?`,
                `👑 Bienvenue dans notre royaume, noble ${userName} !`
            ],
            
            thanks: [
                `🛡️ Il n'y a point de quoi, ${userName} ! C'est un honneur de vous servir !`,
                `🏰 Votre gratitude me va droit au cœur, noble voyageur !`,
                `⚔️ Tout l'honneur est pour moi, brave ${userName} !`
            ],
            
            questions: [
                `🤔 Pardonnez-moi ${userName}, je ne saisis point. Tapez /help pour mes pouvoirs !`,
                `🏰 Votre requête m'échappe, noble voyageur. Que puis-je faire pour vous ?`,
                `🗡️ Expliquez-moi mieux votre demande, brave ${userName} !`
            ],
            
            compliments: [
                `😊 Vous me flattez, ${userName} ! Un chevalier reste humble !`,
                `🏰 Vos mots me touchent, noble voyageur !`,
                `⚔️ Merci ${userName}, c'est l'esprit chevaleresque qui parle !`
            ],
            
            default: [
                `🏰 Pardonnez-moi ${userName}, je ne comprends point. Tapez /help !`,
                `⚔️ Votre requête m'échappe, brave ${userName}. Que puis-je pour vous ?`,
                `🛡️ Exprimez-vous autrement, noble voyageur, je vous prie !`
            ]
        };

        // Détection de l'intention
        const lowerText = text.toLowerCase();
        
        if (this.containsWords(lowerText, ['bonjour', 'salut', 'hello', 'hey', 'coucou'])) {
            return this.getRandomResponse(responses.greetings);
        }
        
        if (this.containsWords(lowerText, ['merci', 'thanks', 'thank you', 'gracias'])) {
            return this.getRandomResponse(responses.thanks);
        }
        
        if (this.containsWords(lowerText, ['?', 'comment', 'pourquoi', 'que', 'quoi', 'qui'])) {
            return this.getRandomResponse(responses.questions);
        }
        
        if (this.containsWords(lowerText, ['bien', 'super', 'génial', 'cool', 'bravo', 'excellent'])) {
            return this.getRandomResponse(responses.compliments);
        }
        
        // Réponses thématiques
        if (this.containsWords(lowerText, ['dragon'])) {
            return `🐉 Ah, les dragons ! Ces créatures légendaires gardent nos trésors les plus précieux, ${userName} !`;
        }
        
        if (this.containsWords(lowerText, ['château', 'castle'])) {
            return `🏰 Notre château est magnifique ! Tapez /castle pour le découvrir, ${userName} !`;
        }
        
        if (this.containsWords(lowerText, ['magie', 'magic', 'sort'])) {
            return `🔮 La magie imprègne notre royaume ! Tapez /magic pour voir nos sorts, ${userName} !`;
        }
        
        if (this.containsWords(lowerText, ['roi', 'king', 'reine', 'queen'])) {
            return `👑 Sa Majesté règne avec sagesse ! Tapez /king pour une audience, ${userName} !`;
        }
        
        if (this.containsWords(lowerText, ['quête', 'quest', 'mission', 'aventure'])) {
            return `⚔️ Prêt pour l'aventure ? Tapez /quest pour votre mission, brave ${userName} !`;
        }
        
        return this.getRandomResponse(responses.default);
    }

    containsWords(text, words) {
        return words.some(word => text.includes(word));
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    async generateImagePrompt(description) {
        const basePrompt = "Medieval fantasy art style, detailed, magical atmosphere";
        const enhancedPrompt = `${basePrompt}, ${description}, castle in background, knights, dragons, mystical lighting, epic composition, high quality digital art`;
        
        return enhancedPrompt;
    }

    generateMedievalStory() {
        const stories = [
            {
                title: "🐉 La Légende du Dragon Rouge",
                content: `Il était une fois un dragon rouge qui gardait le trésor royal. Un brave chevalier partit le défier, armé seulement de son courage et d'une épée enchantée...`
            },
            {
                title: "⚔️ L'Épée dans la Pierre",
                content: `Au cœur de la forêt enchantée, une épée légendaire attend celui qui saura la libérer. Les prophéties disent qu'il deviendra le roi légitime...`
            },
            {
                title: "🏰 Le Château Volant",
                content: `Quand les étoiles s'alignent, le château royal s'élève dans les cieux, révélant des merveilles cachées depuis des siècles...`
            },
            {
                title: "🧙‍♂️ Le Sorcier Bienveillant",
                content: `Dans sa tour de cristal, Merlin continue de veiller sur le royaume, enseignant la magie aux âmes pures...`
            },
            {
                title: "👑 La Couronne Perdue",
                content: `La couronne royale disparut lors de la grande bataille. Celui qui la retrouvera sera béni par les dieux...`
            }
        ];

        const randomStory = stories[Math.floor(Math.random() * stories.length)];
        return `📖 **${randomStory.title}**\n\n${randomStory.content}`;
    }

    generateQuest(userName) {
        const quests = [
            {
                title: "🐉 Tuer le Dragon des Montagnes",
                description: "Un terrible dragon terrorise les villages. Partez l'affronter !",
                reward: "1000 pièces d'or",
                difficulty: "Légendaire"
            },
            {
                title: "👑 Retrouver la Couronne Royale",
                description: "La couronne a été volée par des bandits. Ramenez-la !",
                reward: "Titre de Chevalier Royal",
                difficulty: "Difficile"
            },
            {
                title: "🔮 Trouver la Pierre Philosophale",
                description: "Cette pierre magique peut tout transformer en or...",
                reward: "Pouvoirs magiques",
                difficulty: "Épique"
            },
            {
                title: "🏰 Défendre le Château",
                description: "Des envahisseurs approchent ! Organisez la défense !",
                reward: "Honneur éternel",
                difficulty: "Héroïque"
            }
        ];

        const quest = quests[Math.floor(Math.random() * quests.length)];
        
        return `⚔️ **NOUVELLE QUÊTE** ⚔️

🎯 **Mission**: ${quest.title}
📝 **Description**: ${quest.description}
🏆 **Récompense**: ${quest.reward}
⭐ **Difficulté**: ${quest.difficulty}

Acceptez-vous cette quête, ${userName} ?`;
    }
}

module.exports = MedievalAIHandler;