import React, { useState, useEffect } from 'react';

const ScrollToTopButton = ({ imageModal }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY; // It gets the current vertical scroll position of the page using window.scrollY.
    const visibilityThreshold = 200; // A threshold value (visibilityThreshold) is set (in pixels), and the isVisible state is updated based on whether the scroll position is greater than this threshold.

    // If scrollY is greater than the threshold, isVisible is set to true, indicating that the button should be visible; otherwise, it's set to false.
    setIsVisible(scrollY > visibilityThreshold);
  };

  // The scrollToTop function is a callback that is called when the user clicks the button.
  // It uses window.scrollTo to smoothly scroll the page to the top (top: 0).
  // The behavior: 'smooth' property ensures a smooth scrolling animation.
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    // This line adds an event listener to the scroll event on the window object.
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      className={`scroll-to-top-button ${
        !imageModal && isVisible ? 'visible' : ''
      }`}
      onClick={scrollToTop}
    >
      Scroll To Top
    </button>
  );
};

export default ScrollToTopButton;
