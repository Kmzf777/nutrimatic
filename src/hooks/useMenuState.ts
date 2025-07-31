'use client';

import { useState, useEffect } from 'react';

export function useMenuState() {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Garantir que o estado seja inicializado após a montagem
    setTimeout(() => setIsInitialized(true), 100);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuExpanded(!isMenuExpanded);
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    if (!isMobile && isInitialized) {
      console.log('Mouse enter - setting hover to true');
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && isInitialized) {
      console.log('Mouse leave - setting hover to false');
      setIsHovering(false);
    }
  };

  // Menu visível quando expandido OU quando hover (apenas desktop)
  const isMenuVisible = isMenuExpanded || (isHovering && !isMobile);
  
  console.log('Menu state:', { isMenuExpanded, isHovering, isMobile, isMenuVisible, isInitialized });

  return {
    isMenuExpanded,
    isHovering,
    isMobile,
    isMenuVisible,
    isInitialized,
    setIsMenuExpanded,
    handleMenuToggle,
    handleMouseEnter,
    handleMouseLeave,
  };
} 