'use client';

import { useState, useEffect, useRef } from 'react';

export function useMenuState() {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Começar como mobile para evitar flash
  const [isInitialized, setIsInitialized] = useState(false);
  const prevIsMobileRef = useRef<boolean>(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      const prev = prevIsMobileRef.current;
      setIsMobile(mobile);

      // Ao cruzar o breakpoint, garantir estados consistentes
      if (mobile !== prev) {
        // Ao entrar no mobile, o menu deve iniciar fechado e sem hover
        // Ao entrar no desktop, também iniciamos fechado e sem hover
        setIsMenuExpanded(false);
        setIsHovering(false);
        prevIsMobileRef.current = mobile;
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