#!/bin/bash
# Copyright (c) 2025 Cato Hansen. All rights reserved.
# Script to add copyright notice to TypeScript/JavaScript files

COPYRIGHT_HEADER='/**
 * Copyright (c) 2025 Cato Hansen. All rights reserved.
 * 
 * Proprietary - Unauthorized copying, modification, distribution, or use
 * of this software, via any medium is strictly prohibited without express
 * written permission from Cato Hansen.
 * 
 * @license PROPRIETARY
 * SPDX-License-Identifier: PROPRIETARY
 * @author Cato Hansen
 * @contact cato@catohansen.no
 * @website www.catohansen.no
 */'

# Find all .ts and .tsx files in src/ excluding node_modules, out, and knowledge-base
find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/out/*" ! -path "*/knowledge-base/*" ! -name "next-env.d.ts" | while read file; do
    # Check if file already has copyright
    if ! grep -q "Copyright (c) 2025 Cato Hansen" "$file"; then
        # Check if file starts with /** or /* (has existing JSDoc)
        if head -n 1 "$file" | grep -q "^/\*\*\|^/\*"; then
            # File has existing JSDoc - prepend copyright before it
            echo "Adding copyright to $file (existing JSDoc found)"
            # Create temp file with copyright + existing content
            (echo "$COPYRIGHT_HEADER"; echo ""; cat "$file") > "$file.tmp"
            mv "$file.tmp" "$file"
        else
            # File doesn't have JSDoc - prepend copyright
            echo "Adding copyright to $file"
            (echo "$COPYRIGHT_HEADER"; echo ""; cat "$file") > "$file.tmp"
            mv "$file.tmp" "$file"
        fi
    else
        echo "Skipping $file (already has copyright)"
    fi
done

echo "Copyright headers added to all TypeScript/JavaScript files!"







