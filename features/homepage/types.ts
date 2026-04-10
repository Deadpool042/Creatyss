export type FeaturedCategory = {
  id: string;
  name: string;
  slug: string;
  representativeImage: {
    filePath: string;
    altText: string | null;
  } | null;
};
