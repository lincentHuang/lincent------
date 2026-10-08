'use client';

import React from 'react';
import { AboutHero } from './about-hero';
import { Principles, Story, Career, Skills, EducationLanguages, Preferences } from './about-sections';

export function AboutPage() {
  return (
    <>
      <AboutHero />
      <Principles />
      <Story />
      <Career />
      <Skills />
      <EducationLanguages />
      <Preferences />
    </>
  );
}
