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
    image: 'https://images.unsplash.com/photo-1599423300746-b62533397364?q=80&w=400&auto=format&fit=crop',
    rating: 4.8
  },
  {
    id: 'm2',
    name: 'Neem Cake Powder',
    category: 'Organic Fertilizers',
    price: '₹320',
    description: 'Natural fertilizer and soil conditioner with pesticidal properties.',
    link: 'https://www.amazon.in/s?k=neem+cake+powder',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=400&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=400&auto=format&fit=crop',
    rating: 4.7
  },
  {
    id: 'm4',
    name: 'Dashparni Arka',
    category: 'Organic Pesticides',
    price: '₹550',
    description: 'Traditional herbal pesticide made from 10 different leaves.',
    link: 'https://www.amazon.in/s?k=dashparni+arka',
    image: 'https://images.unsplash.com/photo-1590004953392-5aba2e785943?q=80&w=400&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?q=80&w=400&auto=format&fit=crop',
    rating: 4.4
  },
  {
    id: 'm7',
    name: 'Electric Backpack Sprayer',
    category: 'Tools & Machinery',
    price: '₹4200',
    description: '16L high-pressure battery-operated sprayer for organic sprays.',
    link: 'https://www.amazon.in/s?k=battery+operated+sprayer',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=400&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1500382017468-9049fee74a62?q=80&w=400&auto=format&fit=crop',
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
