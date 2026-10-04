import { getContent, getPosts } from '@/lib/db';
import { allServices, organizationJsonLd } from '@/lib/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import AnnouncementBar from '@/components/AnnouncementBar';
import CommandPalette from '@/components/CommandPalette';

// Public-facing shell. Pages are statically generated and refreshed on demand
// (revalidatePath) whenever content is saved from /admin.
export const revalidate = 3600;

export default async function SiteLayout({ children }) {
  const [content, posts] = await Promise.all([getContent(), getPosts()]);
  const vis = content.visibility || {};
  const showAnnouncement = vis.announcement !== false && content.announcement?.enabled;

  return (
    <>
      {showAnnouncement && <AnnouncementBar data={content.announcement} />}
      <Header brand={content.brand} showSearch={vis.commandPalette !== false} hasAnnouncement={!!showAnnouncement} />
      {children}
      <Footer content={content} />
      {vis.floatingWhatsApp !== false && <FloatingWhatsApp whatsapp={content.brand.whatsapp} message={content.floatingWhatsapp?.message} />}
      {vis.commandPalette !== false && (
        <CommandPalette
          services={allServices(content).map(({ slug, title }) => ({ slug, title }))}
          posts={posts.slice(0, 8).map(({ slug, title }) => ({ slug, title }))}
          whatsapp={content.brand.whatsapp}
          email={content.brand.email}
        />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(content)) }} />
    </>
  );
}
