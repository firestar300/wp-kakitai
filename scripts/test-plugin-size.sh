#!/bin/bash

# Script to test plugin ZIP size and contents
# Usage: ./scripts/test-plugin-size.sh

set -e

echo "🧪 Testing Kakitai Plugin ZIP Size"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build the plugin
echo "📦 Building plugin..."
npm run build

# Create the ZIP
echo ""
echo "📦 Creating plugin ZIP..."
npm run plugin-zip

# Check if ZIP exists
if [ ! -f "wp-kakitai.zip" ]; then
    echo -e "${RED}❌ ERROR: wp-kakitai.zip not found${NC}"
    exit 1
fi

# Get ZIP size
ZIP_SIZE=$(ls -lh wp-kakitai.zip | awk '{print $5}')
ZIP_SIZE_BYTES=$(ls -l wp-kakitai.zip | awk '{print $5}')
MAX_SIZE_BYTES=$((10 * 1024 * 1024)) # 10 MB in bytes

echo ""
echo "📊 Results:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Plugin ZIP Size: $ZIP_SIZE"

# Check size
if [ "$ZIP_SIZE_BYTES" -lt "$MAX_SIZE_BYTES" ]; then
    echo -e "${GREEN}✅ Size OK: Under 10 MB limit${NC}"
else
    echo -e "${RED}❌ Size TOO LARGE: Over 10 MB limit${NC}"
fi

# Check for dictionary files (should NOT be present)
echo ""
echo "🔍 Checking for dictionary files (should be ABSENT)..."
DICT_FILES=$(unzip -l wp-kakitai.zip | grep -c "dict/" || true)

if [ "$DICT_FILES" -eq 0 ]; then
    echo -e "${GREEN}✅ No dictionary files found in ZIP (correct!)${NC}"
else
    echo -e "${RED}❌ Dictionary files found in ZIP (should be excluded!)${NC}"
    echo "   Files found:"
    unzip -l wp-kakitai.zip | grep "dict/"
fi

# Check for required files
echo ""
echo "🔍 Checking for required files..."
REQUIRED_FILES=(
    "wp-kakitai/wp-kakitai.php"
    "wp-kakitai/readme.txt"
    "wp-kakitai/includes/class-dictionary-manager.php"
    "wp-kakitai/includes/class-admin-page.php"
    "wp-kakitai/includes/class-activation.php"
    "wp-kakitai/build/index.js"
    "wp-kakitai/build/index.asset.php"
    "wp-kakitai/assets/admin.css"
)

MISSING_FILES=0
for file in "${REQUIRED_FILES[@]}"; do
    if unzip -l wp-kakitai.zip | grep -q "$file"; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file ${RED}(MISSING)${NC}"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

# Summary
echo ""
echo "📝 Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$ZIP_SIZE_BYTES" -lt "$MAX_SIZE_BYTES" ] && [ "$DICT_FILES" -eq 0 ] && [ "$MISSING_FILES" -eq 0 ]; then
    echo -e "${GREEN}✅ Plugin is ready for WordPress.org!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Create a GitHub release: git tag -a v1.0.0 -m 'Version 1.0.0'"
    echo "2. Push the tag: git push origin v1.0.0"
    echo "3. GitHub Actions will upload dictionary files automatically"
    echo "4. Download wp-kakitai-wordpress-org.zip from GitHub Release"
    echo "5. Submit to WordPress.org"
else
    echo -e "${RED}❌ Plugin has issues, please fix before publishing${NC}"

    if [ "$ZIP_SIZE_BYTES" -ge "$MAX_SIZE_BYTES" ]; then
        echo -e "${RED}   - ZIP size exceeds 10 MB${NC}"
    fi

    if [ "$DICT_FILES" -gt 0 ]; then
        echo -e "${RED}   - Dictionary files should not be in ZIP${NC}"
    fi

    if [ "$MISSING_FILES" -gt 0 ]; then
        echo -e "${RED}   - $MISSING_FILES required file(s) missing${NC}"
    fi

    exit 1
fi

echo ""
echo "🎉 Test completed successfully!"
