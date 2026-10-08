'use client';

import React from 'react';
import { Provider, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { mediaAtom, projectsAtom, siteAtom } from '../store/atoms';
import type { PublicContent } from './types';

function Hydrate({ content, children }: { content: PublicContent; children: React.ReactNode }) {
  useHydrateAtoms([
    [siteAtom, content.site],
    [projectsAtom, content.projects],
    [mediaAtom, content.media],
  ] as const);
  return <>{children}</>;
}

/** 前台內容來源：伺服器端讀取 → 這裡注入，所有區塊用下面的 hook 取用 */
export function ContentProvider({ content, children }: { content: PublicContent; children: React.ReactNode }) {
  return (
    <Provider>
      <Hydrate content={content}>{children}</Hydrate>
    </Provider>
  );
}

export const useSite = () => useAtomValue(siteAtom);
export const useProjects = () => useAtomValue(projectsAtom);
export const useMediaMeta = () => useAtomValue(mediaAtom);
