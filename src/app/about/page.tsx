'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Home, Music, Pizza, Trophy } from 'lucide-react';

const services = [
  {
    icon: Home,
    title: 'Housing Support',
    description: 'Helping families during times of housing insecurity and crisis.',
  },
  {
    icon: Pizza,
    title: 'Food & Essentials',
    description: 'Delivering food and essential items to families in need, including pizza to unsheltered individuals.',
  },
  {
    icon: Trophy,
    title: 'Youth Sports',
    description: 'Sponsoring hockey teams to reduce costs for families and ensure children can participate.',
  },
  {
    icon: Music,
    title: 'Youth Events',
    description: 'Reintroduced toddler, pre-teen, and teen dances in Valley East for safe social spaces.',
  },
];

const partners = [
  'Northern Ontario Families of Children with Cancer',
  'YWCA Geneva House',
  'City of Sudbury Social Services',
  'Manitoulin Sudbury District Social Services Board',
];

export default function AboutPage() {
  return (
    <div className="flex-1 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#e0f7fa] mb-4">About Us</h1>
          <p className="text-[#38b6c4] text-lg">Our story, mission, and the community we serve</p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 md:p-12 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Heart className="text-[#f5a623]" size={32} />
            <h2 className="text-2xl font-bold text-[#e0f7fa]">Our Story</h2>
          </div>

          <div className="space-y-4 text-[#e0f7fa]/80 leading-relaxed">
            <p>
              Sudbury and Area Helping Families in Need (also known as Sudbury Helping Families) is a
              community-driven, grassroots charity founded in <span className="text-[#f5a623] font-semibold">2012</span> with
              a simple but powerful mission: to support local families and individuals who are struggling
              to meet basic needs.
            </p>
            <p>
              Since our inception, we have assisted more than <span className="text-[#38b6c4] font-semibold">200 families</span> across
              the Sudbury area, providing meaningful support during times of financial hardship, housing
              insecurity, and crisis.
            </p>
            <p>
              Beyond direct assistance, we believe in community connection and inclusion. We are proud
              to have reintroduced toddler, pre-teen, and teen dances in Valley East, creating safe,
              affordable, and welcoming spaces for young people to socialize, build confidence, and
              simply be kids.
            </p>
          </div>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-[#e0f7fa] mb-8 text-center">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="glass-card p-6"
              >
                <service.icon size={36} className="text-[#38b6c4] mb-4" />
                <h3 className="text-lg font-bold text-[#e0f7fa] mb-2">{service.title}</h3>
                <p className="text-[#e0f7fa]/70 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Funding */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 md:p-12 mb-12 border-[#f5a623]/30"
        >
          <h2 className="text-2xl font-bold text-[#e0f7fa] mb-4">100% Community Funded</h2>
          <p className="text-[#e0f7fa]/80 leading-relaxed">
            Sudbury and Area Helping Families in Need receives <span className="text-[#f5a623] font-semibold">no government funding</span>.
            Every dollar raised goes directly back into the community through donations, partnerships,
            and local initiatives. Our work is made possible entirely through the generosity of donors,
            volunteers, and supporters who believe that no one in our community should be left behind.
          </p>
          <p className="mt-4 text-xl text-[#38b6c4] font-medium">
            Together, we are making a difference—one family, one meal, and one act of kindness at a time.
          </p>
        </motion.div>

        {/* Partners */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Users className="text-[#38b6c4]" size={28} />
            <h2 className="text-2xl font-bold text-[#e0f7fa]">Our Partners</h2>
          </div>
          <p className="text-[#e0f7fa]/70 mb-8 max-w-2xl mx-auto">
            Our impact is strengthened through collaboration with respected community organizations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {partners.map((partner, index) => (
              <motion.span
                key={partner}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="px-5 py-3 rounded-full bg-[#38b6c4]/10 text-[#38b6c4] border border-[#38b6c4]/20 text-sm"
              >
                {partner}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
