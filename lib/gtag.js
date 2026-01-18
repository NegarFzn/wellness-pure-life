export const GA_MEASUREMENT_ID = "G-BW68Y2E49W";

// Standard pageview
export const pageview = (url) => {
  if (typeof window !== "undefined") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// SINGLE unified event format
export const gaEvent = (action, params = {}) => {
  if (typeof window !== "undefined") {
    window.gtag("event", action, params);
  }
};
