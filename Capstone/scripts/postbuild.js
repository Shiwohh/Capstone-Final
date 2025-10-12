// Post-build copy: ensure non-module scripts are shipped to dist
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyDir(srcDir, destDir) {
  await fs.mkdir(destDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

<<<<<<< HEAD
async function ensureCssConsistency() {
  const projectRoot = path.resolve(__dirname, '..');
  const srcCssDir = path.join(projectRoot, 'CSS Styles');
  const distCssDir = path.join(projectRoot, 'dist', 'CSS Styles');
  const assetsDir = path.join(projectRoot, 'dist', 'assets');
  const distDir = path.join(projectRoot, 'dist');
  
  try {
    // Always copy original CSS files to maintain dev/build consistency
    await fs.mkdir(distCssDir, { recursive: true });
    
    // Copy all CSS files from source to dist/CSS Styles
    if (await fs.stat(srcCssDir).catch(() => false)) {
      const cssFiles = await fs.readdir(srcCssDir);
      for (const file of cssFiles) {
        if (file.endsWith('.css')) {
          const srcPath = path.join(srcCssDir, file);
          const destPath = path.join(distCssDir, file);
          await fs.copyFile(srcPath, destPath);
          console.log(`[postbuild] Copied CSS "${file}" to maintain consistency`);
        }
      }
    }
    
    // Also check if Vite created CSS files in assets and copy them too
    if (await fs.stat(assetsDir).catch(() => false)) {
      const assetFiles = await fs.readdir(assetsDir);
      for (const file of assetFiles) {
        if (file.endsWith('.css')) {
          const srcPath = path.join(assetsDir, file);
          const destPath = path.join(distCssDir, file);
          await fs.copyFile(srcPath, destPath);
          console.log(`[postbuild] Copied bundled CSS "${file}" for fallback`);
        }
      }
    }
    
    // Restore original CSS references in HTML files
    await restoreOriginalCssReferences(projectRoot, distDir);
    
  } catch (err) {
    console.error('[postbuild] CSS consistency check failed:', err?.message || err);
  }
}

async function restoreOriginalCssReferences(projectRoot, distDir) {
  const htmlFiles = ['admin-dashboard.html', 'index.html', 'try-on.html', 'about.html', 'contact.html', 'preorder.html', 'preorders.html', 'preorder-confirmation.html'];
  
  for (const htmlFile of htmlFiles) {
    try {
      const srcHtmlPath = path.join(projectRoot, htmlFile);
      const distHtmlPath = path.join(distDir, htmlFile);
      
      if (await fs.stat(srcHtmlPath).catch(() => false) && await fs.stat(distHtmlPath).catch(() => false)) {
        const srcContent = await fs.readFile(srcHtmlPath, 'utf8');
        let distContent = await fs.readFile(distHtmlPath, 'utf8');
        
        // Extract CSS links from source HTML
        const cssLinkRegex = /<link[^>]*href="CSS Styles\/[^"]*\.css"[^>]*>/g;
        const cssLinks = srcContent.match(cssLinkRegex) || [];
        
        if (cssLinks.length > 0) {
          // Find Vite-generated CSS links
          const viteCssRegex = /<link[^>]*href="\/assets\/[^"]*\.css"[^>]*>/g;
          const viteCssLinks = distContent.match(viteCssRegex) || [];
          
          // Remove existing Vite CSS links from their current position
          viteCssLinks.forEach(link => {
            distContent = distContent.replace(link, '');
          });
          
          // Find where to insert CSS links (after external CSS but before Firebase SDK)
          const insertPoint = distContent.indexOf('<!-- Firebase SDK -->');
          if (insertPoint !== -1) {
            const beforeInsert = distContent.substring(0, insertPoint);
            const afterInsert = distContent.substring(insertPoint);
            
            // Add Vite CSS first, then original CSS links (so original CSS takes precedence)
            let cssLinksStr = '';
            if (viteCssLinks.length > 0) {
              cssLinksStr += '\n    ' + viteCssLinks.join('\n    ');
            }
            cssLinksStr += '\n    ' + cssLinks.join('\n    ') + '\n    ';
            
            distContent = beforeInsert + cssLinksStr + afterInsert;
            
            await fs.writeFile(distHtmlPath, distContent, 'utf8');
            console.log(`[postbuild] Restored CSS references in "${htmlFile}" with proper loading order`);
          }
        }
      }
    } catch (err) {
      console.error(`[postbuild] Failed to restore CSS references in "${htmlFile}":`, err?.message || err);
    }
  }
}

async function fixJavaScriptPaths() {
  const distDir = path.join(__dirname, '..', 'dist');
  
  try {
    const htmlFiles = await fs.readdir(distDir);
    
    for (const file of htmlFiles) {
      if (file.endsWith('.html')) {
        const htmlPath = path.join(distDir, file);
        let content = await fs.readFile(htmlPath, 'utf8');
        
        // Replace JavaScript file paths with URL encoded spaces
        const updatedContent = content.replace(
          /src="Javascript Styles\//g,
          'src="Javascript%20Styles/'
        );
        
        if (content !== updatedContent) {
          await fs.writeFile(htmlPath, updatedContent, 'utf8');
          console.log(`[postbuild] Fixed JavaScript paths in "${file}"`);
        }
      }
    }
  } catch (err) {
    console.error('[postbuild] Failed to fix JavaScript paths:', err?.message || err);
  }
}

=======
>>>>>>> 136f2a1782a5a57c9d23819bb28c350a9e8bbf2c
async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const src = path.join(projectRoot, 'Javascript Styles');
  const dest = path.join(projectRoot, 'dist', 'Javascript Styles');
  try {
    await copyDir(src, dest);
    console.log(`[postbuild] Copied "${src}" -> "${dest}"`);
<<<<<<< HEAD
    
    // Ensure CSS consistency
    await ensureCssConsistency();
    
    // Fix JavaScript file paths
    await fixJavaScriptPaths();
    
    console.log('[postbuild] All post-build tasks completed successfully');
=======
>>>>>>> 136f2a1782a5a57c9d23819bb28c350a9e8bbf2c
  } catch (err) {
    console.error('[postbuild] Copy failed:', err?.message || err);
    process.exitCode = 1;
  }
}

main();