global.requestAnimationFrame = (callback) => setTimeout(callback, 16); // Approximates 60fps
global.cancelAnimationFrame = (id) => clearTimeout(id); // Mock cancelAnimationFrame
