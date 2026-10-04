// A template (unlike a layout) re-mounts on every navigation, so each page
// fades/slides in smoothly instead of snapping.
export default function SiteTemplate({ children }) {
  return <div className="page-in">{children}</div>;
}
