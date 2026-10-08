import 'server-only';
import { cache } from 'react';
import { getPublicContent } from '../../../server/content-repo';
import type { Project } from '../../../content/types';

export const getProjects = cache(async (): Promise<Project[]> => (await getPublicContent()).projects);

export const getProjectById = cache(async (id: string): Promise<Project | null> => {
  const all = await getProjects();
  return all.find((p) => p.id === id) || null;
});
