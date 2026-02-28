import fs from 'fs';
import path from 'path';

const dir = './src';

function replaceInFolder(folder) {
    const files = fs.readdirSync(folder);
    for (const file of files) {
        const fullPath = path.join(folder, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFolder(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Backgrounds
            content = content.replace(/gray-950/g, 'slate-900');
            content = content.replace(/gray-900/g, 'slate-800');
            content = content.replace(/gray-800/g, 'slate-700');
            content = content.replace(/black\/50/g, 'slate-950/50'); // For inputs

            // Text Accents (from Cyan to Orange)
            content = content.replace(/cyan-400/g, 'orange-500');
            content = content.replace(/cyan-300/g, 'orange-400');
            content = content.replace(/cyan-500/g, 'orange-500');
            content = content.replace(/cyan-600/g, 'orange-600');
            content = content.replace(/cyan-900/g, 'orange-900');
            content = content.replace(/cyan-950/g, 'orange-950');

            // Secondary Accents (Blue -> Sky)
            content = content.replace(/blue-600/g, 'sky-500');
            content = content.replace(/blue-500/g, 'sky-400');
            content = content.replace(/blue-400/g, 'sky-400');
            content = content.replace(/blue-300/g, 'sky-300');
            content = content.replace(/blue-900/g, 'sky-900');

            // Text colors (Slightly softer than stark white to fit the industrial look)
            content = content.replace(/text-gray-300/g, 'text-slate-300');
            content = content.replace(/text-gray-400/g, 'text-slate-400');
            content = content.replace(/text-gray-500/g, 'text-slate-500');

            // CSS RGBA replaces (Find cyan glows and swap to orange rgb)
            content = content.replace(/6,\s*182,\s*212/g, '249, 115, 22');
            content = content.replace(/6,182,212/g, '249,115,22');

            // #06b6d4 -> #f97316 (orange)
            content = content.replace(/#06b6d4/ig, '#F97316');

            // #3b82f6 -> #38bdf8 (sky)
            content = content.replace(/#3b82f6/ig, '#38BDF8');

            // Update border colors for the sleek engineering feel
            content = content.replace(/border-white\/10/g, 'border-slate-700');
            content = content.replace(/white\/10/g, 'slate-700');

            // Change neon-cyan to neon-orange class names
            content = content.replace(/neon-cyan/g, 'neon-orange');

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceInFolder(dir);
