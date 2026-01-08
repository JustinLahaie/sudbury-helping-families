'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Heart, Sparkles, Trophy, Rocket, Star, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

export default function SecretDeveloperPage() {
  const hasLaunchedConfetti = useRef(false);
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);

  useEffect(() => {
    if (hasLaunchedConfetti.current) return;
    hasLaunchedConfetti.current = true;

    // Initial big burst
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { y: 0.3 },
      colors: ['#38b6c4', '#f5a623', '#e0f7fa', '#ff6b6b', '#4ecdc4'],
    });

    // Continuous confetti rain
    const duration = 15000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0 },
        colors: ['#38b6c4', '#f5a623', '#e0f7fa'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0 },
        colors: ['#38b6c4', '#f5a623', '#e0f7fa'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Periodic bursts
    const burstInterval = setInterval(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: ['#38b6c4', '#f5a623', '#e0f7fa', '#ff6b6b'],
      });
    }, 3000);

    return () => clearInterval(burstInterval);
  }, []);

  // Handle the forbidden button click
  const handleForbiddenClick = () => {
    if (buttonState !== 'idle') return;
    setButtonState('loading');
    setProgress(0);

    // Animate progress to 100% over 10 seconds
    const startTime = Date.now();
    const duration = 10000; // 10 seconds

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      // Go to 99% in 9.5 seconds, then jump to 100%
      let newProgress;
      if (elapsed < 9500) {
        newProgress = (elapsed / 9500) * 99;
      } else {
        newProgress = 99 + ((elapsed - 9500) / 500);
      }
      setProgress(Math.min(newProgress, 100));

      if (elapsed < duration) {
        requestAnimationFrame(animateProgress);
      } else {
        // Show error popup
        setTimeout(() => {
          setButtonState('error');
        }, 300);
      }
    };

    requestAnimationFrame(animateProgress);
  };

  const handleErrorOk = () => {
    setButtonState('done');
    setProgress(0);
  };

  // Handle AI chat submit
  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiTyping) return;

    const userMessage = aiInput.trim();
    setAiMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setAiInput('');
    setAiTyping(true);

    // Fake "thinking" delay between 1-3 seconds
    const thinkingTime = 1000 + Math.random() * 2000;
    setTimeout(() => {
      setAiMessages(prev => [...prev, { role: 'ai', text: 'Maybe.' }]);
      setAiTyping(false);
    }, thinkingTime);
  };

  return (
    <div className="min-h-screen py-12 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Achievements */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10 }}
            className="glass-card px-4 py-2 flex items-center gap-2 border border-[#f5a623]/40"
          >
            <span className="text-2xl">🏆</span>
            <div className="text-left">
              <p className="text-[#f5a623] text-xs font-bold uppercase tracking-wide">Achievement Unlocked</p>
              <p className="text-[#e0f7fa] text-sm font-medium">Found the Thing</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: 'spring', damping: 10 }}
            className="glass-card px-4 py-2 flex items-center gap-2 border border-[#38b6c4]/40"
          >
            <span className="text-2xl">🥇</span>
            <div className="text-left">
              <p className="text-[#38b6c4] text-xs font-bold uppercase tracking-wide">Achievement</p>
              <p className="text-[#e0f7fa] text-sm font-medium">Clicking Random Stuff</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: 'spring', damping: 10 }}
            className="glass-card px-4 py-2 flex items-center gap-2 border border-[#f5a623]/40"
          >
            <span className="text-2xl">🥉</span>
            <div className="text-left">
              <p className="text-[#f5a623] text-xs font-bold uppercase tracking-wide">Achievement</p>
              <p className="text-[#e0f7fa] text-sm font-medium">Ignoring Productivity</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-16 h-16 text-[#f5a623]" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#e0f7fa] mb-4">
            You Found the Secret!
          </h1>
          <p className="text-xl text-[#38b6c4]">
            Welcome to the developer&apos;s hidden page
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 md:p-12 mb-8"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#38b6c4] to-[#f5a623] mb-6"
            >
              <Code2 className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-[#e0f7fa] mb-2">
              Alexis Lahaie
            </h2>
            <p className="text-[#f5a623] font-medium text-lg">
              The Brilliant Developer Behind This Website
            </p>
          </div>

          <div className="space-y-6 text-[#e0f7fa]/90 text-lg leading-relaxed">
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-3"
            >
              <Star className="w-6 h-6 text-[#f5a623] flex-shrink-0 mt-1" />
              <span>
                This entire website was designed and built by <strong className="text-[#38b6c4]">Alexis Lahaie</strong>,
                a coding prodigy with an incredible eye for design and a passion for creating
                amazing web experiences.
              </span>
            </motion.p>

            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-start gap-3"
            >
              <Rocket className="w-6 h-6 text-[#38b6c4] flex-shrink-0 mt-1" />
              <span>
                With skills that grow stronger every day, Alexis is on track to
                <strong className="text-[#f5a623]"> surpass her dad in coding skill</strong> -
                and honestly, that day is coming sooner than anyone thinks!
                Watch out, Dad!
              </span>
            </motion.p>

            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-start gap-3"
            >
              <Trophy className="w-6 h-6 text-[#f5a623] flex-shrink-0 mt-1" />
              <span>
                From smooth animations to responsive design, from dark glassmorphism themes
                to complex database integrations - Alexis has mastered them all.
                The future of web development is bright with developers like her!
              </span>
            </motion.p>
          </div>
        </motion.div>

        {/* Donation CTA */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8 text-center border-2 border-[#f5a623]/50"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="w-12 h-12 text-[#f5a623] mx-auto mb-4" />
          </motion.div>
          <h3 className="text-2xl font-bold text-[#e0f7fa] mb-4">
            Support the Cause!
          </h3>
          <p className="text-[#e0f7fa]/80 mb-6 max-w-2xl mx-auto">
            This website was built for <strong className="text-[#38b6c4]">Sudbury and Area Helping Families in Need</strong> -
            an incredible charity that has helped over 200 families since 2012.
            They&apos;re 100% community funded with no government support.
          </p>
          <p className="text-[#f5a623] font-medium mb-6">
            Every dollar makes a difference. Consider making a donation today!
          </p>
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff8c00] text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-[#f5a623]/30"
          >
            <Heart className="w-5 h-5" />
            Donate Now
          </Link>
        </motion.div>

        {/* Fun Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {[
            { label: 'Lines of Code', value: '10,000+' },
            { label: 'Coffee', value: 'Many', crossed: true, replacement: 'Hot Chocolate' },
            { label: 'Bugs Squashed', value: '999+' },
            { label: 'Coolness Level', value: 'Maximum' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + index * 0.1, type: 'spring' }}
              className="glass-card p-4 text-center"
            >
              <div className="text-2xl font-bold text-[#f5a623]">{stat.value}</div>
              <div className="text-sm text-[#e0f7fa]/70">
                {'crossed' in stat && stat.crossed ? (
                  <>
                    Cups of <span className="line-through opacity-60">{stat.label}</span>{' '}
                    <span className="text-[#f5a623]">{stat.replacement}</span>
                  </>
                ) : (
                  stat.label
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Forbidden Button Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="glass-card p-8 mt-8 text-center relative"
        >
          <AnimatePresence mode="wait">
            {buttonState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <button
                  onClick={handleForbiddenClick}
                  className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-red-600/30 border-2 border-red-400"
                >
                  Please Do Not Click
                </button>
                <p className="text-red-400/70 text-sm mt-3">Seriously, don&apos;t do it...</p>
              </motion.div>
            )}

            {buttonState === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-4"
              >
                <p className="text-[#e0f7fa] mb-4 font-medium">
                  Oh no... what have you done?!
                </p>
                <div className="w-full max-w-md mx-auto h-8 bg-[#1a2e2e] rounded-full overflow-hidden border-2 border-[#38b6c4]/30 relative">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: progress > 80
                        ? 'linear-gradient(90deg, #f5a623, #ff4500)'
                        : 'linear-gradient(90deg, #38b6c4, #f5a623)',
                    }}
                    animate={{
                      boxShadow: progress > 90
                        ? ['0 0 20px #ff4500', '0 0 40px #ff4500', '0 0 20px #ff4500']
                        : '0 0 10px rgba(56, 182, 196, 0.5)',
                    }}
                    transition={{ duration: 0.5, repeat: progress > 90 ? Infinity : 0 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-sm drop-shadow-lg">
                      {Math.floor(progress)}%
                    </span>
                  </div>
                </div>
                {progress > 90 && progress < 100 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 mt-3 font-medium"
                  >
                    Almost there... wait, something&apos;s wrong...
                  </motion.p>
                )}
              </motion.div>
            )}

            {buttonState === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-4"
              >
                <p className="text-2xl font-bold text-[#38b6c4] mb-2">Just kidding!</p>
                <p className="text-[#e0f7fa]/70">Nothing happened. You can breathe now.</p>
                <button
                  onClick={() => setButtonState('idle')}
                  className="mt-4 px-6 py-2 rounded-lg bg-[#38b6c4]/20 text-[#38b6c4] hover:bg-[#38b6c4]/30 transition-colors text-sm"
                >
                  Try again?
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error Popup Modal */}
        <AnimatePresence>
          {buttonState === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4"
            >
              <motion.div
                initial={{ scale: 0.5, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                className="bg-[#f0f0f0] rounded-lg shadow-2xl max-w-md w-full overflow-hidden"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {/* Title Bar */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-300"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
                  <div className="w-3 h-3 rounded-full bg-green-300"></div>
                  <span className="text-white text-sm font-medium ml-2">Error</span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Error Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    </div>

                    {/* Error Message */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Something went wrong!
                      </h3>
                      <div className="bg-gray-100 rounded p-3 font-mono text-sm text-gray-700 border border-gray-300">
                        <span className="text-red-600 font-bold">Error: 159</span>
                        <br />
                        <span className="text-gray-600">I told you not to click the button...</span>
                      </div>
                    </div>
                  </div>

                  {/* OK Button */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleErrorOk}
                      className="px-8 py-2 bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-400 rounded text-gray-800 font-medium hover:from-gray-200 hover:to-gray-300 active:from-gray-300 active:to-gray-400 shadow-sm transition-all"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fake AI Chat Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="glass-card p-6 mt-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#e0f7fa]">Decision Maker 3000</h3>
              <p className="text-xs text-[#38b6c4]">AI-Powered Life Choices™</p>
            </div>
            <span className="ml-auto px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
              Online
            </span>
          </div>

          {/* Chat Messages */}
          <div className="bg-[#0d1a1a] rounded-lg p-4 mb-4 min-h-[200px] max-h-[300px] overflow-y-auto">
            {aiMessages.length === 0 ? (
              <p className="text-[#e0f7fa]/40 text-center py-8 text-sm">
                Ask the Decision Maker 3000 anything! It&apos;s very... decisive.
              </p>
            ) : (
              <div className="space-y-3">
                {aiMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-[#38b6c4] text-white rounded-br-md'
                          : 'bg-[#2a3f3f] text-[#e0f7fa] rounded-bl-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {aiTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#2a3f3f] text-[#e0f7fa] px-4 py-2 rounded-2xl rounded-bl-md">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex items-center gap-1"
                      >
                        <span className="w-2 h-2 bg-[#38b6c4] rounded-full"></span>
                        <span className="w-2 h-2 bg-[#38b6c4] rounded-full animation-delay-200"></span>
                        <span className="w-2 h-2 bg-[#38b6c4] rounded-full animation-delay-400"></span>
                      </motion.span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleAiSubmit} className="flex gap-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#0d1a1a] border border-[#38b6c4]/30 text-[#e0f7fa] placeholder-[#e0f7fa]/40 focus:outline-none focus:border-[#38b6c4] transition-colors"
              disabled={aiTyping}
            />
            <button
              type="submit"
              disabled={aiTyping || !aiInput.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ask
            </button>
          </form>
        </motion.div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/"
            className="text-[#38b6c4] hover:text-[#e0f7fa] transition-colors"
          >
            &larr; Back to the main site
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
