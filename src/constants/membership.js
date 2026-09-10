// // // constants/membership.js
// // // Fameo membership tiers — single source of truth

// // export const PLANS = [
// //   {
// //     id:             'pro',
// //     name:           'Pro',
// //     icon:           '○',
// //     color:          '#9898a8',
// //     price_monthly:  0,
// //     price_yearly:   0,
// //     discountRate:   0,
// //     discountLabel:  '0%',
// //     features: [
// //       'Access to creator community',
// //       'Browse all products',
// //       'Basic talent hire access',
// //       'Standard shipping rates',
// //     ],
// //     notIncluded: [
// //       'Product discounts',
// //       'Priority support',
// //       'Exclusive resources',
// //     ],
// //   },
// //   {
// //     id:             'elite',
// //     name:           'Elite',
// //     icon:           '✦',
// //     color:          '#d4a0c0',
// //     price_monthly:  999,
// //     price_yearly:   9999,
// //     discountRate:   0.02,
// //     discountLabel:  '2%',
// //     popular:        false,
// //     features: [
// //       '2% discount on all products',
// //       'Priority community access',
// //       'Exclusive creator resources',
// //       'Free shipping on orders above ₹5,000',
// //       'Priority support',
// //     ],
// //     notIncluded: [
// //       'Higher product discounts',
// //     ],
// //   },
// //   {
// //     id:             'premium',
// //     name:           'Premium',
// //     icon:           '◈',
// //     color:          '#e8457a',
// //     price_monthly:  1999,
// //     price_yearly:   19999,
// //     discountRate:   0.05,
// //     discountLabel:  '5%',
// //     popular:        true,
// //     features: [
// //       '5% discount on all products',
// //       'Priority community access',
// //       'All exclusive creator resources',
// //       'Free shipping on all orders',
// //       'Dedicated support',
// //       'Early access to new products',
// //       'Featured creator profile',
// //     ],
// //     notIncluded: [],
// //   },
// // ];

// // export const PLAN_DISCOUNTS = {
// //   pro:    0,
// //   elite:   0.02,
// //   premium: 0.05,
// // };

// // export const PLAN_COLORS = {
// //   pro:    '#9898a8',
// //   elite:   '#d4a0c0',
// //   premium: '#e8457a',
// // };

// // export const PLAN_ICONS = {
// //   pro:    '○',
// //   elite:   '✦',
// //   premium: '◈',
// // };



// // constants/membership.js
// // Exact same plans as app backend
// // FREE (id:1) | PRO (id:2) | POPULAR (id:3) | ELITE (id:4)

// export const PLANS = [
//   {
//     id:            'free',
//     appPlanId:     1,
//     appPlanCode:   'FREE',
//     name:          'Free',
//     icon:          '○',
//     color:         '#9898a8',
//     price_monthly: 0,
//     billingId_1m:  null,
//     discountRate:  0,
//     discountLabel: '0%',
//     features: [
//       'Access to homepage & resources',
//       'Basic community browsing',
//       '20 swipes per day',
//       'Standard messaging (50/day)',
//     ],
//     notIncluded: [
//       'Product store access',
//       'Community posting',
//       'Talent hire access',
//       'Product discounts',
//     ],
//   },
//   {
//     id:            'pro',
//     appPlanId:     2,
//     appPlanCode:   'PRO',
//     name:          'Pro',
//     icon:          '✦',
//     color:         '#7c9ec9',
//     price_monthly: 799,
//     billingId_1m:  3,
//     billingId_3m:  2,
//     billingId_6m:  1,
//     discountRate:  0,
//     discountLabel: '0%',
//     popular:       false,
//     features: [
//       'Full store & community access',
//       'Talent hire access',
//       'Unlimited swipes',
//       'See who viewed you (up to 5)',
//       'Rewind last swipe',
//       '1 weekly boost',
//       'Unlimited messaging',
//     ],
//     notIncluded: [
//       'Product discounts',
//       'Priority likes',
//       'Voice & video chat',
//     ],
//   },
//   {
//     id:            'popular',
//     appPlanId:     3,
//     appPlanCode:   'POPULAR',
//     name:          'Popular',
//     icon:          '◈',
//     color:         '#d4a0c0',
//     price_monthly: 1599,
//     billingId_1m:  6,
//     billingId_3m:  5,
//     billingId_6m:  4,
//     discountRate:  0.02,
//     discountLabel: '2%',
//     popular:       true,
//     features: [
//       'Everything in Pro',
//       '2% discount on all products',
//       'See who liked you',
//       'Unlimited rewinds',
//       '15 monthly boosts',
//       'Priority likes',
//       'Voice & video chat (2 min)',
//       'Incognito mode',
//     ],
//     notIncluded: [
//       '5% product discount',
//       'Direct message without match',
//       'Ghost & travel mode',
//     ],
//   },
//   {
//     id:            'elite',
//     appPlanId:     4,
//     appPlanCode:   'ELITE',
//     name:          'Elite',
//     icon:          '★',
//     color:         '#e8457a',
//     price_monthly: 3199,
//     billingId_1m:  9,
//     billingId_3m:  8,
//     billingId_6m:  7,
//     discountRate:  0.05,
//     discountLabel: '5%',
//     popular:       false,
//     features: [
//       'Everything in Popular',
//       '5% discount on all products',
//       'Unlimited superlikes',
//       'Unlimited monthly boosts',
//       'Direct message without match',
//       'Ghost mode & travel mode',
//       'Voice chat (5 min)',
//       'Premium collab access',
//       'Advanced insights',
//       'Priority support & VIP events',
//     ],
//     notIncluded: [],
//   },
// ];

// // Fameo membership tiers mapped from app plan codes
// // FREE/PRO → no product discount | POPULAR → 2% | ELITE → 5%
// export const PLAN_DISCOUNTS = {
//   free:    0,
//   pro:     0,
//   popular: 0.02,
//   elite:   0.05,
// };

// export const PLAN_COLORS = {
//   free:    '#9898a8',
//   pro:     '#7c9ec9',
//   popular: '#d4a0c0',
//   elite:   '#e8457a',
// };

// export const PLAN_ICONS = {
//   free:    '○',
//   pro:     '✦',
//   popular: '◈',
//   elite:   '★',
// };


// constants/membership.js
// Exact same plans as app backend
// FREE (id:1) | PRO (id:2) | POPULAR (id:3) | ELITE (id:4)

export const PLANS = [
  // {
  //   id:            'free',
  //   appPlanId:     1,
  //   appPlanCode:   'FREE',
  //   name:          'Free',
  //   icon:          '○',
  //   color:         '#9898a8',
  //   price_monthly: 0,
  //   billingId_1m:  null,
  //   discountRate:  0,
  //   discountLabel: '0%',
  //   features: [
  //     'Access to homepage & resources',
  //     'Basic community browsing',
  //     '20 swipes per day',
  //     'Standard messaging (50/day)',
  //   ],
  //   notIncluded: [
  //     'Product store access',
  //     'Community posting',
  //     'Talent hire access',
  //     'Product discounts',
  //   ],
  // },
  // {
  //   id:            'pro',
  //   appPlanId:     2,
  //   appPlanCode:   'PRO',
  //   name:          'Pro',
  //   icon:          '✦',
  //   color:         '#7c9ec9',
  //   price_monthly: 799,
  //   billingId_1m:  3,
  //   billingId_3m:  2,
  //   billingId_6m:  1,
  //   discountRate:  0,
  //   discountLabel: '0%',
  //   popular:       false,
  //   features: [
  //     'Full store & community access',
  //     'Talent hire access',
  //     'Unlimited swipes',
  //     'See who viewed you (up to 5)',
  //     'Rewind last swipe',
  //     '1 weekly boost',
  //     'Unlimited messaging',
  //   ],
  //   notIncluded: [
  //     'Product discounts',
  //     'Priority likes',
  //     'Voice & video chat',
  //   ],
  // },
  {
    id:            'popular',
    appPlanId:     3,
    appPlanCode:   'POPULAR',
    name:          'Popular',
    icon:          '◈',
    color:         '#d4a0c0',
    price_monthly: 1599,
    billingId_1m:  6,
    billingId_3m:  5,
    billingId_6m:  4,
    discountRate:  0.02,
    discountLabel: '2%',
    popular:       true,
    features: [
      'Everything in Pro',
      '2% discount on all products',
      'See who liked you',
      'Unlimited rewinds',
      '15 monthly boosts',
      'Priority likes',
      'Voice & video chat (2 min)',
      'Incognito mode',
    ],
    notIncluded: [
      '5% product discount',
      'Direct message without match',
      'Ghost & travel mode',
    ],
  },
  {
    id:            'elite',
    appPlanId:     4,
    appPlanCode:   'ELITE',
    name:          'Elite',
    icon:          '★',
    color:         '#e8457a',
    price_monthly: 3199,
    billingId_1m:  9,
    billingId_3m:  8,
    billingId_6m:  7,
    discountRate:  0.05,
    discountLabel: '5%',
    popular:       false,
    features: [
      'Everything in Popular',
      '5% discount on all products',
      'Unlimited superlikes',
      'Unlimited monthly boosts',
      'Direct message without match',
      'Ghost mode & travel mode',
      'Voice chat (5 min)',
      'Premium collab access',
      'Advanced insights',
      'Priority support & VIP events',
    ],
    notIncluded: [],
  },
];

// Fameo membership tiers mapped from app plan codes
// FREE/PRO → no product discount | POPULAR → 2% | ELITE → 5%
export const PLAN_DISCOUNTS = {
  // free:    0,     // no discount
  // pro:     0,     // no discount — login access only
  popular: 0.02,  // 2% off all products
  elite:   0.05,  // 5% off all products
};

export const PLAN_COLORS = {
  // free:    '#9898a8',
  // pro:     '#7c9ec9',
  popular: '#d4a0c0',
  elite:   '#e8457a',
};

export const PLAN_ICONS = {
  // free:    '○',
  // pro:     '✦',
  popular: '◈',
  elite:   '★',
};