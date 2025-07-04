const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

class MedievalImageGenerator {
    constructor() {
        this.imagesDir = './images';
        this.ensureImagesDirectory();
        this.placeholderAPI = 'https://picsum.photos';
        this.unsplashAPI = 'https://source.unsplash.com';
    }

    async ensureImagesDirectory() {
        if (!fs.existsSync(this.imagesDir)) {
            fs.mkdirSync(this.imagesDir, { recursive: true });
            console.log('📁 Dossier images créé'.green);
        }
    }

    async generateImage(description, type = 'general') {
        try {
            console.log(`🎨 Génération image: ${description}`);
            
            // Essayer différentes sources d'images
            const imageBuffer = await this.getImageFromAPI(description, type);
            
            if (imageBuffer) {
                const media = new MessageMedia('image/jpeg', imageBuffer.toString('base64'));
                return {
                    media,
                    caption: this.generateImageCaption(description, type)
                };
            }
            
            throw new Error('Impossible de générer l\'image');
            
        } catch (error) {
            console.error('❌ Erreur génération image:', error);
            return null;
        }
    }

    async getImageFromAPI(description, type) {
        const imageQueries = this.buildImageQueries(description, type);
        
        for (const query of imageQueries) {
            try {
                // Essayer Unsplash en premier
                const unsplashUrl = `${this.unsplashAPI}/800x600/?${query}`;
                let response = await axios.get(unsplashUrl, { 
                    responseType: 'arraybuffer',
                    timeout: 10000
                });
                
                if (response.data) {
                    return Buffer.from(response.data);
                }
            } catch (error) {
                console.log(`⚠️ Échec Unsplash pour: ${query}`);
            }
            
            try {
                // Fallback sur Picsum
                const picsumUrl = `${this.placeholderAPI}/800/600?random=${Date.now()}`;
                let response = await axios.get(picsumUrl, { 
                    responseType: 'arraybuffer',
                    timeout: 10000
                });
                
                if (response.data) {
                    return Buffer.from(response.data);
                }
            } catch (error) {
                console.log('⚠️ Échec Picsum');
            }
        }
        
        return null;
    }

    buildImageQueries(description, type) {
        const baseQueries = {
            castle: ['castle', 'medieval+castle', 'fortress', 'architecture'],
            knight: ['knight', 'armor', 'medieval+warrior', 'sword'],
            dragon: ['dragon', 'fantasy', 'medieval+dragon', 'creature'],
            magic: ['magic', 'wizard', 'spell', 'fantasy+magic'],
            quest: ['adventure', 'journey', 'medieval+quest', 'exploration'],
            king: ['crown', 'royal', 'throne', 'king'],
            medieval: ['medieval', 'middle+ages', 'historical', 'ancient']
        };

        const queries = baseQueries[type] || baseQueries.medieval;
        
        // Ajouter la description si fournie
        if (description && description.length > 0) {
            const cleanDesc = description.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '+');
            queries.unshift(cleanDesc);
            queries.push(`medieval+${cleanDesc}`);
        }
        
        return queries;
    }

    generateImageCaption(description, type) {
        const captions = {
            castle: '🏰 Magnifique château royal',
            knight: '⚔️ Noble chevalier en armure',
            dragon: '🐉 Dragon légendaire',
            magic: '🔮 Arts magiques anciens',
            quest: '🗡️ Aventure épique',
            king: '👑 Majesté royale',
            general: '✨ Image magique créée'
        };

        const baseCaption = captions[type] || captions.general;
        
        if (description && description.length > 0) {
            return `🎨 **${baseCaption}** ✨\n\n📝 *${description}*\n🧙‍♂️ Invoquée par la magie du royaume !`;
        }
        
        return `🎨 **${baseCaption}** ✨\n🧙‍♂️ Invoquée par la magie du royaume !`;
    }

    async getLocalImage(imageName) {
        const imagePath = path.join(this.imagesDir, imageName);
        
        if (fs.existsSync(imagePath)) {
            try {
                const media = MessageMedia.fromFilePath(imagePath);
                return media;
            } catch (error) {
                console.error(`❌ Erreur lecture image locale ${imageName}:`, error);
                return null;
            }
        }
        
        return null;
    }

    async downloadAndSaveImage(url, filename) {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            const filepath = path.join(this.imagesDir, filename);
            
            fs.writeFileSync(filepath, buffer);
            console.log(`💾 Image sauvée: ${filename}`);
            
            return filepath;
        } catch (error) {
            console.error(`❌ Erreur sauvegarde image ${filename}:`, error);
            return null;
        }
    }

    createImageCollage(images, title) {
        // Fonctionnalité future : créer un collage d'images
        // Nécessiterait Canvas ou une librairie d'image processing
        return null;
    }

    getImageStats() {
        try {
            const files = fs.readdirSync(this.imagesDir);
            const imageFiles = files.filter(file => 
                /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
            );
            
            return {
                totalImages: imageFiles.length,
                directory: this.imagesDir,
                files: imageFiles
            };
        } catch (error) {
            return {
                totalImages: 0,
                directory: this.imagesDir,
                files: [],
                error: error.message
            };
        }
    }

    async generateWelcomeImage() {
        return await this.generateImage('medieval castle welcome', 'castle');
    }

    async generateRandomMedievalImage() {
        const types = ['castle', 'knight', 'dragon', 'magic'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        return await this.generateImage('', randomType);
    }

    // Images prédéfinies pour différentes commandes
    async getCastleImage() {
        const localImage = await this.getLocalImage('castle.jpg');
        if (localImage) return { media: localImage, caption: '🏰 Le château royal !' };
        
        return await this.generateImage('magnificent medieval castle', 'castle');
    }

    async getKnightImage() {
        const localImage = await this.getLocalImage('knight.jpg');
        if (localImage) return { media: localImage, caption: '⚔️ Noble chevalier !' };
        
        return await this.generateImage('brave medieval knight', 'knight');
    }

    async getDragonImage() {
        const localImage = await this.getLocalImage('dragon.jpg');
        if (localImage) return { media: localImage, caption: '🐉 Dragon légendaire !' };
        
        return await this.generateImage('epic medieval dragon', 'dragon');
    }

    async getMagicImage() {
        const localImage = await this.getLocalImage('magic.jpg');
        if (localImage) return { media: localImage, caption: '🔮 Magie ancienne !' };
        
        return await this.generateImage('medieval wizard magic', 'magic');
    }
}

module.exports = MedievalImageGenerator;