import BigNumber from 'bignumber.js';
import moment from 'moment-timezone';
import { isUrl } from './helper';

export function formatUrl(url: string): string {
  if (isUrl(url)) return url;
  return `http://${url}`;
}

export function formatCurrency(value: any = 0,  decimalNumber = 2) {
  if (isNaN(Number(value))) return 0;
  return new BigNumber(value).decimalPlaces(decimalNumber).toFormat(decimalNumber).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1');
}

export const shortCryptoAddress = (address: string = '', toLength?: number) => {
  if (toLength) {
    if (address.length <= toLength) return address;
    const x = Math.floor(toLength / 2);
    return `${address?.substr(0, x)}...${address?.substr(address?.length - x)}`;
  }
  if (address.length <= 16) return address;
  return `${address?.substr(0, 8)}...${address?.substr(address?.length - 8)}`;
};

export function formatCurrencyByLocale(value = 0,  decimalNumber = 2, roundingMode = BigNumber.ROUND_DOWN) {
  if (isNaN(value)) return 0;
  return new BigNumber(value).decimalPlaces(decimalNumber, roundingMode).toFormat(decimalNumber);
}

export function formatDateTime(date: string | Date): string {
  return moment(date).format('DD-MMM-yyyy hh:mm A')
}