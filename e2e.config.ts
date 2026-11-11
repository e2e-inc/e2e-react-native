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
  // Replace Settings with your app's bundle id.
  targets: [{ name: 'ios', engine: mobile({ platform: 'ios' }), app: { bundleId: 'Settings' } }],
  workers: 1,
} satisfies E2EConfig;
