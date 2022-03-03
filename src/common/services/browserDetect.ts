import MobileDetect from 'mobile-detect';

let instance: BrowserDetect;
let ssr_isMobile = false;

class BrowserDetect {
  dectector: MobileDetect = new MobileDetect(window.navigator.userAgent);

  constructor() {
    if (!instance) {
      if (__CLIENT__) {
        this.dectector = new MobileDetect(window.navigator.userAgent);
      }
      instance = this;
    }
    return instance;
  }

  setSsrIsMobile(check) {
    ssr_isMobile = check;
  }

  /**
   * check is mobile
   *
   * @readonly
   * @memberof BrowserDetect
   */
  get isMobile() {
    if (__SERVER__) {
      return ssr_isMobile;
    }
    return !!this.dectector?.phone();
  }

  get isIphone() {
    return this.dectector?.is('iphone');
  }

  get isChrome() {
    return this.dectector?.is('Chrome');
  }

  /**
   * check is tablet
   *
   * @readonly
   * @memberof BrowserDetect
   */
  get isTablet() {
    return !!this.dectector?.tablet();
  }

  /**
   * check is desktop
   *
   * @readonly
   * @memberof BrowserDetect
   */
  get isDesktop() {
    if (__SERVER__) {
      return !ssr_isMobile;
    }
    return (!this.isMobile && !this.isTablet);
  }

  // eslint-disable-next-line
  get isBot() {
    return /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
  }

  get os() {
    return this.dectector.os();
  }
}
export default new BrowserDetect();
