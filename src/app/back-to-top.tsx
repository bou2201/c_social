'use client';

import { Button } from '@/components/ui';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const HEIGHT = 300;

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > HEIGHT);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const scrollStep = -window.scrollY / 15;
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 5);
  };

  return (
    <Button
      onClick={scrollToTop}
      className={`fixed z-10 bottom-3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-full shadow-md transition-opacity duration-300 ${
        isVisible ? 'opacity-80' : 'opacity-0 pointer-events-none'
      }`}
      variant="default"
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  );
};

export default BackToTop;
