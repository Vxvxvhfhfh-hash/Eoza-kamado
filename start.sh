#!/bin/bash

# Script de démarrage du Bot WhatsApp Médiéval
echo "🏰 DÉMARRAGE DU BOT WHATSAPP MÉDIÉVAL 🗡️"
echo "========================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "💡 Installez Node.js depuis: https://nodejs.org/"
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION'))" 2>/dev/null; then
    echo "⚠️ Node.js version $NODE_VERSION détectée"
    echo "💡 Version requise: $REQUIRED_VERSION ou plus récente"
fi

# Créer le dossier images s'il n'existe pas
if [ ! -d "images" ]; then
    echo "📁 Création du dossier images..."
    mkdir -p images
fi

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des dépendances"
        exit 1
    fi
fi

# Créer le fichier .env s'il n'existe pas
if [ ! -f ".env" ]; then
    echo "⚙️ Création du fichier .env..."
    cp .env.example .env
    echo "💡 Éditez le fichier .env pour configurer vos clés API"
fi

echo ""
echo "🚀 Démarrage du bot..."
echo "📱 Préparez votre téléphone pour scanner le QR code"
echo ""

# Démarrer le bot
node app.js