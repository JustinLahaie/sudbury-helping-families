'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const upcomingEvents = [
  {
    id: 1,
    title: 'Youth Dance - Valley East',
    date: 'January 2025',
    time: '7:00 PM - 10:00 PM',
    location: 'Valley East Community Centre',
    description: 'A fun, safe space for teens to socialize and enjoy music. All ages welcome!',
    type: 'Community Event',
  },
  {
    id: 2,
    title: 'Family Support Drive',
    date: 'February 2025',
    time: 'All Day',
    location: 'Sudbury Area',
    description: 'Help us collect essential items for families in need during winter months.',
    type: 'Fundraiser',
  },
];

const pastEvents = [
  {
    id: 3,
    year: '2024',
    title: 'Christmas Hamper Distribution',
    description: 'Provided holiday hampers to 50+ families across Sudbury.',
  },
  {
    id: 4,
    year: '2024',
    title: 'Back to School Supply Drive',
    description: 'Collected and distributed school supplies to children in need.',
  },
  {
    id: 5,
    year: '2023',
    title: 'Teen Dance Night',
    description: 'Brought back community dances for youth in Valley East.',
  },
  {
    id: 6,
    year: '2023',
    title: 'Summer BBQ Fundraiser',
    description: 'Community gathering to raise funds for family support programs.',
  },
];

export default function EventsPage() {
  const [showPastEvents, setShowPastEvents] = useState(false);

  return (
    <div className="flex-1 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#e0f7fa] mb-4">Events</h1>
          <p className="text-[#38b6c4] text-lg">Join us at upcoming community events and help make a difference</p>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[#e0f7fa] mb-8 flex items-center gap-3">
            <Calendar className="text-[#f5a623]" />
            Upcoming Events
          </h2>

          {upcomingEvents.length > 0 ? (
            <div className="grid gap-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-6 md:p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Date Badge */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl bg-[#f5a623]/20 border border-[#f5a623]/30 flex flex-col items-center justify-center">
                        <span className="text-[#f5a623] text-xs uppercase tracking-wide">
                          {event.date.split(' ')[0]}
                        </span>
                        <span className="text-[#e0f7fa] text-lg font-bold">
                          {event.date.split(' ')[1]}
                        </span>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 rounded-full bg-[#38b6c4]/20 text-[#38b6c4] text-xs font-medium mb-3">
                        {event.type}
                      </span>
                      <h3 className="text-xl font-bold text-[#e0f7fa] mb-2">{event.title}</h3>
                      <p className="text-[#e0f7fa]/70 mb-4">{event.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-[#38b6c4]/80">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-[#e0f7fa]/70">No upcoming events scheduled. Check back soon!</p>
            </div>
          )}
        </motion.div>

        {/* Past Events Accordion */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowPastEvents(!showPastEvents)}
            className="w-full glass-card p-4 flex items-center justify-between hover:bg-[#38b6c4]/10 transition-colors"
          >
            <h2 className="text-xl font-bold text-[#e0f7fa] flex items-center gap-3">
              Past Events
            </h2>
            <motion.div
              animate={{ rotate: showPastEvents ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="text-[#38b6c4]" />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{ height: showPastEvents ? 'auto' : 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {pastEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-4 border-l-4 border-[#38b6c4]/50"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-[#f5a623] font-bold">{event.year}</span>
                    <div>
                      <h3 className="font-semibold text-[#e0f7fa]">{event.title}</h3>
                      <p className="text-sm text-[#e0f7fa]/60 mt-1">{event.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 text-center mt-12"
        >
          <h2 className="text-2xl font-bold text-[#e0f7fa] mb-4">Want to Host an Event?</h2>
          <p className="text-[#e0f7fa]/70 mb-6">
            Partner with us to organize community events that make a difference.
          </p>
          <a href="/contact" className="btn-primary inline-block">
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
}
