-- Base de données: recrutement_db

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: besoins
CREATE TABLE IF NOT EXISTS besoins (
    id SERIAL PRIMARY KEY,
    poste VARCHAR(255) NOT NULL,
    competences JSONB DEFAULT '[]',
    niveau INTEGER NOT NULL DEFAULT 0 CHECK (niveau BETWEEN 0 AND 2),
    statut INTEGER NOT NULL DEFAULT 0 CHECK (statut BETWEEN 0 AND 1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: candidats
CREATE TABLE IF NOT EXISTS candidats (
    id SERIAL PRIMARY KEY,
    proposition VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    profil INTEGER NOT NULL DEFAULT 0 CHECK (profil BETWEEN 0 AND 4),
    statut INTEGER NOT NULL DEFAULT 0 CHECK (statut BETWEEN 0 AND 3),
    experience INTEGER DEFAULT 0,
    commentaire TEXT,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_besoins_statut ON besoins(statut);
CREATE INDEX IF NOT EXISTS idx_candidats_profil ON candidats(profil);
CREATE INDEX IF NOT EXISTS idx_candidats_statut ON candidats(statut);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_besoins_updated_at 
    BEFORE UPDATE ON besoins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidats_updated_at 
    BEFORE UPDATE ON candidats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();