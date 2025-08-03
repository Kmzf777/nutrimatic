'use client';

import { useState, useEffect } from 'react';

export function useMenuState() {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Começar como mobile para evitar flash
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Se mudou para desktop, resetar estados
      if (!mobile) {
        setIsMenuExpanded(false);
      }
    };

    // Inicializar imediatamente
    checkScreenSize();
    setIsInitialized(true);
    
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuExpanded(!isMenuExpanded);
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovering(false);
    }
  };

  // Menu visível quando expandido OU quando hover (apenas desktop)
  const isMenuVisible = isMenuExpanded || (isHovering && !isMobile);

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