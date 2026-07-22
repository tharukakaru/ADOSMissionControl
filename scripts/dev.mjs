import { execSync } from 'child_process';

const port = process.env.PORT || '4000';
const isDemo = process.argv.includes('--demo');

if (isDemo) {
  process.env.NEXT_PUBLIC_DEMO_MODE = 'true';
}

try {
  execSync(`next dev --turbo --port ${port}`, {
    stdio: 'inherit',
    shell: true,
  });
} catch (err) {
  process.exit(1);
}
