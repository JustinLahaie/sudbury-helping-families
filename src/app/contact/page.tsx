'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Send, User, AtSign, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex-1 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#e0f7fa] mb-4">Contact Us</h1>
          <p className="text-[#38b6c4] text-lg">
            Have questions or want to support our work? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 md:p-8"
          >
            <h2 className="text-xl font-bold text-[#e0f7fa] mb-6">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm text-[#38b6c4] mb-2">
                  Name *
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#38b6c4]/50" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1a2e2e] border border-[#38b6c4]/20 rounded-lg py-3 pl-10 pr-4 text-[#e0f7fa] placeholder-[#38b6c4]/40 focus:border-[#38b6c4] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-[#38b6c4] mb-2">
                  Email *
                </label>
                <div className="relative">
                  <AtSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#38b6c4]/50" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1a2e2e] border border-[#38b6c4]/20 rounded-lg py-3 pl-10 pr-4 text-[#e0f7fa] placeholder-[#38b6c4]/40 focus:border-[#38b6c4] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm text-[#38b6c4] mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#38b6c4]/50" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#1a2e2e] border border-[#38b6c4]/20 rounded-lg py-3 pl-10 pr-4 text-[#e0f7fa] placeholder-[#38b6c4]/40 focus:border-[#38b6c4] focus:outline-none transition-colors"
                    placeholder="705-XXX-XXXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-[#38b6c4] mb-2">
                  Message *
                </label>
                <div className="relative">
                  <MessageSquare size={18} className="absolute left-3 top-3 text-[#38b6c4]/50" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-[#1a2e2e] border border-[#38b6c4]/20 rounded-lg py-3 pl-10 pr-4 text-[#e0f7fa] placeholder-[#38b6c4]/40 focus:border-[#38b6c4] focus:outline-none transition-colors resize-none"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-accent flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-[#e0f7fa] mb-6">Get in Touch</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#38b6c4]/20 flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-[#38b6c4]" />
                  </div>
                  <div>
                    <p className="text-[#e0f7fa] font-semibold">Mike Bellerose</p>
                    <p className="text-[#38b6c4]/70 text-sm">Founder</p>
                  </div>
                </div>

                <a
                  href="mailto:sudburyhelpingfamilies@gmail.com"
                  className="flex items-start gap-4 hover:bg-[#38b6c4]/10 p-2 -m-2 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#38b6c4]/20 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-[#38b6c4]" />
                  </div>
                  <div>
                    <p className="text-[#e0f7fa]">sudburyhelpingfamilies@gmail.com</p>
                    <p className="text-[#38b6c4]/70 text-sm">Click to send email</p>
                  </div>
                </a>

                <a
                  href="tel:705-207-4170"
                  className="flex items-start gap-4 hover:bg-[#38b6c4]/10 p-2 -m-2 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#38b6c4]/20 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-[#38b6c4]" />
                  </div>
                  <div>
                    <p className="text-[#e0f7fa]">705-207-4170</p>
                    <p className="text-[#38b6c4]/70 text-sm">Click to call</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#38b6c4]/20 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-[#38b6c4]" />
                  </div>
                  <div>
                    <p className="text-[#e0f7fa]">Sudbury & Surrounding Communities</p>
                    <p className="text-[#38b6c4]/70 text-sm">Northern Ontario, Canada</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-[#e0f7fa] mb-4">Follow Us</h3>
              <a
                href="https://www.facebook.com/share/14R9XcKSaaW/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-[#1877f2]/20 hover:bg-[#1877f2]/30 transition-colors"
              >
                <Facebook size={24} className="text-[#1877f2]" />
                <div>
                  <p className="text-[#e0f7fa] font-medium">Facebook</p>
                  <p className="text-[#38b6c4]/70 text-sm">Stay updated on our activities</p>
                </div>
              </a>
            </div>

            {/* Note */}
            <div className="glass-card p-6 border-[#f5a623]/30">
              <p className="text-[#e0f7fa]/70 text-sm">
                <span className="text-[#f5a623] font-semibold">Please note:</span> We do not accept
                unsolicited requests for assistance. Support is provided through referrals from
                trusted community organizations and partners to ensure fairness, privacy, and the
                most effective use of our resources.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
