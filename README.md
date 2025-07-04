# 🏰 Bot WhatsApp Médiéval avec IA 🗡️

Un bot WhatsApp interactif avec thème médiéval, intelligence artificielle et génération d'images magiques !

## ✨ Fonctionnalités

### 🔐 Connexion
- **Scan QR Code** - Méthode classique WhatsApp Web
- **Pairing Code** - Code de liaison pour mobile
- **Authentification sécurisée** avec LocalAuth

### 🧙‍♂️ Intelligence Artificielle
- **Personnalité médiévale** - Répond comme un chevalier
- **Réponses contextuelles** - Comprend les thèmes médiévaux
- **Support OpenAI** (optionnel) - Intégration GPT pour réponses avancées
- **IA locale** - Fonctionne sans API externe

### 🎨 Génération d'Images
- **Images magiques** - Génère des images sur commande
- **API multiples** - Unsplash, Picsum et plus
- **Images locales** - Support des images stockées
- **Légendes personnalisées** - Chaque image a sa description

### ⚔️ Commandes du Royaume

| Commande | Description |
|----------|-------------|
| `/start` | 🏰 Débuter votre aventure |
| `/help` | 📜 Voir toutes les commandes |
| `/image [description]` | 🎨 Générer une image magique |
| `/castle` | 🏰 Voir le château royal |
| `/quest` | ⚔️ Partir en quête |
| `/magic` | 🔮 Sorts et enchantements |
| `/knight` | 🛡️ Devenir chevalier |
| `/king` | 👑 Audience royale |
| `/story` | 📖 Entendre une légende |

## 🚀 Installation

### Prérequis
- **Node.js** (v16 ou plus récent)
- **npm** ou **yarn**
- **Compte WhatsApp** 
- Navigateur compatible (Chrome/Chromium)

### 1. Installation des dépendances

```bash
# Installer les packages Node.js
npm install

# Ou avec yarn
yarn install
```

### 2. Configuration (Optionnel)

```bash
# Copier le fichier de configuration
cp config.js config.local.js

# Éditer la configuration
nano config.local.js
```

**Configuration OpenAI (optionnel)** :
```javascript
// Dans config.local.js
AI_CONFIG: {
    provider: 'openai',
    apiKey: 'your-openai-api-key-here',
    model: 'gpt-3.5-turbo',
    maxTokens: 150,
    temperature: 0.8
}
```

### 3. Lancement du Bot

```bash
# Démarrage normal
npm start

# Ou en mode développement
npm run dev
```

## 📱 Connexion WhatsApp

### Méthode 1: QR Code
1. Lancez le bot avec `npm start`
2. Un QR code apparaît dans le terminal
3. Ouvrez WhatsApp sur votre téléphone
4. Allez dans **Paramètres > Appareils liés**
5. Scannez le QR code affiché

### Méthode 2: Pairing Code
1. Le code de pairing s'affiche aussi dans le terminal
2. Sur WhatsApp mobile : **Paramètres > Appareils liés > Lier un appareil**
3. Choisissez **"Lier avec numéro de téléphone"**
4. Entrez le code de pairing à 8 chiffres

## 🏰 Utilisation

### Commandes de Base
```
/start - Débuter l'aventure
/help - Voir l'aide complète
```

### Génération d'Images
```
/image château magique
/image dragon rouge volant
/image chevalier en armure dorée
```

### Interactions IA
Le bot répond automatiquement aux messages :
- **"Bonjour"** → Salutations médiévales
- **"dragon"** → Informations sur les dragons
- **"château"** → Description du royaume
- **Questions** → Réponses contextuelles

### Commandes Avancées
```
/quest - Recevoir une mission épique
/magic - Voir les sorts disponibles  
/knight - Cérémonie d'adoubement
/king - Parler au souverain
/story - Écouter une légende
```

## 🔧 Personnalisation

### Modifier les Réponses
Éditez le fichier `app.js` section `MEDIEVAL_CONFIG` :

```javascript
responses: {
    welcome: 'Votre message de bienvenue',
    help: 'Votre menu d\'aide personnalisé',
    // ...
}
```

### Ajouter des Images
Placez vos images dans le dossier `./images/` :
- `castle.jpg` - Image du château
- `knight.jpg` - Image de chevalier  
- `dragon.jpg` - Image de dragon
- `magic.jpg` - Image de magie

### Intégrer OpenAI
1. Obtenez une clé API sur [OpenAI](https://platform.openai.com)
2. Modifiez `config.js` :
```javascript
AI_CONFIG: {
    provider: 'openai',
    apiKey: 'sk-your-api-key-here'
}
```

## 📂 Structure du Projet

```
📁 whatsapp-medieval-bot/
├── 📄 app.js                 # Application principale
├── 📄 config.js              # Configuration
├── 📄 ai-handler.js          # Gestion IA
├── 📄 image-generator.js     # Génération d'images
├── 📄 package.json           # Dépendances
├── 📄 README.md              # Documentation
└── 📁 images/                # Dossier images
    ├── castle.jpg
    ├── knight.jpg
    └── ...
```

## 🛡️ Sécurité

### Authentification
- Session WhatsApp chiffrée et stockée localement
- Pas de données sensibles en ligne
- Support des groupes sécurisé

### Rate Limiting
Le bot intègre une protection contre le spam :
- Maximum 10 messages par minute par utilisateur
- Limitation automatique des requêtes API

### Permissions
```javascript
// Dans config.js
SECURITY: {
    adminNumbers: ['+33612345678'], // Admins du bot
    allowGroups: true,              // Autoriser les groupes
    rateLimit: {
        maxMessages: 10,
        timeWindow: 60000
    }
}
```

## 🐛 Dépannage

### Erreurs Communes

**"Error: ENOENT: no such file or directory"**
```bash
# Créer le dossier images
mkdir images
```

**"Error: spawn chrome ENOENT"**
```bash
# Installer Chrome/Chromium
sudo apt-get install chromium-browser
```

**"Cannot connect to WhatsApp"**
- Vérifiez votre connexion internet
- Redémarrez le bot avec `npm start`
- Supprimez le dossier `.wwebjs_auth` et reconnectez-vous

### Logs de Debug
```bash
# Voir les logs détaillés
DEBUG=* npm start
```

### Reset du Bot
```bash
# Supprimer la session et recommencer
rm -rf .wwebjs_auth
npm start
```

## 🔄 Mise à Jour

```bash
# Mettre à jour les dépendances
npm update

# Mettre à jour WhatsApp Web.js
npm install whatsapp-web.js@latest
```

## 🤝 Contribuer

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** sur la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🏰 Support

- **Issues** : [GitHub Issues](https://github.com/votre-repo/issues)
- **Documentation** : Ce README
- **Exemples** : Dossier `examples/`

## 🌟 Fonctionnalités Futures

- [ ] 🎵 Sons médiévaux
- [ ] 🗺️ Carte du royaume interactive
- [ ] 👥 Système de guildes
- [ ] 🏆 Achievements et récompenses
- [ ] 💰 Économie virtuelle
- [ ] 🎮 Mini-jeux médiévaux
- [ ] 🔮 Intégration DALL-E pour images
- [ ] 🗣️ Synthèse vocale médiévale

---

**🏰 Que votre aventure commence, noble voyageur ! ⚔️**