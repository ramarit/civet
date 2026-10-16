#!/bin/bash
set -e

# Civet Setup Script
# This script sets up the entire Civet development environment

echo "🐱 Civet Setup Script"
echo "===================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: Please run this script from the project root${NC}"
  exit 1
fi

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo -e "${RED}Error: Node.js 20 or higher is required${NC}"
  echo "Current version: $(node -v)"
  exit 1
fi
echo -e "${GREEN}✓ Node.js version OK: $(node -v)${NC}"

# Check pnpm
echo "Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
  echo -e "${YELLOW}pnpm not found. Installing...${NC}"
  npm install -g pnpm@8
fi
echo -e "${GREEN}✓ pnpm installed: $(pnpm -v)${NC}"

# Install dependencies
echo ""
echo "Installing dependencies..."
pnpm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Setup environment files
echo ""
echo "Setting up environment files..."

# Root .env
if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
  echo -e "${YELLOW}⚠ Created .env.local - Please update with your API keys${NC}"
else
  echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

# Dashboard .env
if [ ! -f "apps/dashboard/.env.local" ]; then
  cp apps/dashboard/.env.example apps/dashboard/.env.local
  echo -e "${YELLOW}⚠ Created apps/dashboard/.env.local - Please update${NC}"
else
  echo -e "${GREEN}✓ apps/dashboard/.env.local already exists${NC}"
fi

# API .env
if [ ! -f "apps/api/.env" ]; then
  cp apps/api/.env.example apps/api/.env
  echo -e "${YELLOW}⚠ Created apps/api/.env - Please update${NC}"
else
  echo -e "${GREEN}✓ apps/api/.env already exists${NC}"
fi

# Bug Loop .env
if [ ! -f "apps/bug-loop/.env" ]; then
  cp apps/bug-loop/.env.example apps/bug-loop/.env
  echo -e "${YELLOW}⚠ Created apps/bug-loop/.env - Please update${NC}"
else
  echo -e "${GREEN}✓ apps/bug-loop/.env already exists${NC}"
fi

# Check for Docker
echo ""
echo "Checking Docker..."
if command -v docker &> /dev/null; then
  echo -e "${GREEN}✓ Docker found: $(docker -v | cut -d ',' -f 1)${NC}"

  # Ask to start PostgreSQL and Redis
  read -p "Start PostgreSQL and Redis with Docker? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting services..."
    docker run -d --name civet-postgres \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=civet \
      -p 5432:5432 \
      postgres:16 || echo -e "${YELLOW}PostgreSQL container might already exist${NC}"

    docker run -d --name civet-redis \
      -p 6379:6379 \
      redis:7 || echo -e "${YELLOW}Redis container might already exist${NC}"

    echo -e "${GREEN}✓ Services started${NC}"

    # Wait for PostgreSQL to be ready
    echo "Waiting for PostgreSQL to be ready..."
    sleep 5
  fi
else
  echo -e "${YELLOW}⚠ Docker not found. You'll need to set up PostgreSQL and Redis manually${NC}"
fi

# Run database migrations
echo ""
read -p "Run database migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Running migrations..."
  # Update DATABASE_URL in .env if using local Docker
  if docker ps | grep civet-postgres > /dev/null; then
    export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/civet"
  fi

  cd apps/api
  if [ -f "src/db/schema.sql" ]; then
    # Run migrations (assuming psql is available)
    if command -v psql &> /dev/null; then
      psql $DATABASE_URL -f src/db/schema.sql
      echo -e "${GREEN}✓ Database migrations complete${NC}"
    else
      echo -e "${YELLOW}⚠ psql not found. Please run migrations manually:${NC}"
      echo "psql \$DATABASE_URL -f apps/api/src/db/schema.sql"
    fi
  fi
  cd ../..
fi

# Build packages
echo ""
echo "Building packages..."
pnpm build
echo -e "${GREEN}✓ Packages built${NC}"

# Create git hooks
echo ""
echo "Setting up git hooks..."
mkdir -p .git/hooks

cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."
pnpm lint
pnpm type-check
EOF

chmod +x .git/hooks/pre-commit
echo -e "${GREEN}✓ Git hooks configured${NC}"

# Summary
echo ""
echo "======================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Update environment files with your API keys:"
echo "   - .env.local"
echo "   - apps/dashboard/.env.local"
echo "   - apps/api/.env"
echo "   - apps/bug-loop/.env"
echo ""
echo "2. Start development servers:"
echo "   pnpm dev"
echo ""
echo "3. Access applications:"
echo "   - Dashboard: http://localhost:3000"
echo "   - API: http://localhost:8000"
echo "   - Bug Loop: http://localhost:3002"
echo ""
echo "4. Read documentation:"
echo "   - README.md"
echo "   - ARCHITECTURE.md"
echo "   - docs/PRICING_ANALYSIS.md"
echo ""
echo "Happy coding! 🚀"
