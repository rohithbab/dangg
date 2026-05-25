/** User IDs that render the female profile layout (Stitch export). */
export const FEMALE_USER_IDS = new Set(['USR-2045', 'USR-2046']);

export const MOCK_USERS = [
  {
    id: 'USR-1029',
    name: 'James Sullivan',
    email: 'james.s@example.com',
    initials: 'JS',
    avatarVariant: 'secondary',
    gender: 'male',
    joinDate: '12 Oct 2023',
    age: 32,
    phone: '+91 98765 43210',
    lastActive: '2 mins ago',
    status: 'Active',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxjsUSJK0qXzDF8PYcPVHrtNAk4Ek7jpom2waWGSs2OGneDUdqNe85iB_LFswE4JRP43tkfR5hv2ehrlbttNrF_rAScSbz3_AfSwWzMdULtvbhENqWmQ1v-5OONr-N2ap5fd-Q31eW3bQMgISDctI3OtJ40SXAR67zW19SanSksu9mtWOKHFQD0YbmuSTav5GfJ7cVTGN7kGAy9Zn_NHx7ZbVBIEFcAs8PHzIApyNeVW0fk3rVoVzBxWXwxCKQ8pZpnVVUaprkRaQ',
    financialStats: [
      { label: 'Current Balance', value: '₹ 4,250.00', icon: 'account_balance', accent: 'primary', trend: '+2.4%' },
      { label: 'Coins Purchased', value: '12,500', icon: 'shopping_bag', accent: 'secondary' },
      { label: 'Coins Spent', value: '8,250', icon: 'payments', accent: 'tertiary' },
      { label: 'Total Spent (INR)', value: '₹ 14,800', icon: 'currency_rupee', accent: 'neutral' },
      { label: 'Purchase Count', value: '42', icon: 'receipt_long', accent: 'neutral' },
      { label: 'Favourites', value: '15', icon: 'favorite', accent: 'accent' },
    ],
    chatMetrics: [
      { label: 'Total Chats', value: '156', icon: 'forum' },
      { label: 'Total Duration', value: '4h 20m', icon: 'schedule' },
    ],
    transactions: [
      { id: 'TRX-99210', item: '500 Coins Pack', amount: '₹ 499.00', date: 'Mar 05, 14:20', status: 'Success' },
      { id: 'TRX-99185', item: '200 Coins Pack', amount: '₹ 199.00', date: 'Mar 02, 09:15', status: 'Success' },
    ]
  },
  {
    id: 'USR-2045',
    name: 'Elena Martinez',
    email: 'elena.m@example.com',
    initials: 'EM',
    avatarVariant: 'tertiary',
    gender: 'female',
    joinDate: '08 Nov 2023',
    age: 28,
    phone: '+1 555-0199',
    lastActive: '2 mins ago',
    status: 'Verified',
    onlineStatus: 'active',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABAusYRpvnVcV2_3AF-9D9s63euMikz6gxN9lSSKreK98RR-_CESFkBenKJ22Uvy9X_am0lIF2PQSn0eQu3ue-83MNJc3u66ulJCKUkg7eqhMgKk_wLJTC1_1rSGZh-yhzjC3Qz9B6oDTca8iPxlMQVZAKo8XJ4k1EnL5sID-1nPlEuBS3H-v04z0fKYW8Rdp-zBJT97KN0XoDDNbgJyxnlUO6rUkfjEX7yvVQWbWS3G_-F9mdGBAlEG13BGTUEd_509na54Ns070',
    earnings: [
      { label: 'Total', value: 1250000 },
      { label: 'Available', value: 324000, variant: 'accent' },
      { label: 'Pending', value: 85000, valueTone: 'tertiary' },
      { label: 'Claimed', value: 841000, valueTone: 'muted' },
      { label: "Today's Earnings", value: 24500, variant: 'highlight', badge: '+12% vs avg' },
    ],
    ratings: [
      { icon: 'star', value: '4.8/5', label: 'Rating (124)', fill: true },
      { icon: 'thumb_up', value: '1,052', label: 'Total Likes' },
      { icon: 'thumb_down', value: '12', label: 'Dislikes' },
      { icon: 'favorite', value: '458', label: 'Favorited By', fill: true },
    ],
    chatMetrics: {
      totalChats: '3,842',
      duration: '142h 15m'
    },
    transactions: [
      { id: 'TRX-77420', item: 'Chat Earning - Harmony', amount: 45000, date: 'May 20, 18:45', status: 'Settled' },
      { id: 'TRX-77415', item: 'Call Earning - Voice', amount: 120000, date: 'May 19, 14:20', status: 'Settled' },
    ]
  },
  {
    id: 'USR-3001',
    name: 'Robert Brown',
    email: 'rbrown@example.com',
    initials: 'RB',
    avatarVariant: 'primary',
    gender: 'male',
    joinDate: '15 Nov 2023',
    age: 45,
    phone: '+1 555-0142',
    lastActive: '10 mins ago',
    status: 'Premium',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxjsUSJK0qXzDF8PYcPVHrtNAk4Ek7jpom2waWGSs2OGneDUdqNe85iB_LFswE4JRP43tkfR5hv2ehrlbttNrF_rAScSbz3_AfSwWzMdULtvbhENqWmQ1v-5OONr-N2ap5fd-Q31eW3bQMgISDctI3OtJ40SXAR67zW19SanSksu9mtWOKHFQD0YbmuSTav5GfJ7cVTGN7kGAy9Zn_NHx7ZbVBIEFcAs8PHzIApyNeVW0fk3rVoVzBxWXwxCKQ8pZpnVVUaprkRaQ',
    financialStats: [
      { label: 'Current Balance', value: '₹ 1,500.00', icon: 'account_balance', accent: 'primary', trend: '+1.0%' },
      { label: 'Coins Purchased', value: '5,000', icon: 'shopping_bag', accent: 'secondary' },
      { label: 'Coins Spent', value: '3,500', icon: 'payments', accent: 'tertiary' },
      { label: 'Total Spent (INR)', value: '₹ 6,000', icon: 'currency_rupee', accent: 'neutral' },
      { label: 'Purchase Count', value: '18', icon: 'receipt_long', accent: 'neutral' },
      { label: 'Favourites', value: '4', icon: 'favorite', accent: 'accent' },
    ],
    chatMetrics: [
      { label: 'Total Chats', value: '48', icon: 'forum' },
      { label: 'Total Duration', value: '1h 15m', icon: 'schedule' },
    ],
    transactions: [
      { id: 'TRX-88120', item: '100 Coins Pack', amount: '₹ 99.00', date: 'Mar 01, 10:10', status: 'Success' },
    ]
  },
  {
    id: 'USR-2046',
    name: 'Sarah Al-Farsi',
    email: 'sarah.af@example.com',
    initials: 'SA',
    avatarVariant: 'accent',
    gender: 'female',
    joinDate: '20 Nov 2023',
    age: 31,
    phone: '+966 50 123 4567',
    lastActive: '5 mins ago',
    status: 'Suspended',
    onlineStatus: 'busy',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABAusYRpvnVcV2_3AF-9D9s63euMikz6gxN9lSSKreK98RR-_CESFkBenKJ22Uvy9X_am0lIF2PQSn0eQu3ue-83MNJc3u66ulJCKUkg7eqhMgKk_wLJTC1_1rSGZh-yhzjC3Qz9B6oDTca8iPxlMQVZAKo8XJ4k1EnL5sID-1nPlEuBS3H-v04z0fKYW8Rdp-zBJT97KN0XoDDNbgJyxnlUO6rUkfjEX7yvVQWbWS3G_-F9mdGBAlEG13BGTUEd_509na54Ns070',
    earnings: [
      { label: 'Total', value: 892000 },
      { label: 'Available', value: 145000, variant: 'accent' },
      { label: 'Pending', value: 32000, valueTone: 'tertiary' },
      { label: 'Claimed', value: 715000, valueTone: 'muted' },
      { label: "Today's Earnings", value: 12000, variant: 'highlight', badge: '+5% vs avg' },
    ],
    ratings: [
      { icon: 'star', value: '4.6/5', label: 'Rating (92)', fill: true },
      { icon: 'thumb_up', value: '812', label: 'Total Likes' },
      { icon: 'thumb_down', value: '8', label: 'Dislikes' },
      { icon: 'favorite', value: '310', label: 'Favorited By', fill: true },
    ],
    chatMetrics: {
      totalChats: '2,110',
      duration: '84h 30m'
    }
  },
  {
    id: 'USR-3002',
    name: 'David Liao',
    email: 'dliao.dev@example.com',
    initials: 'DL',
    avatarVariant: 'error',
    gender: 'male',
    joinDate: '01 Dec 2023',
    age: 24,
    phone: '+886 912 345 678',
    lastActive: 'Just now',
    status: 'Offline',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxjsUSJK0qXzDF8PYcPVHrtNAk4Ek7jpom2waWGSs2OGneDUdqNe85iB_LFswE4JRP43tkfR5hv2ehrlbttNrF_rAScSbz3_AfSwWzMdULtvbhENqWmQ1v-5OONr-N2ap5fd-Q31eW3bQMgISDctI3OtJ40SXAR67zW19SanSksu9mtWOKHFQD0YbmuSTav5GfJ7cVTGN7kGAy9Zn_NHx7ZbVBIEFcAs8PHzIApyNeVW0fk3rVoVzBxWXwxCKQ8pZpnVVUaprkRaQ',
    financialStats: [
      { label: 'Current Balance', value: '₹ 8,900.00', icon: 'account_balance', accent: 'primary', trend: '+15.2%' },
      { label: 'Coins Purchased', value: '25,000', icon: 'shopping_bag', accent: 'secondary' },
      { label: 'Coins Spent', value: '16,100', icon: 'payments', accent: 'tertiary' },
      { label: 'Total Spent (INR)', value: '₹ 29,500', icon: 'currency_rupee', accent: 'neutral' },
      { label: 'Purchase Count', value: '98', icon: 'receipt_long', accent: 'neutral' },
      { label: 'Favourites', value: '34', icon: 'favorite', accent: 'accent' },
    ],
    chatMetrics: [
      { label: 'Total Chats', value: '412', icon: 'forum' },
      { label: 'Total Duration', value: '18h 40m', icon: 'schedule' },
    ],
    transactions: [
      { id: 'TRX-99450', item: '1000 Coins Pack', amount: '₹ 999.00', date: 'Mar 08, 18:45', status: 'Success' },
    ]
  }
];

export function getUserProfileMeta(userId) {
  const user = MOCK_USERS.find(u => u.id === userId);
  if (user) {
    return { profileHeader: user.gender, gender: user.gender };
  }
  if (FEMALE_USER_IDS.has(userId)) {
    return { profileHeader: 'female', gender: 'female' };
  }
  return { profileHeader: 'male', gender: 'male' };
}

export function isFemaleUserProfile(userId) {
  const user = MOCK_USERS.find(u => u.id === userId);
  if (user) {
    return user.gender === 'female';
  }
  return FEMALE_USER_IDS.has(userId);
}

export function getUserById(userId) {
  return MOCK_USERS.find(u => u.id === userId);
}
