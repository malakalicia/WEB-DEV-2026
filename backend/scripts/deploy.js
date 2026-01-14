const { exec } = require('child_process');

const args = process.argv.slice(2);
const branchName = args[0] || `release/v1.0.${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;
const commitMsg = args[1] || `deploy: ${branchName}`;

console.log('🚀 Déploiement automatisé');
console.log(`🌿 Branche: ${branchName}`);
console.log(`📝 Commit: ${commitMsg}`);

const steps = [
  { cmd: 'npm test', name: 'Tests' },
  { cmd: `git checkout -b ${branchName}`, name: 'Création branche' },
  { cmd: 'git add .', name: 'Ajout fichiers' },
  { cmd: `git commit -m "${commitMsg}"`, name: 'Commit' },
  { cmd: `git push origin ${branchName}`, name: 'Push GitHub' },
  { cmd: 'git checkout main', name: 'Retour à main' }
];

async function deploy() {
  for (const step of steps) {
    console.log(`\n▶️  ${step.name}...`);
    
    try {
      await execPromise(step.cmd);
      console.log(`✅ ${step.name} réussi`);
    } catch (error) {
      console.error(`❌ ${step.name} échoué:`, error.message);
      process.exit(1);
    }
  }
  
  console.log('\n🎉 Déploiement terminé avec succès!');
  console.log(`🔗 Créez la PR: https://github.com/ENSIAS-MEH/dev-web-sanae_malak_safae_houssam_nizar/pull/new/${branchName}`);
}

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });
}

deploy();