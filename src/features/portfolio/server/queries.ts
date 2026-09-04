import 'server-only';
import { cache } from 'react';
import { getSiteConfig, getModularCards } from '../../../lib/db';
import { SiteConfig, ModularCard } from '../../../types';

export const getCachedSiteConfig = cache(async (): Promise<SiteConfig> => {
  return await getSiteConfig();
});

export const getCachedModularCards = cache(async (): Promise<ModularCard[]> => {
  return await getModularCards();
});
