import fs from 'fs/promises';
import path from 'path';

const src = path.join(process.cwd(), 'node_modules', 'cesium', 'Build', 'Cesium');
const dest = path.join(process.cwd(), 'public', 'cesium');

async function removeDir(dir) {
  try {
    // Node 14+ has rm
    if (fs.rm) {
      await fs.rm(dir, { recursive: true, force: true });
      return;
    }
  } catch (err) {
    // fallthrough to manual remove
  }

  // Manual recursive remove fallback
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    await Promise.all(entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await removeDir(full);
      else await fs.unlink(full);
    }));
    await fs.rmdir(dir);
  } catch (err) {
    // ignore if does not exist
  }
}

async function copyDir(srcDir, destDir) {
  await fs.mkdir(destDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      try {
        const real = await fs.readlink(srcPath);
        await fs.symlink(real, destPath);
      } catch (e) {
        // ignore
      }
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    // ensure source exists
    await fs.access(src);
  } catch (err) {
    console.error('Cesium source not found:', src);
    process.exit(0);
  }

  try {
    await removeDir(dest);
    await copyDir(src, dest);
    console.log('Copied Cesium to', dest);
  } catch (err) {
    console.error('Failed to copy Cesium:', err);
    process.exit(1);
  }
})();
