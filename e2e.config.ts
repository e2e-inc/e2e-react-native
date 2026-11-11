import type { E2EConfig } from 'e2e';
import { mobile } from '@e2e-dev/mobile';
import { gateway } from 'ai';

export default {
  // The Vercel AI Gateway serves the model id and reads AI_GATEWAY_API_KEY, or the OIDC token of a linked Vercel project.
  agents: {
    default: {
      model: gateway('openai/gpt-6-luna-fast'),
      system: 'You are a thorough QA agent. Verify every outcome.',
    },
  },
  targets: [
    {
      name: 'ios',
      engine: mobile({ platform: 'ios', device: 'iPhone 17 Pro' }),
      // A development build made with `npx expo run:ios`; Metro serves the JS bundle.
      app: {
        bundleId: 'dev.e2e.podcasts',
        launchArguments: [
          '--initialUrl',
          'http://localhost:8081',
          '-EXDevMenuShowsAtLaunch',
          'NO',
          '-EXDevMenuIsOnboardingFinished',
          'YES',
          '-EXDevMenuShowFloatingActionButton',
          'NO',
        ],
        command: {
          executable: 'npx',
          args: ['expo', 'start', '--port', '8081'],
          reuseExisting: true,
          startupTimeout: 120_000,
          log: '.e2e/logs/metro.log',
        },
        readyUrl: 'http://localhost:8081/status',
      },
    },
  ],
  workers: 1,
} satisfies E2EConfig;
