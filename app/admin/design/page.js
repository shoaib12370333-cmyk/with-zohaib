'use client';
import SchemaEditor from '@/components/admin/SchemaEditor';
import SaveBar from '@/components/admin/SaveBar';
import useContentEditor from '@/components/admin/useContentEditor';
import { useToast } from '@/components/admin/Fields';

const KEYS = ['brand', 'contact', 'floatingWhatsapp', 'seo', 'footer'];
const TITLES = {
  brand: 'Brand, logo & social links',
  contact: 'Contact details',
  floatingWhatsapp: 'Floating WhatsApp button',
  seo: 'Search engine (SEO) defaults',
  footer: 'Footer',
};

export default function BrandPage() {
  const { content, setContent, dirty, save, status, error, replace } = useContentEditor();
  const [toast, toastNode] = useToast();
  if (!content) return <p className="text-muted py-20 text-center">{status === 'error' ? error : 'Loading…'}</p>;

  return (
    <SaveBar
      title="Brand & SEO"
      subtitle="Logo, contact details, social links and how the site appears on Google and when shared."
      dirty={dirty}
      status={status}
      error={error}
      onSave={async () => { if (await save('Brand & SEO')) toast('Saved'); }}
      onRestore={(d) => { replace(d); toast('Version restored'); }}
    >
      <SchemaEditor content={content} keys={KEYS} titles={TITLES} onChange={setContent} />
      {toastNode}
    </SaveBar>
  );
}
