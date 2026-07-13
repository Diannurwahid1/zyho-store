'use client'

import Image from 'next/image'
import React from 'react'

interface TestimonialData {
  id: string
  name: string
  role: string
  commentId: string
  commentEn: string
  rating: number
  avatar?: string
}

interface TestimonialsProps {
  language?: 'id' | 'en'
  testimonials?: TestimonialData[]
}

const testimonials: TestimonialData[] = [
  {
    id: '1',
    name: 'Deva Aqila',
    role: 'Mahasiswa',
    commentId: 'Pakai emot lebih dan ongis, gampang banget aksesnya dan harganya mantab banget!!!',
    commentEn: 'Super easy and affordable, access is really easy and the price is amazing!!!',
    rating: 5,
    avatar: '👨‍💼'
  },
  {
    id: '2',
    name: 'Devi Alia',
    role: 'Content Creator',
    commentId: 'Walaupun saya cuma punya sedikit, gampang banget banget pokoknya untuk membentuk konten.',
    commentEn: 'Although I only have a little, it\'s really easy to create content.',
    rating: 5,
    avatar: '👩‍💻'
  },
  {
    id: '3',
    name: 'Andi Prasetyo',
    role: 'Freelancer',
    commentId: 'Langsung punya Claude Pro tanpa perlu berlangganan bulanan dengan tarif mahal!',
    commentEn: 'Got Claude Pro instantly without needing expensive monthly subscription!',
    rating: 5,
    avatar: '🧑‍💼'
  },
  {
    id: '4',
    name: 'Sarah Wijaya',
    role: 'Digital Marketer',
    commentId: 'Sudah langsung bisa laporan laporan Midjourney untuk project client!',
    commentEn: 'Can instantly use Midjourney reports for client projects!',
    rating: 5,
    avatar: '👩‍🎨'
  }
]

export const Testimonials: React.FC<TestimonialsProps> = ({ 
  language = 'en',
  testimonials: realTestimonials
}) => {
  const isIndonesian = language === 'id'
  
  // Use real testimonials if provided, otherwise use hardcoded fallback
  const displayTestimonials = realTestimonials || testimonials

  return (
    <section className="border-t border-border bg-background px-4 py-7 md:py-10">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-5 max-w-3xl md:mb-8">
          <h2 className="mb-2 text-lg font-bold text-foreground md:text-2xl">
            {isIndonesian ? 'Apa Kata Mereka?' : 'What They Say?'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isIndonesian ? 'Dipercaya oleh ribuan pengguna dari berbagai kalangan.' : 'Trusted by thousands of users from various backgrounds.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:flex md:gap-6 md:overflow-x-auto md:pb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {displayTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="min-h-[210px] border border-border bg-card p-3.5 transition-colors hover:border-foreground/20 md:min-h-[280px] md:w-[380px] md:shrink-0 md:p-8"
            >
              <div>
                {/* Stars */}
                <div className="mb-2 flex gap-1 md:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 text-foreground md:h-5 md:w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Comment */}
                <p className="mb-4 text-[15px] font-medium leading-snug text-card-foreground md:mb-6 md:text-xl">
                  &quot;{isIndonesian ? testimonial.commentId : testimonial.commentEn}&quot;
                </p>
              </div>

              {/* Author */}
              <div className="mt-auto flex items-center gap-3 border-t border-border pt-4 md:pt-6">
                {testimonial.avatar && typeof testimonial.avatar === 'string' && (testimonial.avatar.includes('http') || testimonial.avatar.startsWith('/')) ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-800 shrink-0">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : testimonial.avatar ? (
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shrink-0">
                    {testimonial.avatar}
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-lg font-bold text-background">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-card-foreground md:text-base">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground md:text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
