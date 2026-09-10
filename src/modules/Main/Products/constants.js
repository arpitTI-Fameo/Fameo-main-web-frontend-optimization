// modules/Products/constants.js

import { PRODUCTS } from '@/constants/mockData';

export const BESTSELLERS = PRODUCTS.filter((p) =>
  ['Bestseller', 'Pro', 'New'].includes(p.tag)
);
