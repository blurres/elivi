import type { ProjectItem, SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  title: 'Blurres',
  bio: "My name is Eli, short for Elivi, I'm 26 years old from Dakar Senegal and I have way too many hobbies",
};

type SeedProjectInput = Omit<ProjectItem, 'x' | 'y' | 'width' | 'height' | 'zIndex' | 'floatDuration' | 'floatY' | 'floatRotate'> & {
  offsetX: number;
  offsetY: number;
  zIndex?: number;
  width?: number;
  height?: number;
  floatDuration?: number;
  floatY?: number;
  floatRotate?: number;
};

export const seedProjectTemplates: SeedProjectInput[] = [
  {
    id: 'init-1',
    type: 'code',
    title: 'SYSTEM_READY',
    description: 'Archive system initialized. Explore the infinite canvas.',
    mediaUrl:
      '// ELIVI ARCHIVE V1.0\n// STATUS: ONLINE\n\nfunction init() {\n  console.log("Welcome user.");\n  enable_interactivity(true);\n}',
    tags: ['system', 'v1.0'],
    rotation: -2,
    offsetX: 0,
    offsetY: 0,
    zIndex: 10,
  },
  {
    id: 'init-2',
    type: 'image',
    title: 'VISUAL_SYSTEM',
    description: 'Visual language experiments and direction snapshots.',
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    tags: ['design', 'visuals'],
    rotation: 3,
    offsetX: -320,
    offsetY: 40,
    zIndex: 9,
  },
  {
    id: 'init-3',
    type: 'video',
    title: 'MOTION_TEST',
    description: 'Prototype motion studies and interaction flow tests.',
    mediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    tags: ['motion', 'prototype'],
    rotation: -4,
    offsetX: 300,
    offsetY: 70,
    zIndex: 8,
  },
];

export function buildSeedProjects(centerX: number, centerY: number): ProjectItem[] {
  return seedProjectTemplates.map((template) => ({
    id: template.id,
    type: template.type,
    title: template.title,
    description: template.description,
    mediaUrl: template.mediaUrl,
    tags: template.tags,
    x: centerX + template.offsetX,
    y: centerY + template.offsetY,
    width: template.width ?? 260,
    height: template.height ?? 340,
    rotation: template.rotation,
    zIndex: template.zIndex ?? 10,
    floatDuration: template.floatDuration ?? 6,
    floatY: template.floatY ?? -10,
    floatRotate: template.floatRotate ?? 1,
  }));
}
