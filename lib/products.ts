export type FruitKind =
  | "strawberry"
  | "strawberryHalf"
  | "raspberry"
  | "blueberry"
  | "mango"
  | "mangoSlice"
  | "rose"
  | "blossom"
  | "leaf";

export interface ProductPalette {
  /** Main jam colour inside the jar */
  jam: string;
  /** Darker jam shade for depth */
  jamDeep: string;
  /** Gingham cloth colour on the lid */
  cloth: string;
  /** Soft background tint used behind the product */
  tint: string;
  /** Strong accent used for text highlights */
  accent: string;
  /** Bold brand colour for this flavour: backgrounds, cards and stages */
  bold: string;
  /** Text colour that sits on `bold` */
  on: string;
  /** Short one-word mood used on stickers */
  mood: string;
}

export interface Product {
  slug: string;
  name: string;
  flavour: string;
  tagline: string;
  description: string;
  story: string;
  price: number;
  weight: string;
  image: string;
  /** The jar alone on a transparent background */
  cutout: string;
  palette: ProductPalette;
  fruits: FruitKind[];
  notes: string[];
  pairsWith: string[];
  ingredients: string;
  badge?: string;
}

export const products: Product[] = [
  {
    slug: "strawberry-bliss",
    name: "Strawberry Bliss",
    flavour: "Strawberry",
    tagline: "The breakfast classic, done properly.",
    description:
      "Mahabaleshwar strawberries cooked low and slow until glossy, bright and just a little tart.",
    story:
      "We wait for the late-winter strawberries from Mahabaleshwar, when they're deep red to the core. Each batch is stirred by hand and pulled off the flame the moment it sets, so it still tastes of fresh fruit.",
    price: 299,
    weight: "240g",
    image: "/images/products/strawberry-bliss.jpg",
    cutout: "/images/products/cutout/strawberry-bliss.webp",
    palette: {
      jam: "#e11d48",
      jamDeep: "#9f1239",
      cloth: "#f43f5e",
      tint: "#fff1f2",
      accent: "#e11d48",
      bold: "#e2323f",
      on: "#fff4e6",
      mood: "Sun-ripe",
    },
    fruits: ["strawberry", "strawberryHalf", "blossom", "leaf"],
    notes: ["Bright", "Jammy", "Sun-ripe"],
    pairsWith: ["Buttered toast", "Thick yoghurt", "Scones"],
    ingredients: "Strawberries (65%), cane sugar, lemon juice.",
    badge: "Bestseller",
  },
  {
    slug: "raspberry-rose",
    name: "Raspberry Rose",
    flavour: "Raspberry + Rose",
    tagline: "Tangy raspberries, a whisper of rose.",
    description:
      "Tart raspberries with a few drops of Kannauj rose water, floral without being perfumey.",
    story:
      "Raspberries give this jar its sharpness, and the rose comes in at the very end, a few drops of rose water distilled in Kannauj. It's the jar people ask about at brunch.",
    price: 349,
    weight: "240g",
    image: "/images/products/raspberry-rose.jpg",
    cutout: "/images/products/cutout/raspberry-rose.webp",
    palette: {
      jam: "#be123c",
      jamDeep: "#881337",
      cloth: "#e11d48",
      tint: "#fdf2f8",
      accent: "#be123c",
      bold: "#f7b2c3",
      on: "#4a0f22",
      mood: "Floral",
    },
    fruits: ["raspberry", "rose", "raspberry", "leaf"],
    notes: ["Tangy", "Floral", "Elegant"],
    pairsWith: ["Croissants", "Dark chocolate", "Shrikhand"],
    ingredients: "Raspberries (62%), cane sugar, lemon juice, rose water.",
    badge: "New",
  },
  {
    slug: "mango-sunshine",
    name: "Mango Sunshine",
    flavour: "Alphonso Mango",
    tagline: "Ratnagiri summer, in a jar.",
    description:
      "Ratnagiri Alphonso mangoes with a pinch of cardamom. Thick, golden and very hard to share.",
    story:
      "Alphonso season is short, so we make this one in May and only in May. The pulp gets a little cardamom and lemon and cooks just long enough to thicken, so it still tastes like the fruit.",
    price: 329,
    weight: "240g",
    image: "/images/products/mango-sunshine.jpg",
    cutout: "/images/products/cutout/mango-sunshine.webp",
    palette: {
      jam: "#d97706",
      jamDeep: "#b45309",
      cloth: "#f59e0b",
      tint: "#fffbeb",
      accent: "#d97706",
      bold: "#ffb222",
      on: "#3d1d00",
      mood: "Golden",
    },
    fruits: ["mango", "blossom", "mangoSlice", "leaf"],
    notes: ["Golden", "Lush", "Cardamom"],
    pairsWith: ["Warm parathas", "Vanilla ice cream", "Pancakes"],
    ingredients: "Alphonso mango (68%), cane sugar, lemon juice, green cardamom.",
    badge: "Seasonal",
  },
  {
    slug: "mixed-berry",
    name: "Mixed Berry",
    flavour: "Strawberry · Blueberry · Raspberry",
    tagline: "Three berries, one very good jar.",
    description:
      "Strawberry, blueberry and raspberry cooked together into a deep, rich jam that goes with nearly everything.",
    story:
      "Strawberries for sweetness, raspberries for sharpness and blueberries for colour. We cook all three together in one pot so the flavours properly blend.",
    price: 349,
    weight: "240g",
    image: "/images/products/mixed-berry.jpg",
    cutout: "/images/products/cutout/mixed-berry.webp",
    palette: {
      jam: "#6366f1",
      jamDeep: "#4338ca",
      cloth: "#4f46e5",
      tint: "#f5f3ff",
      accent: "#4f46e5",
      bold: "#4a2878",
      on: "#ffe9f0",
      mood: "Deep",
    },
    fruits: ["blueberry", "strawberry", "raspberry", "blueberry"],
    notes: ["Deep", "Rich", "Balanced"],
    pairsWith: ["Peanut butter toast", "Cheesecake", "Overnight oats"],
    ingredients: "Strawberries, blueberries, raspberries (64%), cane sugar, lemon juice.",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
