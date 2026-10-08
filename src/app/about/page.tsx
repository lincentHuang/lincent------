import type { Metadata } from 'next';
import { FrontendShell } from '../../components/layouts/frontend-shell';
import { Footer } from '../../components/layouts/footer';
import { AboutPage } from '../../features/about/components/about-page';
import { getPublicContent } from '../../server/content-repo';

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getPublicContent();
  const { profile, about } = site;
  return {
    title: `關於我 | ${profile.name.zh}`,
    description: about.headline.zh || profile.tagline.zh,
  };
}

export default function About() {
  return (
    <FrontendShell>
      <main className="w-full flex-1">
        <AboutPage />
      </main>
      <Footer />
    </FrontendShell>
  );
}
