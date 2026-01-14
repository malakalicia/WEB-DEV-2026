-- Données de test

-- Mot de passe: "password123" (hashé avec bcrypt)
INSERT INTO users (email, password) VALUES
('admin@recrutement.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye7Z7pK7z7z/2QJQ9b3q3q3q3q3q3q3q3q');

-- Besoins de test
INSERT INTO besoins (poste, competences, niveau, statut) VALUES
('Développeur Full Stack', '["JavaScript", "React", "Node.js", "PostgreSQL"]', 2, 1),
('Designer UX/UI', '["Figma", "Adobe XD", "Prototypage", "Recherche utilisateur"]', 1, 1),
('Chef de projet Agile', '["Scrum", "Jira", "Gestion d''équipe", "Planification"]', 0, 1),
('Data Analyst', '["Python", "SQL", "Tableau", "Statistiques"]', 2, 0);

-- Candidats de test
INSERT INTO candidats (proposition, name, profil, statut, experience, commentaire, email) VALUES
('Proposition JS-2023-001', 'Jean Dupont', 0, 2, 5, 'Excellent en React et Node.js', 'jean.dupont@email.com'),
('Proposition DX-2023-002', 'Marie Curie', 1, 3, 8, 'Spécialiste UX avec portfolio impressionnant', 'marie.curie@email.com'),
('Proposition PM-2023-003', 'Pierre Martin', 2, 2, 6, 'Expérience dans le secteur bancaire', 'pierre.martin@email.com'),
('Proposition DA-2023-004', 'Sophie Bernard', 3, 1, 3, 'Jeune diplômée motivée', 'sophie.bernard@email.com'),
('Proposition FS-2023-005', 'Thomas Leroy', 0, 3, 10, 'Expert en architecture microservices', 'thomas.leroy@email.com');