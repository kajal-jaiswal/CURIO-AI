#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting E2E Test Suite for Curio AI Blog${NC}"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.local not found${NC}"
    echo "Creating from .env.example..."
    cp .env.example .env.local
    echo -e "${YELLOW}Please update .env.local with your Supabase credentials${NC}"
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Install Playwright browsers if needed
echo -e "${GREEN}📦 Checking Playwright browsers...${NC}"
npx playwright install --with-deps chromium firefox webkit
echo ""

# Run tests
echo -e "${GREEN}🧪 Running E2E Tests...${NC}"
echo ""

npm run test:e2e

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    echo -e "${GREEN}📊 View detailed report:${NC}"
    echo "   npx playwright show-report"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some tests failed${NC}"
    echo ""
    echo -e "${YELLOW}📊 View detailed report:${NC}"
    echo "   npx playwright show-report"
    exit 1
fi
