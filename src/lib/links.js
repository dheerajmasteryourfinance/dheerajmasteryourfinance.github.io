// App destinations. Sign-in and the app itself are still unconfirmed; each <a>
// that uses one also carries APP_PLACEHOLDER so the placeholder gate fails
// `npm run build` until a human confirms the URL.
export const APP_LOGIN = 'https://app.website-generator.nl/login';
export const APP_HOME = 'https://app.website-generator.nl/';
export const APP_PLACEHOLDER = '[CONFIRM URL]';

// Registration in the app is invite-only, so the primary CTA goes to our own
// early-access page instead of the app's register page.
export const EARLY_ACCESS = '/early-access/';
