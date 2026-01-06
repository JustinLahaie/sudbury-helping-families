'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Timeframe {
  id: string
  title: string
  description: string | null
  startTime: string
  endTime: string
  order: number
}

interface Event {
  id: string
  title: string
  description: string
  location: string | null
  date: string
  time: string | null
  type: string
  imageUrl: string | null
  published: boolean
  isPast: boolean
  timeframes: Timeframe[]
}

export default function EventsPage() {
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(e => !e.isPast);
  const pastEvents = events.filter(e => e.isPast);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear().toString(),
    };
  };

  if (loading) {
    return (
      <div className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-[#38b6c4]/20 rounded w-48 mx-auto mb-4"></div>
              <div className="h-6 bg-[#38b6c4]/20 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              {upcomingEvents.map((event, index) => {
                const { month, year } = formatDate(event.date);
                return (
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
                            {month}
                          </span>
                          <span className="text-[#e0f7fa] text-lg font-bold">
                            {year}
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

                        {/* Timeframes */}
                        {event.timeframes && event.timeframes.length > 0 ? (
                          <div className="mb-4 space-y-2">
                            <p className="text-sm text-[#f5a623] font-medium mb-2">Schedule:</p>
                            {event.timeframes.map((tf) => (
                              <div
                                key={tf.id}
                                className="flex items-start gap-3 bg-[#1a2e2e]/50 rounded-lg px-3 py-2"
                              >
                                <Clock size={14} className="text-[#38b6c4] mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[#e0f7fa] font-medium">{tf.title}</span>
                                    <span className="text-[#38b6c4]/80 text-sm">
                                      {tf.startTime} - {tf.endTime}
                                    </span>
                                  </div>
                                  {tf.description && (
                                    <p className="text-[#e0f7fa]/60 text-sm mt-0.5">{tf.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : event.time && (
                          <div className="flex flex-wrap gap-4 text-sm text-[#38b6c4]/80 mb-4">
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {event.time}
                            </span>
                          </div>
                        )}

                        {event.location && (
                          <div className="flex items-center gap-1 text-sm text-[#38b6c4]/80">
                            <MapPin size={14} />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-[#e0f7fa]/70">No upcoming events scheduled. Check back soon!</p>
            </div>
          )}
        </motion.div>

        {/* Past Events Accordion */}
        {pastEvents.length > 0 && (
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
                {pastEvents.map((event, index) => {
                  const { year } = formatDate(event.date);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-4 border-l-4 border-[#38b6c4]/50"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-[#f5a623] font-bold">{year}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#e0f7fa]">{event.title}</h3>
                          <p className="text-sm text-[#e0f7fa]/60 mt-1">{event.description}</p>
                          {/* Past event timeframes */}
                          {event.timeframes && event.timeframes.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {event.timeframes.map((tf) => (
                                <span
                                  key={tf.id}
                                  className="text-xs bg-[#38b6c4]/10 text-[#38b6c4] px-2 py-1 rounded"
                                >
                                  {tf.title}: {tf.startTime} - {tf.endTime}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

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
