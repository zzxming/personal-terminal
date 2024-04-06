import getConfig from 'next/config';
import path from 'path';

export const STATIC_ROOT = path.resolve(getConfig().serverRuntimeConfig.PROJECT_ROOT, 'public');
