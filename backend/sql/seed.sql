-- Donnees de test SmartHR

-- Utilisateur admin
-- Email: admin@smarthr.ma
-- Mot de passe: Admin@123 (hashe avec bcrypt, 10 rounds)
INSERT INTO users (email, password) VALUES
('admin@smarthr.ma', '$2a$10$YourHashHere');

-- NOTE: Le hash ci-dessus est un placeholder.
-- Pour creer un utilisateur fonctionnel, utilisez l'API:
-- curl -X POST http://localhost:3000/api/users/register \
--   -H "Content-Type: application/json" \
--   -d '{"email":"admin@smarthr.ma","password":"Admin@123"}'

-- Besoins de test
INSERT INTO besoins (poste, competences, niveau, statut) VALUES
('Developpeur Full Stack', '["JavaScript", "React", "Node.js", "PostgreSQL"]', 2, 1),
('Designer UX/UI', '["Figma", "Adobe XD", "Prototypage", "Recherche utilisateur"]', 1, 1),
('Chef de projet Agile', '["Scrum", "Jira", "Gestion d''equipe", "Planification"]', 0, 1),
('Data Analyst', '["Python", "SQL", "Tableau", "Statistiques"]', 2, 0);

-- Candidats de test
INSERT INTO candidats (proposition, name, profil, statut, experience, commentaire, email) VALUES
('PROP-2024-001', 'Mohamed El Alami', 0, 2, 5, 'Excellent en React et Node.js', 'mohamed.elalami@email.com'),
('PROP-2024-002', 'Fatima Bennani', 1, 3, 8, 'Specialiste UX avec portfolio impressionnant', 'fatima.bennani@email.com'),
('PROP-2024-003', 'Ahmed Tazi', 2, 2, 6, 'Experience dans le secteur bancaire', 'ahmed.tazi@email.com'),
('PROP-2024-004', 'Khadija Alaoui', 3, 1, 3, 'Jeune diplomee motivee', 'khadija.alaoui@email.com'),
('PROP-2024-005', 'Youssef Fassi', 0, 3, 10, 'Expert en architecture microservices', 'youssef.fassi@email.com');
