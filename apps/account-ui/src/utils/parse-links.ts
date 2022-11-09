export type Links = {
  prev?: Record<string, string>;
  next?: Record<string, string>;
};

export default function parse(linkHeader: string | null): Links {
  if (!linkHeader) return {};

  const links = linkHeader.split(/,\s*</);
  return links.reduce<Links>((acc: Links, link: string) => {
    const matcher = link.match(/<?([^>]*)>(.*)/);
    if (!matcher) return {};
    const linkUrl = matcher[1];
    const rel = matcher[2].match(/\s*(.+)\s*=\s*"?([^"]+)"?/);
    if (rel) {
      const link: Record<string, string> = {};
      for (const [key, value] of new URL(linkUrl).searchParams.entries()) {
        link[key] = value;
      }
      acc[rel[2] as keyof Links] = link;
    }
    return acc;
  }, {});
}
