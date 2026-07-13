export type Language = 'id' | 'en'

export const translations = {
  hero: {
    badge: {
      id: '5 PRODUK • AKSES • AKSES',
      en: '5 PRODUCTS • FAST • ACCESS'
    },
    title: {
      id: 'AI Digital Products',
      en: 'AI Digital Products'
    },
    subtitle: {
      id: 'Instant Access',
      en: 'Instant Access'
    },
    highlight: {
      id: 'for Smarter You.',
      en: 'for Smarter You.'
    },
    description: {
      id: 'Dapatkan akses instan ke berbagai AI premium seperti ChatGPT Plus, Claude Pro, Midjourney, dan lainnya. Akses, cukup, dan terpercaya.',
      en: 'Get instant access to various premium AI like ChatGPT Plus, Claude Pro, Midjourney, and more. Access, affordable, and trusted.'
    },
    cta: {
      id: 'Mulai Beli',
      en: 'Shop Now'
    },
    ctaSecondary: {
      id: 'Pelajari Produk',
      en: 'View Products'
    }
  },
  features: {
    instantDelivery: {
      title: {
        id: 'Instant Delivery',
        en: 'Instant Delivery'
      },
      description: {
        id: 'Akses langsung setelah pembayaran',
        en: 'Direct access after payment'
      }
    },
    premiumQuality: {
      title: {
        id: 'Premium Quality',
        en: 'Premium Quality'
      },
      description: {
        id: 'Produk original dan terpercaya',
        en: 'Original and trusted products'
      }
    },
    securePayment: {
      title: {
        id: 'Secure Payment',
        en: 'Secure Payment'
      },
      description: {
        id: 'Pembayaran aman & terjamin',
        en: 'Safe & guaranteed payment'
      }
    },
    support: {
      title: {
        id: '24/7 Support',
        en: '24/7 Support'
      },
      description: {
        id: 'Siap membantu kapan saja',
        en: 'Ready to help anytime'
      }
    }
  },
  products: {
    title: {
      id: 'Produk AI Premium Pilihan',
      en: 'Featured Premium AI Products'
    },
    tabs: {
      all: { id: 'All Products', en: 'All Products' },
      popular: { id: 'Popular', en: 'Popular' },
      chatgpt: { id: 'ChatGPT', en: 'ChatGPT' },
      claude: { id: 'Claude AI', en: 'Claude AI' },
      image: { id: 'Image AI', en: 'Image AI' },
      other: { id: 'Other AI', en: 'Other AI' }
    },
    viewAll: {
      id: 'Lihat Semua Produk',
      en: 'View All Products'
    }
  },
  trust: {
    title: {
      id: 'Dipercaya oleh 10,000+ Pengguna',
      en: 'Trusted by 10,000+ Users'
    },
    subtitle: {
      id: 'Bergabung dengan ribuan pengguna yang telah merasakan kemudahan akses AI premium kami.',
      en: 'Join thousands of users who have experienced our premium AI access.'
    }
  },
  testimonials: {
    title: {
      id: 'Apa Kata Mereka?',
      en: 'What They Say?'
    }
  }
}

export function t(lang: Language, key: string): string {
  const keys = key.split('.')
  let value: any = translations
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value?.[lang] || value?.en || key
}
