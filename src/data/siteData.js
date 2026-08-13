/**
 * Non-translatable site config — contact, images, social links.
 * All user-facing text lives in src/i18n/translations/
 */
export const siteData = {
  contact: {
    phone: "+91 98765 43210",
    whatsapp: "919699371940",
    email: "info@shreekesharfabrication.demo",
    address: "Demo Address, Near Main Road, Maharashtra — 413001",
    mapLink: "#",
  },

  owners: {
    prabhakar: {
      phone: "+91 98765 43210",
      image: null,
    },
    harsh: {
      phone: "+91 96993 71940",
      image: "/images/owner-harsh.jpg",
    },
  },

  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
  },

  images: {
    hero: "/images/hero.jpg",
    logo: "/images/logo.png",
    shop: "/images/shop.jpg",
    about: "/images/about.jpg",
    gallery: [
      "/images/gallery-1.jpg",
      "/images/gallery-2.jpg",
      null,
      null,
      null,
      null,
    ],
    devotional: "/images/devotional.jpg",
  },

  ownerKeys: ["prabhakar", "harsh"],
}
