'use client';

import { Heart, Github, Mail, Shield } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <Heart className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              Weight Tracker
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your weight and body measurements with ease. Simple, elegant, and effective.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/measurements" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Measurements
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href="https://github.com/gustavocardoso"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:gustavocardoso@gmail.com"
                className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 dark:border-zinc-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              © {currentYear} Weight Tracker. Made with{' '}
              <Heart className="w-3 h-3 inline text-red-500" fill="currentColor" />{' '}
              by{' '}
              <a 
                href="https://github.com/gustavocardoso" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Gustavo Cardoso
              </a>
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>v1.0.0</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">All rights reserved</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
