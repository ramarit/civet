#!/bin/bash

# Civet Widget SDK - Setup Verification Script
# Run this script to verify the project structure and setup

set -e

echo "=================================="
echo "Civet Widget SDK - Setup Verification"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Are you in the widget-sdk directory?${NC}"
    exit 1
fi

echo "✓ Found package.json"
echo ""

# Check directory structure
echo "Checking directory structure..."
echo ""

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        return 1
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        return 1
    fi
}

# Check directories
check_dir "src"
check_dir "src/core"
check_dir "src/ui"
check_dir "src/utils"
echo ""

# Check source files
echo "Checking source files..."
check_file "src/index.ts"
check_file "src/types.ts"
check_file "src/core/translator.ts"
check_file "src/core/dom-observer.ts"
check_file "src/core/api-client.ts"
check_file "src/ui/language-selector.ts"
check_file "src/ui/styles.css"
check_file "src/utils/cache.ts"
check_file "src/utils/url-rewriter.ts"
check_file "src/utils/helpers.ts"
echo ""

# Check configuration files
echo "Checking configuration files..."
check_file "package.json"
check_file "tsconfig.json"
check_file ".gitignore"
check_file ".npmignore"
check_file ".editorconfig"
echo ""

# Check documentation
echo "Checking documentation..."
check_file "README.md"
check_file "QUICKSTART.md"
check_file "PERFORMANCE.md"
check_file "CONTRIBUTING.md"
check_file "CHANGELOG.md"
check_file "BUILD_GUIDE.md"
check_file "PROJECT_SUMMARY.md"
check_file "LICENSE"
check_file "example.html"
echo ""

# Count lines of code
echo "Lines of code statistics..."
if command -v wc &> /dev/null; then
    total_lines=$(find src -name "*.ts" -o -name "*.css" 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')
    echo -e "Total lines: ${GREEN}$total_lines${NC}"
else
    echo -e "${YELLOW}wc command not found, skipping line count${NC}"
fi
echo ""

# Check Node.js
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    node_version=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js $node_version"
else
    echo -e "${RED}✗${NC} Node.js not found (required for building)"
fi

# Check npm
if command -v npm &> /dev/null; then
    npm_version=$(npm -v)
    echo -e "${GREEN}✓${NC} npm $npm_version"
else
    echo -e "${RED}✗${NC} npm not found (required for building)"
fi
echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
else
    echo -e "${YELLOW}!${NC} node_modules not found. Run 'npm install' to install dependencies."
fi

# Check if dist exists
if [ -d "dist" ]; then
    echo -e "${GREEN}✓${NC} dist directory exists"

    if [ -f "dist/civet.js" ]; then
        size=$(du -h dist/civet.js | cut -f1)
        echo -e "  - civet.js ($size)"
    fi

    if [ -f "dist/civet.esm.js" ]; then
        size=$(du -h dist/civet.esm.js | cut -f1)
        echo -e "  - civet.esm.js ($size)"
    fi

    if [ -f "dist/index.d.ts" ]; then
        echo -e "  - index.d.ts (TypeScript definitions)"
    fi
else
    echo -e "${YELLOW}!${NC} dist directory not found. Run 'npm run build' to build the project."
fi
echo ""

# Summary
echo "=================================="
echo "Summary"
echo "=================================="
echo ""

source_count=$(find src -name "*.ts" -o -name "*.css" 2>/dev/null | wc -l | xargs)
echo "Source files: $source_count"

doc_count=$(find . -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | xargs)
echo "Documentation files: $doc_count"

echo ""
echo "Next steps:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Run 'npm run build' to build the widget"
echo "3. Open 'example.html' in a browser to test"
echo "4. Read 'QUICKSTART.md' for integration guide"
echo ""
echo -e "${GREEN}Setup verification complete!${NC}"
