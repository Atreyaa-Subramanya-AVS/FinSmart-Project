// jest.setup.js

// Extend expect with DOM matchers (for React Testing Library)
// import '@testing-library/jest-dom/extend-expect';

import "@testing-library/jest-dom";

global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};

// jest.setup.js
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};


