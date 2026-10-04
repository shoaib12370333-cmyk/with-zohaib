// Starting content for the whole site. Everything here is editable from
// /admin/content — this file only matters until something is saved.
//
// The admin editor is *schema driven*: it builds its form from this object,
// so adding a field here automatically adds an input in the admin panel.
//   • keys ending in "Url"  → image uploader
//   • keys named "icon"     → icon picker (see components/Icons.js)
//   • keys named "color"    → colour picker
//   • arrays of strings     → one-per-line list
//   • arrays of objects     → repeatable cards (add / remove / reorder)

const defaultContent = {
  brand: {
    name: 'E-Commerce',
    sub: 'WITH ZOHAIB',
    tagline: 'Marketplace store setup, coaching and creative services for sellers on eBay, Amazon, Shopify and TikTok Shop.',
    whatsapp: '923213133661',
    phoneDisplay: '+92 321 3133661',
    email: 'hello@ecommercewithzohaib.com',
    instagram: '',
    facebook: '',
    youtube: '',
    tiktok: '',
    linkedin: '',
    messengerUsername: '',
    bookingUrl: '',
    avatarUrl: '',
    portraitUrl: '',
    faviconUrl: '',
    ogImageUrl: '',
    bookCallLabel: 'Book Free Call',
  },
  seo: {
    title: 'E-Commerce With Zohaib — Marketplace Growth & Coaching Agency',
    description:
      'E-Commerce With Zohaib helps new and struggling sellers launch and grow on eBay, Amazon, Shopify and TikTok Shop — with 1-on-1 coaching, store setup, graphic design, web and app development.',
    keywords: ['ecommerce coaching', 'amazon fba coaching', 'ebay store setup', 'shopify store design', 'tiktok shop growth'],
  },
  announcement: {
    enabled: false,
    text: 'Free strategy calls are open this week — limited slots.',
    linkLabel: 'Book yours',
    linkHref: '/contact',
  },
  visibility: {
    announcement: true,
    marquee: true,
    quiz: true,
    dashboard: true,
    diagnosis: true,
    process: true,
    stats: true,
    testimonials: true,
    blogPreview: true,
    faq: true,
    cta: true,
    floatingWhatsApp: true,
    commandPalette: true,
    analytics: true,
  },
  floatingWhatsapp: { message: "Hi, I'd like to know more about your services." },
  hero: {
    eyebrow: 'Marketplace Growth Partner',
    headlinePrefix: 'Your growth partner for',
    headlineSuffix: 'sellers.',
    lead:
      'We help new sellers launch with confidence and stuck sellers break through — on eBay, Amazon, Shopify and TikTok Shop. Strategy, coaching and hands-on execution, all in one place.',
    ctaPrimary: 'Book a Free Strategy Call',
    ctaSecondary: 'Explore Services',
    trust: ['Free strategy call', 'No long-term contracts', 'Real 1-on-1 support'],
    sideImageUrl: '',
  },
  platforms: [
    { key: 'ebay', name: 'eBay', color: '#3B82F6', listingsOptimized: 24, coachingSessions: '3/mo', chart: [12, 18, 16, 24, 30, 34, 42, 50, 58, 60, 68, 78], dailyMin: 30, dailyMax: 220 },
    { key: 'amazon', name: 'Amazon', color: '#FF9900', listingsOptimized: 40, coachingSessions: '5/mo', chart: [20, 22, 28, 26, 34, 40, 46, 52, 60, 70, 82, 90], dailyMin: 30, dailyMax: 220 },
    { key: 'shopify', name: 'Shopify', color: '#95BF47', listingsOptimized: 32, coachingSessions: '4/mo', chart: [10, 15, 22, 25, 32, 38, 48, 55, 62, 74, 82, 92], dailyMin: 30, dailyMax: 220 },
    { key: 'tiktokshop', name: 'TikTok Shop', color: '#FE2C55', listingsOptimized: 18, coachingSessions: '6/mo', chart: [6, 10, 14, 18, 22, 32, 38, 46, 58, 66, 78, 88], dailyMin: 30, dailyMax: 220 },
  ],
  dashboard: {
    eyebrow: 'Sample Dashboard',
    heading: 'The kind of numbers we track with you.',
    lead: 'An illustrative preview of the revenue dashboard we build for every client. Figures shown are sample data, not client results.',
    disclaimer: 'Illustrative sample data — not real client results.',
  },
  marqueeItems: [
    { name: 'eBay', logoUrl: '' },
    { name: 'Amazon', logoUrl: '' },
    { name: 'Shopify', logoUrl: '' },
    { name: 'TikTok Shop', logoUrl: '' },
    { name: 'Etsy', logoUrl: '' },
    { name: 'Walmart', logoUrl: '' },
  ],
  trustStripLabel: 'Platforms we work on',
  sectionLabels: {
    whatWeDo: { eyebrow: 'What We Do', heading: 'One team. Every platform. No guesswork.', lead: 'From your first listing to your next growth ceiling, every service is built specifically for marketplace sellers — not repurposed generic marketing.' },
    quiz: { eyebrow: 'Platform Match', heading: 'Not sure where to start? Answer 3 questions.', lead: 'A 30-second quiz that points you to the platform and service that fit your situation — then we refine it together on a free call.' },
    howItWorks: { eyebrow: 'How It Works', heading: 'From first call to consistent growth.' },
    successStories: { eyebrow: 'Seller Feedback', heading: 'What sellers say about working with us.' },
    blog: { eyebrow: 'Playbooks', heading: 'Free guides for marketplace sellers.' },
    faq: { eyebrow: 'Common Questions', heading: 'Before you reach out.' },
    meetFounder: { eyebrow: 'Meet The Founder', heading: "Hi, I'm" },
    values: { eyebrow: 'What We Stand On', heading: 'How we work with you.' },
    whoWeWorkWith: 'Who we work best with',
  },
  servicesOverview: [
    { icon: 'shop', slug: 'marketplace-store-setup', title: 'Marketplace Store Setup', description: 'eBay, Amazon, Shopify and TikTok Shop stores built right from day one — account, listings and store design.' },
    { icon: 'trend', slug: 'growth-and-scaling', title: 'Growth & Scaling', description: 'Already live but stuck? We diagnose the real bottleneck — traffic, conversion or offer — and fix it.' },
    { icon: 'users', slug: 'one-on-one-coaching', title: '1-on-1 Coaching', description: 'Direct mentorship across every major platform, tailored to exactly where your store is right now.' },
    { icon: 'brush', slug: 'graphic-design', title: 'Graphic Design', description: 'Listing images, storefront branding and ad creative that make people stop scrolling and buy.' },
    { icon: 'code', slug: 'website-development', title: 'Website Development', description: 'Custom, fast, conversion-ready websites that build credibility beyond the marketplace.' },
    { icon: 'app', slug: 'app-development', title: 'App Development', description: 'Mobile apps that extend your store and deepen customer loyalty beyond any single platform.' },
  ],
  featureBlock: {
    eyebrow: 'For Sellers Who Are Already Live',
    title: "Stuck isn't the same as stuck forever.",
    description:
      "If your store is live but sales don't match the effort, the fix is rarely “do more.” It's usually one or two things done wrong — a pricing gap, a listing that doesn't convert, an offer that doesn't fit the platform. We find that thing first, before touching anything else.",
    ctaLabel: 'Get a diagnosis',
    bullets: ['Pricing & margin audit', 'Listing & conversion review', 'Traffic & ad-spend check', 'A prioritised 30-day plan'],
  },
  process: [
    { num: '01', label: 'Strategy call', title: 'We learn your goals', description: "A free, no-pressure call to understand your product, platform and where you're starting from." },
    { num: '02', label: 'Build or fix', title: 'We set things right', description: 'New seller? We build your store from scratch. Already live? We diagnose what is holding it back.' },
    { num: '03', label: 'Grow with support', title: 'We stay in it with you', description: "Ongoing coaching and hands-on help, until you're actually hitting the targets you set." },
  ],
  stats: [
    { value: 4, suffix: '', label: 'Marketplace platforms covered' },
    { value: 8, suffix: '', label: 'Services under one roof' },
    { value: 3, suffix: '-step', label: 'Proven path from idea to launch' },
    { value: 100, suffix: '%', label: 'Personal, 1-on-1 coaching' },
  ],
  testimonials: [
    { name: 'Ayesha K.', role: 'Amazon Seller', quote: 'I had an Amazon store that was basically stuck. Within a few weeks of coaching I finally understood what was actually wrong — and started fixing it.' },
    { name: 'Bilal R.', role: 'Shopify Store Owner', quote: "I'd never sold online before. The team set up my Shopify store from zero and actually explained why each decision was made." },
    { name: 'Hassan M.', role: 'eBay Seller', quote: 'Between the eBay coaching and the new listing designs, my store finally looks — and performs — like a real business.' },
  ],
  founder: {
    name: 'Zohaib',
    role: 'Founder & CEO',
    bio: [
      'I started E-Commerce With Zohaib because I kept seeing the same thing: driven, capable people trying to sell online with no real guidance — just scattered videos and courses that never adapt to their actual store.',
      'I built this agency to be the partner I wish more sellers had — one that sits inside your actual numbers and listings, on eBay, Amazon, Shopify or TikTok Shop, and stays with you until things are genuinely working.',
      'Every service we offer, I stand behind personally.',
    ],
    whoWeWorkWith: [
      'First-time sellers who want to start on the right foot instead of learning everything the hard way',
      'Active sellers on eBay, Amazon, Shopify or TikTok Shop who feel stuck or plateaued',
      'Store owners who want design and development done by people who understand e-commerce',
      'Anyone tired of pre-recorded courses with no real feedback loop',
    ],
  },
  values: [
    { icon: 'target', title: 'Results Over Theory', description: "We measure success by your store's growth — not by how many modules you've completed." },
    { icon: 'shield', title: 'Full Transparency', description: 'Clear strategy, honest timelines and straight answers — even when the answer is “this needs work.”' },
    { icon: 'users', title: 'Hands-On Partnership', description: "We don't disappear after setup. Coaching continues until you're actually seeing growth." },
    { icon: 'layers', title: 'Platform Expertise', description: 'Deep, current knowledge of eBay, Amazon, Shopify and TikTok Shop — not generic advice.' },
  ],
  serviceCategories: [
    {
      title: 'Store Setup & Growth',
      heading: "Launch it right, or fix what's not working",
      items: [
        { slug: 'ebay', title: 'eBay', description: 'Store setup and optimisation built to rank, convert and scale.', includes: ['Store setup & optimisation', 'Product research & listings', 'SEO-optimised titles', 'Ongoing performance review'] },
        { slug: 'amazon', title: 'Amazon', description: 'Strategy and execution for both FBA and FBM sellers.', includes: ['Seller account setup', 'Listing optimisation & A+ content', 'PPC campaign structure', 'Inventory & growth strategy'] },
        { slug: 'shopify', title: 'Shopify', description: 'Stores designed and optimised to turn visitors into customers.', includes: ['Custom store design & build', 'App & payment setup', 'Conversion rate optimisation', 'Marketing funnel guidance'] },
        { slug: 'tiktok-shop', title: 'TikTok Shop', description: 'Set up, list and grow with a strategy built for the platform.', includes: ['Shop setup & verification', 'Listing & catalog setup', 'Content & creator strategy', 'Live-selling tactics'] },
      ],
    },
    {
      title: 'Creative & Development',
      heading: 'The work that backs up your store',
      items: [
        { slug: 'graphic-design', title: 'Graphic Design', description: 'Listing images and storefront branding that make people stop scrolling and start buying.', includes: ['Product & listing image design', 'Logo & storefront branding', 'Social & ad creatives'] },
        { slug: 'website-development', title: 'Website Development', description: 'A fast, professional website that works as hard as your marketplace stores.', includes: ['Custom design & build', 'Mobile-responsive development', 'Speed & SEO optimisation'] },
        { slug: 'app-development', title: 'App Development', description: 'Mobile apps that extend your store and deepen customer loyalty.', includes: ['iOS & Android development', 'Custom features & integrations', 'UI/UX design'] },
      ],
    },
  ],
  coaching: {
    title: '1-on-1 Platform Coaching',
    description: 'For sellers who want real access — not a library of videos. We work through your actual store, your actual numbers and your actual roadblocks, on eBay, Amazon, Shopify or TikTok Shop.',
    pills: ['eBay coaching', 'Amazon coaching', 'Shopify coaching', 'TikTok Shop coaching'],
    includes: [
      'Regular 1-on-1 sessions with a real mentor',
      'Custom action plans built around your store',
      'Direct feedback on listings & storefronts',
      'Ongoing accountability between sessions',
    ],
  },
  contact: {
    responseTime: 'Within 1 business day',
    hours: 'Mon – Sat, 10:00 – 19:00 PKT',
  },
  faqs: [
    { q: "I've never sold online before — can you still help me?", a: 'Yes. A large part of what we do is helping first-time sellers launch the right way from day one, instead of learning everything the hard way. Your strategy call will focus on picking the platform and approach that fits your product and goals.' },
    { q: 'Which platform should I start with?', a: "It depends on your product, budget and goals — there's no single right answer for everyone. We'll walk through this together on your strategy call and recommend a starting point based on your actual situation." },
    { q: 'Do you only work with beginners?', a: 'Not at all — most of our coaching clients are already selling and want to break through a plateau. We spend just as much time diagnosing existing stores as we do building new ones.' },
    { q: "What's included in the coaching?", a: "Regular 1-on-1 sessions, a custom action plan for your store, direct feedback on your listings or storefront, and accountability between sessions — built around the platform you're selling on." },
    { q: 'How long until I see results?', a: "It depends on your niche, platform and effort — anyone who promises a guaranteed timeline upfront isn't being straight with you. On your strategy call we'll give you a realistic picture based on where you're starting from." },
  ],
  pageHeaders: {
    about: { eyebrow: 'About Us', title: "We don't just teach e-commerce — we run it.", lead: 'E-Commerce With Zohaib exists for one reason: to be the partner sellers actually need, not another course that gets bought and forgotten.' },
    services: { eyebrow: 'Services', title: 'Everything you need, under one roof.', lead: 'Store setup, growth strategy, coaching, and the creative and development work to back it all up — organised around how sellers actually grow.' },
    contact: { eyebrow: 'Get In Touch', title: "Let's build your next move.", lead: "Tell us where you are and where you want to go. We'll take it from there — starting with a free strategy call." },
    blog: { eyebrow: 'Playbooks', title: 'Practical guides for marketplace sellers.', lead: 'No fluff. Short, honest write-ups on setting up, optimising and scaling on eBay, Amazon, Shopify and TikTok Shop.' },
  },
  ctaBanners: {
    home: { eyebrow: 'Get Started', title: 'Ready to stop guessing and start growing?', description: 'Book a free strategy call — no pressure, no scripts, just a real conversation about your store.' },
    about: { eyebrow: "Let's Talk", title: "Want to know if we're the right fit?", description: 'A free strategy call is the fastest way to find out.' },
    services: { eyebrow: 'Not Sure Where to Start?', title: "Tell us your platform. We'll tell you the plan.", description: 'Share where you are today and get a clear next step within one business day.' },
  },
  footer: { blurb: '' },
};

export default defaultContent;
