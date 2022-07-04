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

export function formatDateTime(date: string | Date): string {
  return moment(date).format('DD-MMM-yyyy hh:mm A')
}

export function formatDuration(duration: number): string {
  if (isNaN(duration)) return String(duration)
  const sec = new BigNumber(duration)
  if (sec.isLessThan(60)) return `${sec} seconds`
  if (sec.isLessThan(3600)) return `${sec.dividedToIntegerBy(60).toNumber()} minutes`
  if (sec.isLessThan(86400)) return `${sec.dividedToIntegerBy(3600).toNumber()} hours`
  return `${sec.dividedToIntegerBy(86400).toNumber()} days`
}