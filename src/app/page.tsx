'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, Users, Calendar, Heart, HandHeart } from 'lucide-react';
import { useEffect, useState } from 'react';

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span id={`counter-${end}`}>
      {count}{suffix}
    </span>
  );
}

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e2e] via-[#1a3535] to-[#1a2e2e]">
          <div className="absolute inset-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#38b6c4]/20"
                style={{
                  width: Math.random() * 300 + 50,
                  height: Math.random() * 300 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <Image
              src="/logo.jpg"
              alt="Sudbury and Area Helping Families in Need"
              width={180}
              height={180}
              className="mx-auto rounded-full shadow-2xl glow"
              priority
            />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold text-[#e0f7fa]"
          >
            Sudbury & Area
            <span className="block gradient-text">Helping Families in Need</span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-6 text-xl md:text-2xl text-[#f5a623] font-medium"
          >
            Fuelled by Kindness. Powered by Community.
          </motion.p>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-4 text-lg text-[#38b6c4]/80 max-w-2xl mx-auto"
          >
            Supporting families and individuals in Sudbury and surrounding communities during times of hardship since 2012.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/donate" className="btn-accent flex items-center gap-2">
              <Heart size={20} />
              Donate Now
            </Link>
            <Link href="/about" className="btn-primary">
              Learn More
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown size={32} className="text-[#38b6c4]" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 px-6 bg-[#152424]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-[#e0f7fa] mb-16"
          >
            Our Impact
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: 200, suffix: '+', label: 'Families Helped' },
              { icon: Calendar, number: 12, suffix: '+', label: 'Years Active' },
              { icon: HandHeart, number: 100, suffix: '%', label: 'Community Funded' },
              { icon: Heart, number: 1000, suffix: '+', label: 'Acts of Kindness' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <stat.icon size={40} className="mx-auto text-[#f5a623] mb-4" />
                <p className="text-3xl md:text-4xl font-bold text-[#38b6c4]">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-[#e0f7fa]/80 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#e0f7fa] mb-6">Our Mission</h2>
            <p className="text-[#e0f7fa]/80 leading-relaxed text-lg">
              Sudbury and Area Helping Families in Need is a community-driven, grassroots charity
              founded in 2012 with a simple but powerful mission: to support local families and
              individuals who are struggling to meet basic needs.
            </p>
            <p className="mt-4 text-[#e0f7fa]/80 leading-relaxed text-lg">
              We receive no government funding. Every dollar raised goes directly back into the
              community through donations, partnerships, and local initiatives. Our work is made
              possible entirely through the generosity of donors, volunteers, and supporters who
              believe that no one in our community should be left behind.
            </p>
            <div className="mt-8">
              <Link href="/about" className="btn-primary">
                Read Our Full Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 px-6 bg-[#152424]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-[#e0f7fa] mb-12"
          >
            Get Involved
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Donate',
                description: 'Every donation helps us provide direct support to families in need.',
                href: '/donate',
                icon: Heart,
                color: 'amber',
              },
              {
                title: 'Upcoming Events',
                description: 'Join us at community events and help make a difference.',
                href: '/events',
                icon: Calendar,
                color: 'cyan',
              },
              {
                title: 'Contact Us',
                description: 'Have questions or want to partner with us? Reach out!',
                href: '/contact',
                icon: Users,
                color: 'cyan',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="glass-card p-6 block h-full hover:scale-105 transition-transform duration-300"
                >
                  <item.icon
                    size={36}
                    className={item.color === 'amber' ? 'text-[#f5a623]' : 'text-[#38b6c4]'}
                  />
                  <h3 className="mt-4 text-xl font-bold text-[#e0f7fa]">{item.title}</h3>
                  <p className="mt-2 text-[#e0f7fa]/70">{item.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-[#e0f7fa] mb-8"
          >
            Our Community Partners
          </motion.h2>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              'Northern Ontario Families of Children with Cancer',
              'YWCA Geneva House',
              'City of Sudbury Social Services',
              'Manitoulin Sudbury District Social Services Board',
            ].map((partner) => (
              <span
                key={partner}
                className="px-4 py-2 rounded-full bg-[#38b6c4]/10 text-[#38b6c4] text-sm border border-[#38b6c4]/20"
              >
                {partner}
              </span>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
