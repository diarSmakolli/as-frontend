// CRITICAL: Centralized icon imports to reduce bundle size
// Only import icons that are actually used across the app

// Import from main react-icons packages (correct syntax)
import { 
  FaRegHeart, 
  FaChevronRight, 
  FaChevronLeft, 
  FaUser, 
  FaHome, 
  FaSearch, 
  FaShoppingCart, 
  FaBars, 
  FaTimes, 
  FaBox, 
  FaShippingFast, 
  FaShieldAlt 
} from 'react-icons/fa';

import { 
  MdMenu, 
  MdClose, 
  MdShoppingCart 
} from 'react-icons/md';

// Re-export the imported icons
export { 
  FaRegHeart, 
  FaChevronRight, 
  FaChevronLeft, 
  FaUser, 
  FaHome, 
  FaSearch, 
  FaShoppingCart, 
  FaBars, 
  FaTimes, 
  FaBox, 
  FaShippingFast, 
  FaShieldAlt,
  MdMenu, 
  MdClose, 
  MdShoppingCart 
};

// Custom SVG icons for better performance (recommended for most used icons)
export const HeartIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const ChevronRightIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ChevronLeftIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);