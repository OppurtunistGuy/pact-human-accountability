import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pact.accountability',
  appName: 'Pact',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
