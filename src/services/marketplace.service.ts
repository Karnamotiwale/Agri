export interface MarketplaceItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  link: string;
  image: string;
  rating: number;
}

const _items: MarketplaceItem[] = [
  // Organic Fertilizers
  {
    id: 'm1',
    name: 'Premium Vermicompost',
    category: 'Organic Fertilizers',
    price: '₹450',
    description: '100% organic earthworm compost for all types of crops.',
    link: 'https://www.amazon.in/s?k=organic+vermicompost',
    image: '/marketplace/vermicompost.png',
    rating: 4.8
  },
  {
    id: 'm2',
    name: 'Neem Cake Powder',
    category: 'Organic Fertilizers',
    price: '₹320',
    description: 'Natural fertilizer and soil conditioner with pesticidal properties.',
    link: 'https://www.amazon.in/s?k=neem+cake+powder',
    image: '/marketplace/neem_cake.png',
    rating: 4.5
  },
  // Organic Pesticides
  {
    id: 'm3',
    name: 'Cold Pressed Neem Oil',
    category: 'Organic Pesticides',
    price: '₹280',
    description: 'Pure neem oil for effective pest control without chemicals.',
    link: 'https://www.amazon.in/s?k=organic+neem+oil+for+plants',
    image: '/marketplace/neem_oil.jpg',
    rating: 4.7
  },
  {
    id: 'm4',
    name: 'Dashparni Arka',
    category: 'Organic Pesticides',
    price: '₹550',
    description: 'Traditional herbal pesticide made from 10 different leaves.',
    link: 'https://www.amazon.in/s?k=dashparni+arka',
    image: '/marketplace/dashparni_arka.png',
    rating: 4.6
  },
  // Seeds
  {
    id: 'm5',
    name: 'Organic Wheat Seeds (High Yield)',
    category: 'Seeds',
    price: '₹1200',
    description: 'Certified organic wheat seeds adapted for local climate.',
    link: 'https://www.amazon.in/s?k=organic+wheat+seeds',
    image: '/marketplace/wheat_seeds.png',
    rating: 4.9
  },
  // Tools & Machinery
  {
    id: 'm6',
    name: 'Manual Seed Drill',
    category: 'Tools & Machinery',
    price: '₹3500',
    description: 'Ergonomic manual seed drill for uniform sowing.',
    link: 'https://www.amazon.in/s?k=manual+seed+drill',
    image: '/marketplace/seed_drill.png',
    rating: 4.4
  },
  {
    id: 'm7',
    name: 'Electric Backpack Sprayer',
    category: 'Tools & Machinery',
    price: '₹4200',
    description: '16L high-pressure battery-operated sprayer for organic sprays.',
    link: 'https://www.amazon.in/s?k=battery+operated+sprayer',
    image: '/marketplace/backpack_sprayer.jpg',
    rating: 4.3
  },
  // Cattle Feed
  {
    id: 'm8',
    name: 'Organic Cattle Feed Mix',
    category: 'Cattle Feed',
    price: '₹950',
    description: 'Nutrient-rich balanced diet for healthier cattle.',
    link: 'https://www.amazon.in/s?k=cattle+feed',
    image: '/marketplace/cattle_feed.jpg',
    rating: 4.6
  }
];

export const marketplaceService = {
  getCategories: () => [
    'All',
    'Organic Fertilizers',
    'Organic Pesticides',
    'Seeds',
    'Crop Nutrition',
    'Cattle Feed',
    'Tools & Machinery'
  ],
  getItems: async (category: string = 'All'): Promise<MarketplaceItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (category === 'All') resolve([..._items]);
        else resolve(_items.filter(item => item.category === category));
      }, 500);
    });
  }
};
