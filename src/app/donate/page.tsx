'use client';

import { motion } from 'framer-motion';
import { Heart, Copy, Check, ShoppingBag, Pizza, Backpack, Gift } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const impactItems = [
  {
    amount: '$25',
    icon: Pizza,
    title: 'Meals for a Family',
    description: 'Provides nutritious meals for a family in need.',
  },
  {
    amount: '$50',
    icon: ShoppingBag,
    title: 'Essential Supplies',
    description: 'Covers essential household items and toiletries.',
  },
  {
    amount: '$100',
    icon: Backpack,
    title: 'Back to School',
    description: 'Supplies a child with school supplies and clothing.',
  },
  {
    amount: '$200+',
    icon: Gift,
    title: 'Family Support',
    description: 'Comprehensive support during times of crisis.',
  },
];

export default function DonatePage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex-1 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#f5a623]/20 flex items-center justify-center"
          >
            <Heart size={40} className="text-[#f5a623]" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#e0f7fa] mb-4">Make a Difference</h1>
          <p className="text-[#38b6c4] text-lg max-w-2xl mx-auto">
            Every donation helps us provide direct support to families and individuals
            in our community during times of hardship.
          </p>
        </motion.div>

        {/* Impact Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-[#e0f7fa] mb-8 text-center">What Your Donation Provides</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {impactItems.map((item, index) => (
              <motion.div
                key={item.amount}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="glass-card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#38b6c4]/20 flex items-center justify-center flex-shrink-0">
                    <item.icon size={24} className="text-[#38b6c4]" />
                  </div>
                  <div>
                    <span className="text-[#f5a623] font-bold text-lg">{item.amount}</span>
                    <h3 className="text-[#e0f7fa] font-semibold mt-1">{item.title}</h3>
                    <p className="text-[#e0f7fa]/60 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* E-Transfer Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 md:p-10 mb-12 border-[#f5a623]/30"
        >
          <h2 className="text-2xl font-bold text-[#e0f7fa] mb-6 text-center">Donate via E-Transfer</h2>

          <div className="space-y-4 max-w-md mx-auto">
            {/* Email */}
            <div className="bg-[#1a2e2e] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[#38b6c4]/70 text-sm">Email</p>
                <p className="text-[#e0f7fa] font-mono">sudburyhelpingfamilies@hotmail.com</p>
              </div>
              <button
                onClick={() => copyToClipboard('sudburyhelpingfamilies@hotmail.com', 'Email')}
                className="p-2 rounded-lg bg-[#38b6c4]/20 hover:bg-[#38b6c4]/30 transition-colors"
              >
                {copied === 'Email' ? (
                  <Check size={20} className="text-green-400" />
                ) : (
                  <Copy size={20} className="text-[#38b6c4]" />
                )}
              </button>
            </div>

            {/* Password */}
            <div className="bg-[#1a2e2e] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[#38b6c4]/70 text-sm">Password</p>
                <p className="text-[#e0f7fa] font-mono">Charity</p>
              </div>
              <button
                onClick={() => copyToClipboard('Charity', 'Password')}
                className="p-2 rounded-lg bg-[#38b6c4]/20 hover:bg-[#38b6c4]/30 transition-colors"
              >
                {copied === 'Password' ? (
                  <Check size={20} className="text-green-400" />
                ) : (
                  <Copy size={20} className="text-[#38b6c4]" />
                )}
              </button>
            </div>
          </div>

          <p className="text-center text-[#e0f7fa]/60 text-sm mt-6">
            Please include your name in the message if you would like to be acknowledged.
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-12"
        >
          {[
            { value: '12+', label: 'Years Active' },
            { value: '200+', label: 'Families Helped' },
            { value: '100%', label: 'Goes to Community' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-[#f5a623]">{stat.value}</p>
              <p className="text-[#e0f7fa]/60 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 text-center"
        >
          <p className="text-[#e0f7fa]/70 text-sm">
            <span className="text-[#f5a623]">Please note:</span> At this time, we are not a registered
            charity and are unable to issue tax receipts. Every dollar goes directly to helping
            families in our community.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
