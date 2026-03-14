export interface GovernmentScheme {
  id: string;
  name: string;
  category: 'Insurance' | 'Loan';
  description: string;
  benefits: string[];
  link: string;
  icon: string;
}

const _schemes: GovernmentScheme[] = [
  {
    id: 's1',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Insurance',
    description: 'Provides financial support to farmers suffering crop loss/damage arising out of natural calamities.',
    benefits: [
      'Comprehensive insurance cover against crop failure',
      'Low premium rates for farmers',
      'Quick settlement of claims'
    ],
    link: 'https://pmfby.gov.in/',
    icon: 'ShieldCheck'
  },
  {
    id: 's2',
    name: 'Kisan Credit Card (KCC) Scheme',
    category: 'Loan',
    description: 'Enables farmers to purchase agricultural inputs and draw cash for their production needs.',
    benefits: [
      'Easy access to institutional credit',
      'Lower interest rates',
      'Flexible repayment options'
    ],
    link: 'https://www.myscheme.gov.in/schemes/kcc',
    icon: 'CreditCard'
  },
  {
    id: 's3',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    category: 'Loan',
    description: 'Income support of Rs. 6,000/- per year in three equal installments to all landholding farmer families.',
    benefits: [
      'Direct benefit transfer to bank accounts',
      'Financial assistance for farming needs',
      'Nationwide coverage'
    ],
    link: 'https://pmkisan.gov.in/',
    icon: 'Banknote'
  },
  {
    id: 's5',
    name: 'Agricultural Infrastructure Fund (AIF)',
    category: 'Loan',
    description: 'A medium-long term debt financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets.',
    benefits: [
      'Interest subvention of 3% per annum',
      'Credit guarantee coverage',
      'Term loans up to Rs. 2 Crore'
    ],
    link: 'https://agriinfra.dac.gov.in/',
    icon: 'Building'
  }
];

export const schemeService = {
  getAllSchemes: async (): Promise<GovernmentScheme[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([..._schemes]), 500);
    });
  },
  getSchemesByCategory: async (category: 'Insurance' | 'Loan'): Promise<GovernmentScheme[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(_schemes.filter(s => s.category === category)), 500);
    });
  }
};
