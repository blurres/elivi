export type ProjectType = 'image' | 'video' | 'code' | 'model3d' | 'game' | 'audio' | 'website' | 'app' | 'other';

export interface ProjectItem {
  id: string;
  type: ProjectType;
  title: string;
  description: string;
  mediaUrl: string; // URL for video/image, or code snippet
  tags: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  // Physics props
  floatDuration: number;
  floatY: number;
  floatRotate: number;
}

export interface SiteConfig {
  title: string;
  bio: string;
}