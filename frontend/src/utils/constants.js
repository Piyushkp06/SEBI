export const HOST = import.meta.env.VITE_API_URL;

// Auth routes
export const AUTH_ROUTES = "api/auth";
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const PROFILE_ROUTE = `${AUTH_ROUTES}/profile`;

// Offer Scan routes
export const OFFER_SCAN_ROUTES = "api/offer-scan";
export const SCAN_INVESTMENT_OFFERS_ROUTE = `${OFFER_SCAN_ROUTES}/scan`;
export const CHECK_ADVISOR_CREDENTIALS_ROUTE = `${OFFER_SCAN_ROUTES}/check-advisor`;
export const FLAG_OFFER_ROUTE = `${OFFER_SCAN_ROUTES}/flag`;
export const GET_FLAGGED_OFFERS_ROUTE = `${OFFER_SCAN_ROUTES}/flagged`;
export const CHECK_LEGITIMACY_ROUTE = (offerId) => `${OFFER_SCAN_ROUTES}/legitimacy/${offerId}`;

// Social Scan routes
export const SOCIAL_SCAN_ROUTES = "api/social-scan";
export const SCAN_SOCIAL_MEDIA_ROUTE = `${SOCIAL_SCAN_ROUTES}/scan`;
export const GET_ALL_SOCIAL_SCANS_ROUTE = `${SOCIAL_SCAN_ROUTES}/all`;
export const GET_SOCIAL_SCAN_BY_ID_ROUTE = (id) => `${SOCIAL_SCAN_ROUTES}/${id}`;
export const GET_SCANS_BY_STOCK_ROUTE = (symbol) => `${SOCIAL_SCAN_ROUTES}/stock/${symbol}`;
export const INVESTIGATE_STOCK_ROUTE = (symbol) => `${SOCIAL_SCAN_ROUTES}/investigate/${symbol}`;
export const MARK_FALSE_POSITIVE_ROUTE = (id) => `${SOCIAL_SCAN_ROUTES}/${id}/false-positive`;
export const REPORT_SCAN_ROUTE = (id) => `${SOCIAL_SCAN_ROUTES}/${id}/report`;