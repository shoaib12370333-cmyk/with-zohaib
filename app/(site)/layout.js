import { getContent } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

// This layout renders the real, public-facing site — exactly what visitors
// see. It intentionally never includes any editing UI, even for a logged-in
// admin. Editing happens only inside /admin/edit/*, which reuses these same
// content components but wraps them with the edit provider.
export default async function SiteLayout({ children }) {
  const content = await getContent();
  const vis = content.visibility || {};
  return (
    <>
      <Header brand={content.brand} />
      {children}
      <Footer content={content} />
      {vis.floatingWhatsApp !== false && (
        <FloatingWhatsApp whatsapp={content.brand.whatsapp} message={content.floatingWhatsapp?.message} />
      )}
    </>
  );
}
