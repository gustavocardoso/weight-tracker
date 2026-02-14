'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { Footer } from '@/components/footer';
import { Shield, Lock, Eye, Database, UserCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="bg-gray-100 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 ml-14">Last updated: February 14, 2026</p>
          </div>
        </div>

        {/* Introduction */}
        <div className="glass p-6 rounded-xl border border-gray-200 dark:border-zinc-700/50">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            At Weight Tracker, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information. 
            We are committed to maintaining the confidentiality and security of your data.
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {/* Data Collection */}
          <div className="glass p-6 rounded-xl border border-gray-200 dark:border-zinc-700/50">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg flex-shrink-0">
                <Database className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  What Information We Collect
                </h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>We collect only the information necessary to provide our weight tracking service:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Account Information:</strong> Username, password (encrypted), and name</li>
                    <li><strong>Weight Data:</strong> Your weight entries, dates, and optional notes</li>
                    <li><strong>Body Measurements:</strong> Optional measurements (chest, waist, hips, thigh, arm) and notes</li>
                    <li><strong>Goal Information:</strong> Your target weight (optional)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="glass p-6 rounded-xl border border-gray-200 dark:border-zinc-700/50">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg flex-shrink-0">
                <UserCheck className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  How We Use Your Information
                </h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>Your data is used exclusively for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>To provide you with weight and measurement tracking functionality</li>
                    <li>To display your progress through charts and statistics</li>
                    <li>To calculate and show your progress towards your goal weight</li>
                    <li>To maintain your account and authenticate your access</li>
                  </ul>
                  <div className="mt-4 p-4 bg-green-500/5 border-l-4 border-green-500 rounded">
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      We will NEVER use your data for any other purpose beyond operating this application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="glass p-6 rounded-xl border border-gray-200 dark:border-zinc-700/50">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg flex-shrink-0">
                <Eye className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Data Sharing & Third Parties
                </h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="p-4 bg-purple-500/5 border-l-4 border-purple-500 rounded">
                    <p className="font-semibold text-purple-600 dark:text-purple-400 text-lg">
                      We DO NOT share, sell, or disclose your personal data to any third parties.
                    </p>
                  </div>
                  <p>Your information is stored locally and remains completely private:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>No analytics or tracking services have access to your data</li>
                    <li>No advertising networks receive your information</li>
                    <li>No data brokers or marketers have access to your data</li>
                    <li>Your data is never sold or monetized in any way</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="glass p-6 rounded-xl border border-gray-200 dark:border-zinc-700/50">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg flex-shrink-0">
                <Lock className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  How We Protect Your Data
                </h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>We implement security measures to protect your information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Password Encryption:</strong> Your password is encrypted using industry-standard hashing</li>
                    <li><strong>Local Storage:</strong> All data is stored in a local SQLite database on the server</li>
                    <li><strong>Session Security:</strong> Secure session management prevents unauthorized access</li>
                    <li><strong>Access Control:</strong> Only you can access your own data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="glass p-6 rounded-xl border border-gray-200 dark:border-zinc-700/50">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-lg flex-shrink-0">
                <Shield className="w-6 h-6 text-cyan-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Your Rights
                </h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>You have complete control over your data:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Access:</strong> View all your stored data at any time</li>
                    <li><strong>Edit:</strong> Update or correct your information whenever needed</li>
                    <li><strong>Delete:</strong> Remove individual entries or your entire account</li>
                    <li><strong>Export:</strong> Download your data (feature coming soon)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div className="glass p-6 rounded-xl border border-gray-200 dark:border-zinc-700/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Data Retention
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                We retain your data only as long as your account is active. If you wish to delete your account and all associated data, 
                please contact us at{' '}
                <a href="mailto:gustavocardoso@gmail.com" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  gustavocardoso@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="glass p-6 rounded-xl border border-gray-200 dark:border-zinc-700/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Questions or Concerns?
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                If you have any questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="mt-4">
                <a 
                  href="mailto:gustavocardoso@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Box */}
        <div className="glass p-6 rounded-xl border-2 border-blue-500/30 bg-blue-500/5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Our Commitment to You
          </h3>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p className="font-medium">✓ Your data is used ONLY for this application</p>
            <p className="font-medium">✓ We NEVER share your data with third parties</p>
            <p className="font-medium">✓ We NEVER sell your data</p>
            <p className="font-medium">✓ You have full control over your information</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
