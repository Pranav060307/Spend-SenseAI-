import { Transaction } from '../types';

export interface DatasetPreset {
  id: string;
  name: string;
  industry: string;
  currency: 'INR' | 'USD';
  description: string;
  transactions: Transaction[];
}

// Helper to generate realistic dates in past 90 days
const getDateDaysAgo = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

// Preset 1: OmniRetail India (Electronics & Gadgets)
const OMNI_CUSTOMERS = [
  { id: 'CUST-1001', name: 'Aarav Sharma', email: 'aarav.sharma@example.com' },
  { id: 'CUST-1002', name: 'Priya Patel', email: 'priya.patel@example.com' },
  { id: 'CUST-1003', name: 'Rohan Deshmukh', email: 'rohan.d@example.com' },
  { id: 'CUST-1004', name: 'Ananya Iyer', email: 'ananya.iyer@example.com' },
  { id: 'CUST-1005', name: 'Vikram Joshi', email: 'v.joshi@example.com' },
  { id: 'CUST-1006', name: 'Sneha Kulkarni', email: 'sneha.k@example.com' },
  { id: 'CUST-1007', name: 'Kabir Verma', email: 'kabir.v@example.com' },
  { id: 'CUST-1008', name: 'Neha Gupta', email: 'neha.gupta@example.com' },
  { id: 'CUST-1009', name: 'Aditya Nair', email: 'aditya.n@example.com' },
  { id: 'CUST-1010', name: 'Pooja Reddy', email: 'pooja.r@example.com' },
  { id: 'CUST-1011', name: 'Karan Mehra', email: 'karan.m@example.com' },
  { id: 'CUST-1012', name: 'Ritu Sen', email: 'ritu.sen@example.com' },
  { id: 'CUST-1013', name: 'Siddharth Rao', email: 'sid.rao@example.com' },
  { id: 'CUST-1014', name: 'Tanvi Bhosale', email: 'tanvi.b@example.com' },
  { id: 'CUST-1015', name: 'Amitabh Sen', email: 'amitabh.s@example.com' },
  { id: 'CUST-1016', name: 'Divya Agarwal', email: 'divya.a@example.com' },
  { id: 'CUST-1017', name: 'Manish Chawla', email: 'manish.c@example.com' },
  { id: 'CUST-1018', name: 'Isha Singhania', email: 'isha.s@example.com' },
  { id: 'CUST-1019', name: 'Harsh Vardhan', email: 'harsh.v@example.com' },
  { id: 'CUST-1020', name: 'Shreya Roy', email: 'shreya.roy@example.com' },
  { id: 'CUST-1021', name: 'Gaurav Dubey', email: 'gaurav.d@example.com' },
  { id: 'CUST-1022', name: 'Kavita Menon', email: 'kavita.m@example.com' },
  { id: 'CUST-1023', name: 'Nikhil Patil', email: 'nikhil.p@example.com' },
  { id: 'CUST-1024', name: 'Simran Walia', email: 'simran.w@example.com' },
  { id: 'CUST-1025', name: 'Tarun Saxena', email: 'tarun.s@example.com' },
];

const ELECTRONICS_PRODUCTS = [
  { name: 'Noise-Canceling Wireless Headphones', category: 'Audio & Headphones', price: 8499 },
  { name: 'BassPro Bluetooth Earbuds', category: 'Audio & Headphones', price: 2999 },
  { name: 'Smart Fitness Tracker Gen-4', category: 'Smart Wearables', price: 4499 },
  { name: 'Amoled Pro Smartwatch', category: 'Smart Wearables', price: 11999 },
  { name: 'Fast 65W GaN Charger & Cable Set', category: 'Mobile Accessories', price: 1899 },
  { name: 'MagSafe Wireless PowerBank 10000mAh', category: 'Mobile Accessories', price: 2499 },
  { name: 'Ergonomic Mechanical Keyboard RGB', category: 'Computing & Office', price: 6299 },
  { name: 'Precision Wireless Vertical Mouse', category: 'Computing & Office', price: 3199 },
  { name: '4K Ultra-HD Webcam with Dual Mic', category: 'Computing & Office', price: 5499 },
  { name: 'Smart WiFi Ambient Light Bar 2-Pack', category: 'Smart Home', price: 3899 },
  { name: 'Smart Security Cam 360 Night Vision', category: 'Smart Home', price: 2799 },
];

function generateOmniRetailTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  let orderCounter = 5001;

  // 1. Champions (Recent, Frequent, High Spend)
  const champions = [OMNI_CUSTOMERS[0], OMNI_CUSTOMERS[1], OMNI_CUSTOMERS[2], OMNI_CUSTOMERS[12]];
  champions.forEach((cust) => {
    // 4 to 6 purchases in past 60 days, recent purchase 2-7 days ago
    const purchaseCount = 5;
    for (let i = 0; i < purchaseCount; i++) {
      const daysAgo = Math.floor(Math.random() * 12) + (i * 12) + 2;
      const product = ELECTRONICS_PRODUCTS[Math.floor(Math.random() * ELECTRONICS_PRODUCTS.length)];
      transactions.push({
        order_id: `ORD-${orderCounter++}`,
        customer_id: cust.id,
        customer_name: cust.name,
        customer_email: cust.email,
        purchase_date: getDateDaysAgo(daysAgo),
        product_category: product.category,
        product_name: product.name,
        order_value: product.price + (Math.random() > 0.5 ? 1200 : 0),
        payment_method: Math.random() > 0.3 ? 'UPI' : 'Credit Card',
        channel: 'Online',
      });
    }
  });

  // 2. Loyal Customers (Regular spenders, good frequency)
  const loyal = [OMNI_CUSTOMERS[3], OMNI_CUSTOMERS[4], OMNI_CUSTOMERS[5], OMNI_CUSTOMERS[13], OMNI_CUSTOMERS[14]];
  loyal.forEach((cust) => {
    const purchaseCount = 3;
    for (let i = 0; i < purchaseCount; i++) {
      const daysAgo = Math.floor(Math.random() * 18) + (i * 22) + 8;
      const product = ELECTRONICS_PRODUCTS[Math.floor(Math.random() * ELECTRONICS_PRODUCTS.length)];
      transactions.push({
        order_id: `ORD-${orderCounter++}`,
        customer_id: cust.id,
        customer_name: cust.name,
        customer_email: cust.email,
        purchase_date: getDateDaysAgo(daysAgo),
        product_category: product.category,
        product_name: product.name,
        order_value: product.price,
        payment_method: 'UPI',
        channel: 'Online',
      });
    }
  });

  // 3. Potential Loyalists / New High Spenders (Bought recently, 1-2 orders, high ticket)
  const potential = [OMNI_CUSTOMERS[6], OMNI_CUSTOMERS[7], OMNI_CUSTOMERS[8], OMNI_CUSTOMERS[15], OMNI_CUSTOMERS[16]];
  potential.forEach((cust) => {
    const daysAgo = Math.floor(Math.random() * 14) + 1;
    const premiumProduct = ELECTRONICS_PRODUCTS[3]; // Amoled Pro Smartwatch
    transactions.push({
      order_id: `ORD-${orderCounter++}`,
      customer_id: cust.id,
      customer_name: cust.name,
      customer_email: cust.email,
      purchase_date: getDateDaysAgo(daysAgo),
      product_category: premiumProduct.category,
      product_name: premiumProduct.name,
      order_value: premiumProduct.price,
      payment_method: 'Credit Card',
      channel: 'App',
    });
    // some made a second purchase
    if (Math.random() > 0.4) {
      const p2 = ELECTRONICS_PRODUCTS[4];
      transactions.push({
        order_id: `ORD-${orderCounter++}`,
        customer_id: cust.id,
        customer_name: cust.name,
        customer_email: cust.email,
        purchase_date: getDateDaysAgo(daysAgo + 6),
        product_category: p2.category,
        product_name: p2.name,
        order_value: p2.price,
        payment_method: 'UPI',
        channel: 'App',
      });
    }
  });

  // 4. At-Risk Customers (Bought 2-3 times earlier, but no purchase in past 45-75 days)
  const atRisk = [OMNI_CUSTOMERS[9], OMNI_CUSTOMERS[10], OMNI_CUSTOMERS[11], OMNI_CUSTOMERS[17], OMNI_CUSTOMERS[18]];
  atRisk.forEach((cust) => {
    const purchaseCount = 3;
    for (let i = 0; i < purchaseCount; i++) {
      const daysAgo = 48 + (i * 14) + Math.floor(Math.random() * 6);
      const product = ELECTRONICS_PRODUCTS[i % ELECTRONICS_PRODUCTS.length];
      transactions.push({
        order_id: `ORD-${orderCounter++}`,
        customer_id: cust.id,
        customer_name: cust.name,
        customer_email: cust.email,
        purchase_date: getDateDaysAgo(daysAgo),
        product_category: product.category,
        product_name: product.name,
        order_value: product.price,
        payment_method: 'Debit Card',
        channel: 'In-Store',
      });
    }
  });

  // 5. Inactive / Churned (Single or double small purchase 75-90+ days ago)
  const inactive = [
    OMNI_CUSTOMERS[19],
    OMNI_CUSTOMERS[20],
    OMNI_CUSTOMERS[21],
    OMNI_CUSTOMERS[22],
    OMNI_CUSTOMERS[23],
    OMNI_CUSTOMERS[24],
  ];
  inactive.forEach((cust) => {
    const daysAgo = 78 + Math.floor(Math.random() * 12);
    const product = ELECTRONICS_PRODUCTS[1]; // Earbuds
    transactions.push({
      order_id: `ORD-${orderCounter++}`,
      customer_id: cust.id,
      customer_name: cust.name,
      customer_email: cust.email,
      purchase_date: getDateDaysAgo(daysAgo),
      product_category: product.category,
      product_name: product.name,
      order_value: product.price,
      payment_method: 'Net Banking',
      channel: 'Online',
    });
  });

  // Add 40 additional realistic background orders to give rich statistical depth
  for (let k = 0; k < 45; k++) {
    const custIndex = Math.floor(Math.random() * OMNI_CUSTOMERS.length);
    const cust = OMNI_CUSTOMERS[custIndex];
    const daysAgo = Math.floor(Math.random() * 85) + 1;
    const prod = ELECTRONICS_PRODUCTS[Math.floor(Math.random() * ELECTRONICS_PRODUCTS.length)];
    transactions.push({
      order_id: `ORD-${orderCounter++}`,
      customer_id: cust.id,
      customer_name: cust.name,
      customer_email: cust.email,
      purchase_date: getDateDaysAgo(daysAgo),
      product_category: prod.category,
      product_name: prod.name,
      order_value: prod.price,
      payment_method: Math.random() > 0.4 ? 'UPI' : 'Credit Card',
      channel: Math.random() > 0.3 ? 'Online' : 'App',
    });
  }

  // Sort by date ascending
  return transactions.sort((a, b) => (a.purchase_date > b.purchase_date ? 1 : -1));
}

// Preset 2: UrbanAura Fashion & Apparel
function generateFashionTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  let orderCounter = 8001;
  const categories = ['Ethnic Wear', 'Western Casuals', 'Footwear', 'Accessories', 'Formal Wear'];
  const items = [
    { name: 'Pure Silk Festive Kurta Set', category: 'Ethnic Wear', price: 4299 },
    { name: 'Embroidered Anarkali Gown', category: 'Ethnic Wear', price: 6899 },
    { name: 'Slim-Fit Linen Casual Shirt', category: 'Western Casuals', price: 1899 },
    { name: 'Classic Indigo Denim Jacket', category: 'Western Casuals', price: 3199 },
    { name: 'Italian Leather Chelsea Boots', category: 'Footwear', price: 5499 },
    { name: 'Urban Comfort Daily Sneakers', category: 'Footwear', price: 2799 },
    { name: 'Full-Grain Leather Bi-Fold Wallet', category: 'Accessories', price: 1299 },
    { name: 'Designer Polarized Sunglasses', category: 'Accessories', price: 2999 },
  ];

  for (let i = 1; i <= 28; i++) {
    const custId = `FASH-${2000 + i}`;
    const custName = `Customer ${i}`;
    const purchaseCount = (i % 5 === 0) ? 5 : (i % 3 === 0) ? 3 : (i % 2 === 0) ? 2 : 1;
    
    for (let p = 0; p < purchaseCount; p++) {
      const daysAgo = (i % 4 === 0) ? (50 + p * 15) : Math.floor(Math.random() * 70) + 2;
      const item = items[(i + p) % items.length];
      transactions.push({
        order_id: `ORD-${orderCounter++}`,
        customer_id: custId,
        customer_name: custName,
        customer_email: `customer${i}@urbanaura.in`,
        purchase_date: getDateDaysAgo(daysAgo),
        product_category: item.category,
        product_name: item.name,
        order_value: item.price,
        payment_method: 'UPI',
        channel: 'Online',
      });
    }
  }

  return transactions.sort((a, b) => (a.purchase_date > b.purchase_date ? 1 : -1));
}

export const DATASET_PRESETS: DatasetPreset[] = [
  {
    id: 'omni_retail_india',
    name: 'OmniRetail India (Electronics & Gadgets)',
    industry: 'Consumer Tech & Electronics',
    currency: 'INR',
    description: '100+ transactions across 25 distinct customer profiles with clear RFM segmentation, high-value repeat buyers, declining at-risk cohorts, and cross-category tech bundles.',
    transactions: generateOmniRetailTransactions(),
  },
  {
    id: 'urbanaura_fashion',
    name: 'UrbanAura D2C Fashion (Apparel & Accessories)',
    industry: 'Apparel & Lifestyle',
    currency: 'INR',
    description: 'Curated apparel & accessories orders highlighting festive seasonal spikes, high AOV repeat ethnic wear shoppers, and single-purchase discount seekers.',
    transactions: generateFashionTransactions(),
  },
];
