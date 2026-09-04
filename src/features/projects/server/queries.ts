import 'server-only';
import { cache } from 'react';
import { getAllProjects } from '../../../lib/db';
import { ProjectItem } from '../../../types';

/**
 * Encapsulated Data Access Layer for Projects
 * Utilizes React.cache() for request-level deduplication
 */
export const getProjects = cache(async (): Promise<ProjectItem[]> => {
  return await getAllProjects();
});

export const getProjectById = cache(async (id: string): Promise<ProjectItem | null> => {
  const all = await getAllProjects();
  return all.find((p) => p.id === id) || null;
});
