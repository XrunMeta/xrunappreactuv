import { registerRootComponent } from 'expo';
import { loadEnvSync } from './src/utils/env';

loadEnvSync();
import('./App').then((m) => registerRootComponent(m.default));
