export const SITE_URL = "https://kartavyapathak.com";

export interface ToolDefinition {
  slug: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  available: boolean;
}

export const LIVE_TOOLS: ToolDefinition[] = [
  {
    slug: "protein-calculator",
    icon: "🥩",
    title: "Protein Intake Calculator",
    description:
      "Calculate exactly how much protein you should eat every day based on your body weight, activity level and fitness goals.",
    href: "/tools/protein-calculator",
    available: true,
  },
];

export const COMING_SOON_TOOLS: ToolDefinition[] = [
  {
    slug: "calorie-calculator",
    icon: "🔥",
    title: "Calorie Calculator",
    description: "Estimate your daily calorie needs for cutting, bulking, or maintaining.",
    href: "/tools/calorie-calculator",
    available: false,
  },
  {
    slug: "macro-calculator",
    icon: "📊",
    title: "Macro Calculator",
    description: "Find your ideal protein, carbohydrate and fat ratios.",
    href: "/tools/macro-calculator",
    available: false,
  },
  {
    slug: "bmi-calculator",
    icon: "⚖️",
    title: "BMI Calculator",
    description: "Check your body mass index and understand what it means.",
    href: "/tools/bmi-calculator",
    available: false,
  },
  {
    slug: "water-intake-calculator",
    icon: "💧",
    title: "Water Intake Calculator",
    description: "Find your ideal daily hydration level for peak performance.",
    href: "/tools/water-intake-calculator",
    available: false,
  },
  {
    slug: "body-fat-calculator",
    icon: "📏",
    title: "Body Fat Calculator",
    description: "Estimate your body fat percentage and lean mass.",
    href: "/tools/body-fat-calculator",
    available: false,
  },
];

export const EXAMPLE_FOODS = [
  { icon: "🍗", name: "200g Chicken Breast", protein: 62 },
  { icon: "🧀", name: "100g Paneer", protein: 18 },
  { icon: "🥚", name: "4 Eggs", protein: 24 },
  { icon: "🥛", name: "250g Greek Yogurt", protein: 25 },
  { icon: "🥤", name: "1 Scoop Whey", protein: 24 },
  { icon: "🫘", name: "100g Tofu", protein: 17 },
  { icon: "🌱", name: "100g Soya Chunks", protein: 52 },
] as const;

export const PROTEIN_FAQS = [
  {
    question: "How much protein do I need?",
    answer:
      "Most active adults benefit from 1.2–2.2 g per kg of body weight depending on goals, training intensity and overall diet. Sedentary individuals may only need 0.8 g/kg, while athletes and those in muscle-building phases benefit from 1.8–2.2 g/kg. This calculator uses evidence-based ranges from sports nutrition research.",
  },
  {
    question: "Can I eat too much protein?",
    answer:
      "For healthy individuals, higher protein intakes (up to 2.2 g/kg) are generally safe and well-tolerated. Excess protein is converted to energy or excreted. However, people with kidney disease should consult a healthcare professional before significantly increasing protein intake.",
  },
  {
    question: "Does protein help with weight loss?",
    answer:
      "Yes. Protein is the most satiating macronutrient, meaning it keeps you fuller for longer. It also has the highest thermic effect of food — your body burns more calories digesting protein than carbs or fat. It preserves muscle mass during calorie restriction, improving body composition.",
  },
  {
    question: "Is whey protein necessary?",
    answer:
      "Whole food sources should always come first — chicken, eggs, legumes, dairy, tofu. Protein powder is a convenient supplement when you struggle to meet daily targets through meals alone, but it is not required. Any complete protein source works.",
  },
  {
    question: "Can vegetarians meet their protein requirements?",
    answer:
      "Absolutely. Plant-based foods like lentils, chickpeas, soya chunks, tofu, paneer, Greek yogurt, quinoa, and edamame are all excellent protein sources. A vegetarian who plans their meals well can easily hit 1.6–2.0 g/kg without supplements.",
  },
] as const;
