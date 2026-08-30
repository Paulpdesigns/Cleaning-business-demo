/* ============================================================
   BUSINESS CONFIGURATION
   Edit everything in this file to re-brand the template for a
   new client. Nothing else in the codebase should need touching
   for a standard rebrand (name, numbers, prices, colours, area).
   ============================================================ */

const businessConfig = {
  businessName: "Free Cleaning Business",
  tagline: "Professional Cleaning Without The Hassle",

  // Regional settings — change these to convert the template for
  // a different country without redesigning anything else.
  country: "UK",
  currency: "GBP",
  currencySymbol: "\u00A3",
  postcodeLabel: "Postcode",
  phoneCountryCode: "+44",
  dateLocale: "en-GB",

  // Contact
  phoneDisplay: "020 1234 5678",
  phoneRaw: "+442012345678",
  whatsapp: "+447000000000",
  whatsappMessage: "Hi, I'd like to enquire about your cleaning services.",
  email: "hello@freecleaningbusiness.co.uk",

  // Address / service area
  addressLine: "Unit 4, Riverside Business Park",
  serviceCity: "London",
  serviceAreas: ["Croydon", "Bromley", "Sutton", "Greenwich", "Lewisham", "Wandsworth"],

  // Opening hours
  hours: [
    { day: "Monday – Friday", time: "07:00 – 19:00" },
    { day: "Saturday", time: "08:00 – 16:00" },
    { day: "Sunday", time: "Closed" }
  ],

  // Socials — leave blank ("") to hide a link in the footer
  social: {
    facebook: "",
    instagram: "",
    tiktok: ""
  },

  // Floating contact buttons — set to false to hide either one
  floatingButtons: {
    whatsapp: true,
    phone: true
  },

  // SEO / meta
  seo: {
    metaDescription: "Reliable, fully insured domestic and commercial cleaning across London. Get an instant online quote in under two minutes.",
    ogImage: "assets/images/hero-cleaning.jpg",
    canonicalUrl: "https://www.freecleaningbusiness.co.uk/"
  },

  // Integration placeholders — wire these up when a backend is chosen.
  // None of these currently submit anywhere; the form only validates
  // and displays a confirmation state.
  integrations: {
    formEndpoint: "", // e.g. Netlify Forms action, Formspree endpoint, or custom API URL
    provider: "none"  // "netlify" | "formspree" | "emailjs" | "supabase" | "firebase" | "custom" | "none"
  }
};

/* ============================================================
   QUOTE PRICING CONFIGURATION
   Every number used by the quote calculator lives here.
   ============================================================ */

const pricingConfig = {
  currencySymbol: businessConfig.currencySymbol,

  // Base call-out price per service type
  servicePrices: {
    regular: 18,      // per hour equivalent, blended into estimate below
    deep: 25,
    endOfTenancy: 220,
    moveInOut: 200,
    office: 90,
    airbnb: 55
  },

  // Added per bedroom (residential only)
  bedroomPrices: {
    studio: 0,
    "1": 15,
    "2": 30,
    "3": 45,
    "4": 65,
    "5plus": 90
  },

  // Added per bathroom count
  bathroomPrices: {
    "1": 0,
    "2": 12,
    "3": 24,
    "4plus": 36
  },

  // Commercial / office sizing
  officeSizePrices: {
    small: 0,     // up to ~500 sq ft
    medium: 40,   // ~500-1500 sq ft
    large: 90,    // ~1500-3000 sq ft
    custom: 150   // 3000+ sq ft, treat as a starting estimate
  },

  // Recurring frequency discounts (percentage off the subtotal)
  frequencyDiscounts: {
    oneOff: 0,
    weekly: 0.15,
    fortnightly: 0.10,
    monthly: 0.05
  },

  // Optional extras, flat add-ons
  addons: {
    insideOven: 15,
    insideFridge: 12,
    interiorWindows: 18,
    insideCabinets: 15,
    carpetCleaning: 35,
    upholstery: 30,
    laundry: 12,
    ironing: 15,
    balcony: 10,
    additionalBathroom: 12
  },

  // Property-type multiplier applied to the base+size subtotal
  propertyAdjustments: {
    flat: 1,
    house: 1.1,
    office: 1,
    commercial: 1.15,
    airbnb: 0.95
  },

  // Estimate is shown as a range: subtotal * [low, high]
  estimateRange: [0.92, 1.15],

  // Minutes, used only to show an approximate duration
  baseDurationMinutes: 90,
  perBedroomMinutes: 25,
  perExtraMinutes: 15
};
