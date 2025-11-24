'use client'

import Link from 'next/link'
import { Mail, Users, TrendingUp, Gift, ArrowRight } from 'lucide-react'

export default function PartnerProgramPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eae4df' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 mb-6">
            <span className="text-sm font-medium" style={{ color: '#851A1B' }}>JOIN NOW - LIMITED TIME OFFER</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-4" style={{ color: '#851A1B' }}>
            Partner Program
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Join WhySoCheap's Partner Program and earn commissions by referring our amazing products! 
              We're looking for young, ambitious individuals who are passionate about fashion and eager to grow with us.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white border border-gray-300 p-10 mb-12">
          <h2 className="text-2xl font-light mb-10" style={{ color: '#851A1B' }}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 border border-gray-300 rounded-sm flex items-center justify-center font-light text-gray-900 text-xl bg-white">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2" style={{ color: '#851A1B' }}>Get Your Unique Code</h3>
                  <p className="text-gray-600">
                    Once approved, you'll receive your unique referral code to share with your audience.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 border border-gray-300 rounded-sm flex items-center justify-center font-light text-gray-900 text-xl bg-white">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2" style={{ color: '#851A1B' }}>Share & Promote</h3>
                  <p className="text-gray-600">
                    Share WhySoCheap products with your friends, family, social media followers, or any community you're part of.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 border border-gray-300 rounded-sm flex items-center justify-center font-light text-gray-900 text-xl bg-white">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2" style={{ color: '#851A1B' }}>Earn Commissions</h3>
                  <p className="text-gray-600">
                    Earn a competitive commission on every sale made through your unique referral code. (Commissions range from 10% to 20% depending on the product.)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 border border-gray-300 rounded-sm flex items-center justify-center font-light text-gray-900 text-xl bg-white">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2" style={{ color: '#851A1B' }}>Grow Together</h3>
                  <p className="text-gray-600">
                    Gain access to exclusive promotions, early product releases, and be part of a growing community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white border border-gray-300 p-10 mb-12">
          <h2 className="text-2xl font-light mb-10 flex items-center gap-3" style={{ color: '#851A1B' }}>
            <Gift className="w-6 h-6" style={{ color: '#851A1B' }} />
            Why Partner With Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-medium mb-2" style={{ color: '#851A1B' }}>Competitive Commissions</h3>
              <p className="text-gray-600 text-sm">
                Earn commissions for every successful referral
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-2" style={{ color: '#851A1B' }}>Exclusive Access</h3>
              <p className="text-gray-600 text-sm">
                Be the first to access new releases, limited-edition drops, and special promotions
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-2" style={{ color: '#851A1B' }}>Supportive Community</h3>
              <p className="text-gray-600 text-sm">
                Join a network of like-minded entrepreneurs and creators
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white border border-gray-300 p-12 text-center">
          <h2 className="text-3xl font-light mb-4" style={{ color: '#851A1B' }}>
            Ready to Partner With Us?
          </h2>
          <p className="text-lg mb-8 text-gray-700 max-w-2xl mx-auto">
            If you're ready to collaborate with a dynamic brand and earn through referrals, we want to hear from you!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Contact Us to Join - Limited Time Offer
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>

        {/* Back Link */}
        <div className="text-center mt-12">
          <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
