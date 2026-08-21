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

  email: null,

  mapsUrl:
    "https://www.google.com/maps/place/Shahbaz+Dental+Clinic/@31.0613673,72.9608833,17z",

  openingHours: {
    display: "9:00 AM – 8:00 PM",
    daily: true,
  },

  coordinates: {
    latitude: 31.0613673,
    longitude: 72.9608833,
  },
} as const;