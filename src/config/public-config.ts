export const clinicConfig = {
  name: "Shahbaz Dental Clinic",
  registration: "PHC REG # 24988",

  location: {
    city: "Samundri",
    district: "Faisalabad",
    province: "Punjab",
    postalCode: "37300",
    country: "Pakistan",
  },

  timeZone: "Asia/Karachi",
  currency: "PKR",

  streetAddress: "Circular Road near Ahle Hadees Masjid, Samundri",

  phone: "+92 344 3420001",
  phoneHref: "tel:+923443420001",
  landline: "041-3420001",
  landlineHref: "tel:0413420001",

  socialLinks: [
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    {
      label: "Marham",
      href: "https://www.marham.pk/hospitals/samundri/shahbaz-dental-clinic/samundri",
    },
    {
      label: "Oladoc",
      href: "https://oladoc.com/pakistan/faisalabad/h/shahbaz-dental-clinic/15342",
    },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "X", href: "https://x.com/" },
    { label: "TikTok", href: "https://www.tiktok.com/" },
  ],

  email: null,

  mapsUrl: "https://maps.app.goo.gl/L3pRisdzNg4QYJ8e9",

  openingHours: {
    display: "9:00 AM – 8:00 PM",
    daily: true,
  },

  coordinates: {
    latitude: 31.0613673,
    longitude: 72.9608833,
  },
  whatsapp: {
    number: "+923443420001",
    href: (message?: string) => {
      const baseUrl = "https://wa.me/923443420001";

      return message
        ? `${baseUrl}?text=${encodeURIComponent(message)}`
        : baseUrl;
    },
  },
} as const;
