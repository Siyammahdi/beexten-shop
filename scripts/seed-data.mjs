const unsplash = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

/** Approximate BDT list prices from legacy USD seed values. */
const bdt = (usd) => Math.round((usd * 110) / 100) * 100;

export function detailedDescriptionFor(product) {
  return [
    product.description,
    "",
    "Why we picked it",
    `${product.name} earned a spot in our catalog after we tried it ourselves — for build quality, everyday comfort, and value in Bangladesh.`,
    "",
    "Delivery & returns",
    "Ships nationwide with cash on delivery. Unopened items in original condition qualify for our 7-day return policy.",
  ].join("\n\n");
}

export const categories = [
  {
    slug: "electronics",
    name: "Electronics",
    tagline: "Sound, sight and smart essentials",
    image: unsplash("1583394838336-acd977736f90"),
  },
  {
    slug: "fashion",
    name: "Fashion",
    tagline: "Everyday pieces, made to last",
    image: unsplash("1503341504253-dff4815485f1"),
  },
  {
    slug: "home",
    name: "Home & Living",
    tagline: "Calm objects for calm spaces",
    image: unsplash("1578500494198-246f612d3b3d"),
  },
  {
    slug: "beauty",
    name: "Beauty",
    tagline: "Clean formulas, honest results",
    image: unsplash("1596462502278-27bfdc403348"),
  },
];

export const products = [
  {
    slug: "studio-wireless-headphones",
    name: "Studio Wireless Headphones",
    category: "electronics",
    price: bdt(189),
    image: unsplash("1505740420928-5e560c06d30e"),
    description:
      "Over-ear headphones with adaptive noise cancelling, plush memory-foam cushions and a sound profile tuned for long listening sessions.",
    highlights: ["40-hour battery life", "Active noise cancelling", "USB-C fast charging"],
    featured: true,
  },
  {
    slug: "pocket-earbuds",
    name: "Pocket Earbuds",
    category: "electronics",
    price: bdt(99),
    image: unsplash("1590658268037-6bf12165a8df"),
    description:
      "Compact true-wireless earbuds with a secure fit, crisp calls and a slim charging case that disappears into any pocket.",
    highlights: ["24-hour total playback", "IPX4 sweat resistant", "Wireless charging case"],
  },
  {
    slug: "boom-portable-speaker",
    name: "Boom Portable Speaker",
    category: "electronics",
    price: bdt(129),
    image: unsplash("1608043152269-423dbba4e7e1"),
    description:
      "A rugged, waterproof speaker with deep bass and 360° sound. Take it to the beach, the park or the shower.",
    highlights: ["IP67 waterproof", "20-hour playtime", "Pair two for stereo"],
  },
  {
    slug: "instant-film-camera",
    name: "Instant Film Camera",
    category: "electronics",
    price: bdt(119),
    image: unsplash("1526170375885-4d8ecf77b99f"),
    description:
      "Point, shoot and hold the moment seconds later. A modern take on the classic instant camera with auto exposure.",
    highlights: ["Auto exposure", "Built-in flash", "Selfie mirror"],
    featured: true,
  },
  {
    slug: "smartwatch-series-one",
    name: "Smartwatch Series One",
    category: "electronics",
    price: bdt(249),
    image: unsplash("1546868871-7041f2a55e12"),
    description:
      "Track workouts, sleep and heart rate with a bright always-on display wrapped in a lightweight aluminium case.",
    highlights: ["Always-on display", "Heart-rate & sleep tracking", "5-day battery"],
  },
  {
    slug: "active-fitness-watch",
    name: "Active Fitness Watch",
    category: "electronics",
    price: bdt(79),
    image: unsplash("1523275335684-37898b6baf30"),
    description:
      "A minimal fitness tracker with a soft silicone strap, step counting and smart notifications — nothing you don't need.",
    highlights: ["Step & calorie tracking", "Smart notifications", "Water resistant"],
  },
  {
    slug: "velocity-running-shoes",
    name: "Velocity Running Shoes",
    category: "fashion",
    price: bdt(139),
    image: unsplash("1542291026-7eec264c27ff"),
    description:
      "Lightweight running shoes with a responsive foam midsole and breathable knit upper for daily miles.",
    highlights: ["Responsive foam midsole", "Breathable knit upper", "Durable rubber outsole"],
    featured: true,
  },
  {
    slug: "essential-cotton-tee",
    name: "Essential Cotton Tee",
    category: "fashion",
    price: bdt(29),
    image: unsplash("1521572163474-6864f9cf17ab"),
    description:
      "The tee you'll reach for every day. Heavyweight organic cotton with a relaxed fit that holds its shape wash after wash.",
    highlights: ["100% organic cotton", "Relaxed fit", "Pre-shrunk"],
  },
  {
    slug: "classic-leather-jacket",
    name: "Classic Leather Jacket",
    category: "fashion",
    price: bdt(329),
    image: unsplash("1551028719-00167b16eac5"),
    description:
      "A timeless biker jacket cut from soft full-grain leather, finished with sturdy hardware and a quilted lining.",
    highlights: ["Full-grain leather", "Quilted lining", "YKK zippers"],
  },
  {
    slug: "wayfarer-sunglasses",
    name: "Wayfarer Sunglasses",
    category: "fashion",
    price: bdt(89),
    image: unsplash("1572635196237-14b3f281503f"),
    description:
      "Iconic acetate frames with polarised lenses that cut glare and block 100% of UV rays.",
    highlights: ["Polarised lenses", "UV400 protection", "Hand-polished acetate"],
  },
  {
    slug: "quilted-crossbody-bag",
    name: "Quilted Crossbody Bag",
    category: "fashion",
    price: bdt(159),
    image: unsplash("1548036328-c9fa89d128fa"),
    description:
      "A structured crossbody in quilted leather with a chain strap — sized for your phone, cards and keys.",
    highlights: ["Quilted leather", "Adjustable chain strap", "Magnetic closure"],
    featured: true,
  },
  {
    slug: "heritage-leather-watch",
    name: "Heritage Leather Watch",
    category: "fashion",
    price: bdt(175),
    image: unsplash("1593998066526-65fcab3021a2"),
    description:
      "A clean, classic dial on a soft leather strap. Swiss-made quartz movement and sapphire-coated glass.",
    highlights: ["Quartz movement", "Sapphire-coated glass", "Genuine leather strap"],
  },
  {
    slug: "velvet-lounge-sofa",
    name: "Velvet Lounge Sofa",
    category: "home",
    price: bdt(1290),
    image: unsplash("1555041469-a586c61ea9bc"),
    description:
      "A deep, three-seat sofa upholstered in emerald velvet with solid oak legs and high-resilience foam cushions.",
    highlights: ["Solid oak legs", "Stain-resistant velvet", "Seats three"],
    featured: true,
  },
  {
    slug: "tufted-accent-chair",
    name: "Tufted Accent Chair",
    category: "home",
    price: bdt(349),
    image: unsplash("1567538096630-e0c55bd6374c"),
    description:
      "A softly tufted accent chair that brings quiet elegance to a reading nook, bedroom or entryway.",
    highlights: ["Hand-tufted upholstery", "Hardwood frame", "Easy assembly"],
  },
  {
    slug: "dome-pendant-light",
    name: "Dome Pendant Light",
    category: "home",
    price: bdt(119),
    image: unsplash("1513506003901-1e6a229e2d15"),
    description:
      "A powder-coated dome pendant that casts a warm, focused pool of light over dining tables and kitchen islands.",
    highlights: ["Powder-coated steel", "Adjustable cord", "E27 bulb fitting"],
  },
  {
    slug: "arc-floor-lamp",
    name: "Arc Floor Lamp",
    category: "home",
    price: bdt(159),
    image: unsplash("1507473885765-e6ed057f782c"),
    description:
      "An adjustable floor lamp with a weighted base and pivoting shade for reading light exactly where you want it.",
    highlights: ["Pivoting shade", "Weighted base", "Foot switch"],
  },
  {
    slug: "ceramic-planter",
    name: "Ceramic Planter",
    category: "home",
    price: bdt(39),
    image: unsplash("1485955900006-10f4d324d411"),
    description:
      "A matte glazed ceramic planter in soft mint with a drainage hole — a small touch of green for any shelf.",
    highlights: ["Matte glaze", "Drainage hole", "Plant not included"],
  },
  {
    slug: "stoneware-mug",
    name: "Stoneware Mug",
    category: "home",
    price: bdt(22),
    image: unsplash("1514228742587-6b1558fcca3d"),
    description:
      "A generously sized stoneware mug with a satin finish. Dishwasher and microwave safe.",
    highlights: ["350 ml capacity", "Dishwasher safe", "Microwave safe"],
  },
  {
    slug: "noir-eau-de-parfum",
    name: "Noir Eau de Parfum",
    category: "beauty",
    price: bdt(115),
    image: unsplash("1585386959984-a4155224a1ad"),
    description:
      "A warm, woody fragrance with notes of bergamot, iris and amber that lingers softly through the day.",
    highlights: ["50 ml", "Long-lasting", "Vegan formula"],
    featured: true,
  },
  {
    slug: "gentle-foaming-cleanser",
    name: "Gentle Foaming Cleanser",
    category: "beauty",
    price: bdt(24),
    image: unsplash("1556228578-8c89e6adf883"),
    description:
      "A pH-balanced daily cleanser that lifts away dirt and makeup without stripping the skin's natural barrier.",
    highlights: ["pH balanced", "Fragrance free", "For all skin types"],
  },
  {
    slug: "daily-hydrating-cream",
    name: "Daily Hydrating Cream",
    category: "beauty",
    price: bdt(38),
    image: unsplash("1620916566398-39f1143ab7be"),
    description:
      "A lightweight moisturiser with hyaluronic acid and ceramides for soft, plump skin from morning to night.",
    highlights: ["Hyaluronic acid", "Ceramide complex", "Non-greasy finish"],
  },
  {
    slug: "glow-face-palette",
    name: "Glow Face Palette",
    category: "beauty",
    price: bdt(48),
    image: unsplash("1522335789203-aabd1fc54bc9"),
    description:
      "Bronzer, blush and highlighter in one slim compact — everything you need for a natural, sun-kissed look.",
    highlights: ["3 buildable shades", "Mirror included", "Cruelty free"],
  },
  {
    slug: "botanical-serum-set",
    name: "Botanical Serum Set",
    category: "beauty",
    price: bdt(64),
    image: unsplash("1611930022073-b7a4ba5fcccd"),
    description:
      "A duo of plant-based serums — vitamin C for brightness by day and a calming oil for repair by night.",
    highlights: ["Vitamin C serum", "Overnight repair oil", "Glass dropper bottles"],
  },
  {
    slug: "skincare-ritual-kit",
    name: "Skincare Ritual Kit",
    category: "beauty",
    price: bdt(89),
    image: unsplash("1629198688000-71f23e745b6e"),
    description:
      "Our complete routine in one box: cleanser, toner, serum and moisturiser, sized for a month of daily use.",
    highlights: ["4-step routine", "Travel friendly", "Recyclable packaging"],
  },
];
