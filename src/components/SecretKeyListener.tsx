'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SecretKeyListener() {
  const router = useRouter();
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());

      // Check for Cmd/Ctrl + Shift + A + L
      const hasModifier = e.metaKey || e.ctrlKey;
      const hasShift = e.shiftKey;
      const hasA = keysPressed.current.has('a');
      const hasL = keysPressed.current.has('l');

      if (hasModifier && hasShift && hasA && hasL) {
        e.preventDefault();
        router.push('/secret-developer');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    // Reset keys when window loses focus
    const handleBlur = () => {
      keysPressed.current.clear();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [router]);

  return null;
}
