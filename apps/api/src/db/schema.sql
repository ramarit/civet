-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teams_owner_id ON teams(owner_id);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    default_language VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_team_id ON projects(team_id);
CREATE INDEX idx_projects_api_key ON projects(api_key);

-- Project Languages Table
CREATE TABLE IF NOT EXISTS project_languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    language_name VARCHAR(100) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, language_code)
);

CREATE INDEX idx_project_languages_project_id ON project_languages(project_id);
CREATE INDEX idx_project_languages_enabled ON project_languages(enabled);

-- Translations Table
CREATE TABLE IF NOT EXISTS translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    key VARCHAR(500) NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, key, language_code)
);

CREATE INDEX idx_translations_project_id ON translations(project_id);
CREATE INDEX idx_translations_language_code ON translations(language_code);
CREATE INDEX idx_translations_key ON translations(key);
CREATE INDEX idx_translations_project_lang ON translations(project_id, language_code);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'canceled', 'expired')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_team_id ON subscriptions(team_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Usage Logs Table
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    response_status INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usage_logs_team_id ON usage_logs(team_id);
CREATE INDEX idx_usage_logs_project_id ON usage_logs(project_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);

-- Refresh Tokens Table (for JWT refresh)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update timestamp triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed default data (optional)
-- Insert a default free plan for new teams
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO subscriptions (team_id, plan, status, current_period_start, current_period_end)
    VALUES (
        NEW.id,
        'free',
        'active',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP + INTERVAL '1 year'
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_team_subscription AFTER INSERT ON teams
    FOR EACH ROW EXECUTE FUNCTION create_default_subscription();

-- Add team owner as member
CREATE OR REPLACE FUNCTION add_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'owner');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER add_team_owner_member AFTER INSERT ON teams
    FOR EACH ROW EXECUTE FUNCTION add_owner_as_member();
