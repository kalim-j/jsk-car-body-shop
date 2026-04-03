export type BusinessService = {
  title: string;
  description: string;
};

export const business = {
  name: "JSK CAR BODY SHOP",
  phone: "+00 000 000 0000",
  // Use these in links (tel:/mailto:). Keep placeholders for now.
  phoneTelLink: "+0000000000",
  email: "info@jskcarbodyshop.com",
  mapUrl: "https://maps.google.com/?q=YOUR_ADDRESS_HERE",

  services: [
    {
      title: "Body Repairs",
      description: "Accident damage repair and panel alignment.",
    },
    {
      title: "Painting & Color Match",
      description: "Quality paintwork for a clean finish.",
    },
    {
      title: "Dent Removal",
      description: "Fix dents and surface imperfections.",
    },
    {
      title: "Polishing & Detailing",
      description: "Make your car look fresh and glossy.",
    },
  ] satisfies BusinessService[],

  // Gallery placeholders (SVG files for now in `public/gallery/`).
  galleryCount: 8,
  galleryPlaceholderCount: 4,
} as const;

