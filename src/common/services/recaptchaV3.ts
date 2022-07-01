import { RECAPTCHA_V3_KEY } from '../constants/config';
import { injectScript } from '../utils/helper';

let recaptchaLoaded = false;

export const initRecaptchaV3 = async () => {
  if (!recaptchaLoaded) {
    await Promise.all([
      injectScript({
        fromSrc: `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_V3_KEY}`,
        attrs: { id: 'recaptchajs', async: true, defer: true }
      })
    ]);
    recaptchaLoaded = true;
  }
};

export const getRecaptcha = async (action) => {
  if (!recaptchaLoaded) {
    await Promise.all([
      injectScript({
        fromSrc: `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_V3_KEY}`,
        attrs: { id: 'recaptchajs', async: true, defer: true }
      })
    ]);
    recaptchaLoaded = true;
    await new Promise(r => setTimeout(r, 500));
  }
  const captchaToken = await window.grecaptcha.execute(RECAPTCHA_V3_KEY, { action });
  return captchaToken;
};
