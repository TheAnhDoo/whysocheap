'use client'

import Link from 'next/link'
import { Mail, Users, TrendingUp, Gift, ArrowRight } from 'lucide-react'

export default function PartnerProgramPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-red-800 mb-4">
            Partner Program
          </h1>
          <p className="text-lg md:text-xl text-red-700 max-w-3xl mx-auto">
            Join WhySoCheap's Partner Program and earn money by referring our amazing products! 
            We're looking for young, ambitious individuals who are passionate about fashion and eager to grow with us.
          </p>
        </div>

        {/* How It Works */}
        <div className="card-elevated p-8 mb-10 bg-gradient-to-br from-white to-red-50 border-4 border-red-300 rounded-2xl">
          <h2 className="text-2xl font-semibold text-red-800 mb-6">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-900">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Get Your Unique Code</h3>
                  <p className="text-primary-600">
                    Once approved, you'll receive your unique referral code to share with your audience.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-900">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Share & Promote</h3>
                  <p className="text-primary-600">
                    Share WhySoCheap products with your friends, family, social media followers, or any community you're part of.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-900">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Earn Commissions</h3>
                  <p className="text-primary-600">
                    Earn a competitive commission on every sale made through your unique referral link.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-900">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Grow Together</h3>
                  <p className="text-primary-600">
                    Gain access to exclusive promotions, early product releases, and be part of a growing community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="card-elevated p-8 mb-10">
          <h2 className="text-2xl font-semibold text-primary-900 mb-6 flex items-center gap-2">
            <Gift className="w-6 h-6 text-primary-600" />
            Why Partner With Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <h3 className="font-semibold text-primary-900 mb-2">Competitive Commissions</h3>
              <p className="text-primary-600 text-sm">
                Earn money for every successful referral
              </p>
            </div>
            <div className="text-center p-4">
              <h3 className="font-semibold text-primary-900 mb-2">Exclusive Access</h3>
              <p className="text-primary-600 text-sm">
                Get early access to new products and special promotions
              </p>
            </div>
            <div className="text-center p-4">
              <h3 className="font-semibold text-primary-900 mb-2">Supportive Community</h3>
              <p className="text-primary-600 text-sm">
                Join a network of like-minded entrepreneurs and creators
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-green-700 rounded-2xl p-10 text-center text-white border-4 border-yellow-300 relative overflow-hidden">
          <h2 className="text-3xl font-bold mb-4 relative z-10">
            Ready to Partner With Us?
          </h2>
          <p className="text-lg mb-8 text-yellow-100 max-w-2xl mx-auto relative z-10">
            If you're a young, ambitious individual looking to earn money and collaborate with a dynamic brand, we want to hear from you!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 text-red-800 font-semibold rounded-lg hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-yellow-300 relative z-10"
          >
            Contact Us to Join
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-primary-600 hover:text-primary-900 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

