export interface FarmingStage {
  name: string;
  period: string;
  tasks: string[];
}

export interface FertilizerGuide {
  name: string;
  ingredients: string[];
  preparation: string[];
  application: string[];
}

const _cultivationTips = [
  {
    category: "General Tips",
    stages: [
      {
        name: "Land Preparation",
        period: "Pre-Sowing",
        tasks: [
          "Test soil pH and nutrient levels before planting.",
          "Add deep-layered organic compost (2 tons/acre).",
          "Ensure proper drainage to prevent waterlogging."
        ]
      },
      {
        name: "Sowing & Growth",
        period: "Days 1-45",
        tasks: [
          "Treat seeds with Bijamrut for better germination.",
          "Maintain uniform spacing for optimal sunlight.",
          "Initial weeding should be done at day 20."
        ]
      },
      {
        name: "Crop Protection",
        period: "Vegetative Stage",
        tasks: [
          "Monitor daily for early signs of yellowing or pests.",
          "Use Neemoil spray (5%) as a preventive measure.",
          "Invite natural predators (ladybugs, spiders)."
        ]
      },
      {
        name: "Fruiting & Harvest",
        period: "Final Stage",
        tasks: [
          "Reduce watering gradually before harvesting.",
          "Harvest at 80% ripeness for distance transport.",
          "Store in a cool, ventilated place immediately."
        ]
      }
    ]
  }
];

const _fertilizerGuides: FertilizerGuide[] = [
  {
    name: "Jeevamrut (Liquid Gold)",
    ingredients: [
      "10 kg Fresh Cow Dung (Desi breed preferred)",
      "5-10 Liters Cow Urine",
      "1-2 kg Jaggery (Old/Black Gud)",
      "1-2 kg Pulse Flour (Besan/Gram Flour)",
      "Handful of fertile soil (from farm edge)",
      "200 Liters Water (Chlorine-free)"
    ],
    preparation: [
      "Take a 200L plastic drum and fill with 190L water.",
      "Add Cow Dung and Cow Urine, mix thoroughly.",
      "Dissolve Jaggery and Pulse Flour in a separate bucket, then add to the drum.",
      "Add fertile soil and stir the whole mixture with a wooden stick.",
      "Stir twice daily (clockwise) for 10 minutes.",
      "Cover with a gunny bag and store in shade.",
      "Ready for use in 3-7 days based on temperature."
    ],
    application: [
      "Dilute 1 liter of Jeevamrut in 10 liters of water.",
      "Apply through drip or directly to roots every 15 days.",
      "For foliar spray, filter the liquid and dilute at 5-10%."
    ]
  },
  {
    name: "Ghanjeevamrut (Solid)",
    ingredients: [
      "100 kg Cow Dung",
      "2 kg Jaggery",
      "2 kg Pulse Flour",
      "Small amount of Cow Urine"
    ],
    preparation: [
      "Mix all ingredients together to form a thick paste.",
      "Spread thin in a shaded area to dry completely.",
      "Crush into powder and store in bags.",
      "Can be stored for up to 6 months."
    ],
    application: [
      "Apply 250kg per acre during land preparation.",
      "Mix with soil near the roots during the crop cycle."
    ]
  }
];

export const farmingWisdomService = {
  getCultivationTips: () => _cultivationTips,
  getFertilizerGuides: () => _fertilizerGuides
};
