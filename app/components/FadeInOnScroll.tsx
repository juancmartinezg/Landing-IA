'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';
// Wrapper que fade-in + slide-up al entrar al viewport.
// Cero dependencias externas (no Framer Motion).
// Optimizado: el observer se desconecta tras el primer trigger.
interface Props {
  children: ReactNode;
  delay?: number; // ms
  className?: string;
  threshold?: number;
}
export default function FadeInOnScroll({
  children,
  delay = 0,
  className = '',
  threshold = 0.1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Si el usuario prefiere reduced-motion, mostrar al instante
    if (typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, threshold]);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {children}
    </div>
  );
}