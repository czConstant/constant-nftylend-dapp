import BigNumber from 'bignumber.js';

export function formatCurrency(value = 0,  decimalNumber = 2) {
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