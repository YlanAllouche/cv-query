#!/usr/bin/env node
import { watch } from 'chokidar';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface WatchOptions {
  command: string;
  description: string;
  debounceMs?: number;
  watchPaths?: string[];
}

export function createWatcher(options: WatchOptions) {
  const { command, description, debounceMs = 300, watchPaths } = options;

  let isRunning = false;
  let timeout: NodeJS.Timeout | null = null;

  async function runCommand() {
    if (isRunning) return;

    isRunning = true;
    console.log(`🔄 ${description}...`);

    try {
      const startTime = Date.now();
      await execAsync(command, { cwd: process.cwd() });
      const duration = Date.now() - startTime;
      console.log(`✅ ${description} completed in ${duration}ms`);
    } catch (error) {
      console.error(`❌ ${description} failed:`, error);
    } finally {
      isRunning = false;
    }
  }

  function debouncedRun() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(runCommand, debounceMs);
  }

   const defaultPaths = ['./data', './src', './cv-definitions.ts', './queries.json'];
   const pathsToWatch = watchPaths && watchPaths.length > 0 ? watchPaths : defaultPaths;
   const watcher = watch(pathsToWatch, {
     ignored: ['./dist/**/*', './node_modules/**/*'],
     persistent: true,
     ignoreInitial: true,
   });

   watcher
     .on('ready', () => {
       console.log('👀 Watching for file changes...');
       pathsToWatch.forEach(path => console.log(`   - ${path}`));
       console.log('💡 Make changes to trigger rebuild!');
     })
     .on('change', (path) => {
       console.log(`📝 Changed: ${path}`);
       debouncedRun();
     })
     .on('add', (path) => {
       console.log(`📝 Added: ${path}`);
       debouncedRun();
     })
     .on('unlink', (path) => {
       console.log(`📝 Removed: ${path}`);
       debouncedRun();
     })
     .on('error', (error) => {
       console.error('❌ Watcher error:', error);
     });

   process.on('SIGINT', () => {
     console.log('\n🛑 Stopping watcher...');
     watcher.close();
     process.exit(0);
   });

   return { watcher, runCommand };
}
