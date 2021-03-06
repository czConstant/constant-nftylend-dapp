const tokenIcons = {
  eth: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  btc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
  bnb: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  bsc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  boba: 'https://s2.coinmarketcap.com/static/img/coins/64x64/14556.png',
  dgx: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2739.png',
  ftm: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3513.png',
  near: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6535.png',
  tomo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2570.png',
  elf: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2299.png',
  rep: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1104.png',
  bat: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1697.png',
  celr: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3814.png',
  cvc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1816.png',
  mana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1966.png',
  dent: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1886.png',
  eng: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2044.png',
  ethos: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1817.png',
  fet: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3773.png',
  gvt: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2181.png',
  gto: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2289.png',
  gnt: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1455.png',
  hot: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2682.png',
  iotx: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2777.png',
  kat: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3634.png',
  kcs: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2087.png',
  knc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1982.png',
  lrc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1934.png',
  matic: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
  mco: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1776.png',
  mtl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1788.png',
  mith: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2608.png',
  mda: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1954.png',
  nano: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1567.png',
  ncash: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2544.png',
  nuls: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2092.png',
  omg: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1808.png',
  ppt: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1789.png',
  powr: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2132.png',
  zrx: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1896.png',
  ae: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1700.png',
  enj: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2130.png',
  icx: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2099.png',
  usdt: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
  usn: 'https://s2.coinmarketcap.com/static/img/coins/64x64/19682.png',
  vet: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3077.png',
  adx: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1768.png',
  beam: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3702.png',
  btt: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3718.png',
  dgd: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1229.png',
  npxs: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2603.png',
  qkc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2840.png',
  ren: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2539.png',
  agi: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2424.png',
  snt: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1759.png',
  xlm: 'https://s2.coinmarketcap.com/static/img/coins/64x64/512.png',
  storj: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1772.png',
  wabi: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2267.png',
  wtc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1925.png',
  xrp: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
  bnt: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1727.png',
  band: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4679.png',
  dcr: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1168.png',
  one: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3945.png',
  ht: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2502.png',
  okb: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3897.png',
  ont: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2566.png',
  xtz: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2011.png',
  prv: 'https://s3.amazonaws.com/incognito-org/wallet/cryptocurrency-icons/32@2x/color/prv@2x.png',
  miota: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1720.png',
  wan: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2606.png',
  xzc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1414.png',
  etc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png',
  iost: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2405.png',
  nas: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1908.png',
  neo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1376.png',
  lend: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2239.png',
  ast: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2058.png',
  algo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png',
  ankr: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3783.png',
  ant: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1680.png',
  bal: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5728.png',
  bch: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1831.png',
  bzrx: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5810.png',
  ada: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
  link: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
  comp: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png',
  crv: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6538.png',
  dash: 'https://s2.coinmarketcap.com/static/img/coins/64x64/131.png',
  yfii: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5957.png',
  dia: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6138.png',
  dgb: 'https://s2.coinmarketcap.com/static/img/coins/64x64/109.png',
  doge: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
  hc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1903.png',
  jst: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5488.png',
  ksm: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5034.png',
  ltc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2.png',
  mkr: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png',
  xmr: 'https://s2.coinmarketcap.com/static/img/coins/64x64/328.png',
  ogn: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5117.png',
  dot: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png',
  qtum: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1684.png',
  rvn: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2577.png',
  rsr: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3964.png',
  srm: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6187.png',
  sol: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  sushi: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6758.png',
  sxp: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4279.png',
  snx: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2586.png',
  trb: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4944.png',
  theta: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2416.png',
  trx: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  waves: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1274.png',
  wbtc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png',
  yfi: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5864.png',
  zec: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1437.png',
  usdc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
  dai: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
  busd: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png',
  tusd: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2563.png',
  usds: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3719.png',
  ftt: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4195.png',
  aave: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png',
  firo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1414.png',
  avax: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
};

export default tokenIcons;