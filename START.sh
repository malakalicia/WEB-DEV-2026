#!/bin/bash
echo "════════════════════════════════════════════════"
echo "  SII Skills Connect - Démarrage"
echo "════════════════════════════════════════════════"
echo ""
echo "📦 Vérification des dépendances..."

cd backend

if [ ! -d "node_modules" ]; then
    echo "📥 Installation des dépendances npm..."
    npm install
fi

echo ""
echo "✅ Backend prêt !"
echo "🚀 Démarrage du serveur..."
echo ""
npm start
