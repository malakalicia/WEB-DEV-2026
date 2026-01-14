const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

async function initDatabase() {
  try {
    console.log('📦 Initialisation de la base de données...');
    
    // Lire les fichiers SQL
    const schemaPath = path.join(__dirname, '../sql/schema.sql');
    const seedPath = path.join(__dirname, '../sql/seed.sql');
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    // Construire la commande psql
    const command = `PGPASSWORD=${process.env.DB_PASSWORD} psql -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -c "${schemaSQL} ${seedSQL}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Erreur lors de l''initialisation:", error.message);
        return;
      }
      
      if (stderr) {
        console.warn('⚠️  Avertissements:', stderr);
      }
      
      console.log('✅ Base de données initialisée avec succès!');
      console.log('📊 Tables créées: users, besoins, candidats');
      console.log('👤 Utilisateur de test: admin@recrutement.com / password123');
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

initDatabase();