'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronDown, CalendarPlus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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

// Calendar URL generators
function formatDateForCalendar(dateStr: string, time?: string | null): { start: Date; end: Date } {
  const date = new Date(dateStr);
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours || 9, minutes || 0, 0, 0);
  } else {
    date.setHours(9, 0, 0, 0);
  }
  const start = new Date(date);
  const end = new Date(date);
  end.setHours(end.getHours() + 3); // Default 3-hour duration
  return { start, end };
}

function toGoogleCalendarDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function toICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function generateGoogleCalendarUrl(event: Event, eventUrl: string): string {
  const { start, end } = formatDateForCalendar(event.date, event.time);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toGoogleCalendarDate(start)}/${toGoogleCalendarDate(end)}`,
    details: `${event.description}\n\nView event details: ${eventUrl}`,
    location: event.location || 'Sudbury, Ontario',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function generateOutlookCalendarUrl(event: Event, eventUrl: string): string {
  const { start, end } = formatDateForCalendar(event.date, event.time);
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: `${event.description}\n\nView event details: ${eventUrl}`,
    location: event.location || 'Sudbury, Ontario',
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function generateICSFile(event: Event, eventUrl: string): void {
  const { start, end } = formatDateForCalendar(event.date, event.time);
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sudbury Helping Families//Events//EN
BEGIN:VEVENT
UID:${event.id}@sudburyhelpingfamilies.com
DTSTAMP:${toICSDate(new Date())}
DTSTART:${toICSDate(start)}
DTEND:${toICSDate(end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}\\n\\nView event details: ${eventUrl}
LOCATION:${event.location || 'Sudbury, Ontario'}
URL:${eventUrl}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Add to Calendar Dropdown Component
function AddToCalendarButton({ event }: { event: Event }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get the full URL for the event
  const eventUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/events#event-${event.id}`
    : `https://sudburyhelpingfamilies.com/events#event-${event.id}`;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(event, eventUrl), '_blank');
    setIsOpen(false);
  };

  const handleOutlookCalendar = () => {
    window.open(generateOutlookCalendarUrl(event, eventUrl), '_blank');
    setIsOpen(false);
  };

  const handleAppleCalendar = () => {
    generateICSFile(event, eventUrl);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f5a623]/20 text-[#f5a623] hover:bg-[#f5a623]/30 transition-colors text-sm font-medium border border-[#f5a623]/30"
      >
        <CalendarPlus size={16} />
        Add to Calendar
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 bottom-full mb-2 w-48 rounded-lg bg-[#1a2e2e] border border-[#38b6c4]/30 shadow-xl z-[100] overflow-hidden"
          >
            <button
              onClick={handleGoogleCalendar}
              className="w-full px-4 py-3 text-left text-[#e0f7fa] hover:bg-[#38b6c4]/20 transition-colors flex items-center gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zM12 18.75a6.75 6.75 0 110-13.5 6.75 6.75 0 010 13.5z"/>
              </svg>
              Google Calendar
            </button>
            <button
              onClick={handleOutlookCalendar}
              className="w-full px-4 py-3 text-left text-[#e0f7fa] hover:bg-[#38b6c4]/20 transition-colors flex items-center gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.17 3H2.83A.83.83 0 002 3.83v16.34c0 .46.37.83.83.83h18.34c.46 0 .83-.37.83-.83V3.83a.83.83 0 00-.83-.83zM12 17H5V7h7v10z"/>
              </svg>
              Outlook
            </button>
            <button
              onClick={handleAppleCalendar}
              className="w-full px-4 py-3 text-left text-[#e0f7fa] hover:bg-[#38b6c4]/20 transition-colors flex items-center gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z"/>
              </svg>
              Apple Calendar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
                    id={`event-${event.id}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 md:p-8 scroll-mt-24 overflow-hidden"
                  >
                    {/* Thumbnail Image */}
                    {event.imageUrl && (
                      <div className="relative w-full h-48 md:h-56 -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6 overflow-hidden">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e2e] to-transparent" />
                      </div>
                    )}
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
                          <div className="flex items-center gap-1 text-sm text-[#38b6c4]/80 mb-4">
                            <MapPin size={14} />
                            {event.location}
                          </div>
                        )}

                        {/* Add to Calendar Button */}
                        <div className="pt-2">
                          <AddToCalendarButton event={event} />
                        </div>
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
