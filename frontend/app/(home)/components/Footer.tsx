import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-4">Nasy Scents</h2>
            <p className="text-sm text-gray-400 mb-6">
              Discover the Essence of Elegance with Nasy Scents Collection
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20v-7.21H5.93v-2.94h2.36V8.04c0-2.33 1.43-3.6 3.5-3.6 1.04 0 1.93.08 2.19.11v2.54h-1.5c-1.18 0-1.41.56-1.41 1.38v1.81h2.82l-.37 2.94h-2.45V20" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9 5.5 9 5.5" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path
                    d="M16.5 7.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zM12 9c1.933 0 3.5 1.567 3.5 3.5S13.933 16 12 16s-3.5-1.567-3.5-3.5S10.067 9 12 9z"
                    fill="black"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition">
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/category/women"
                  className="hover:text-white transition"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  href="/category/men"
                  className="hover:text-white transition"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  href="/category/kids"
                  className="hover:text-white transition"
                >
                  Kids
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition">
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-white transition"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white transition">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-white transition">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gray-800 rounded-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-sm text-gray-400">
                Get the latest updates on new products and upcoming sales
              </p>
            </div>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:bg-gray-600"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2025 Nasy Scents Collection. All rights reserved.
            </p>
            <div className="flex gap-8">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                100% Secure Checkout
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Fast Shipping
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
