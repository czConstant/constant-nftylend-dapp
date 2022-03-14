import { APP_URL } from 'src/common/constants/url';

import Home from 'src/pages/home';
import Discover from 'src/pages/discover';
import LoanDetail from 'src/pages/loanDetail';
import Loans from 'src/pages/loans';
import MyAsset from 'src/pages/myAsset';
import SubmitWhitelist from 'src/pages/submitWhitelist';

export interface RouteProps {
  path: string;
  component: (props?: any) => JSX.Element;
}

const routes: Array<RouteProps> = [
  {
    path: APP_URL.HOME,
    component: Home,
  },
  {
    path: APP_URL.NFT_LENDING,
    component: Discover,
  },
  {
    path: APP_URL.NFT_LENDING_LIST_LOAN,
    component: Loans,
  },
  {
    path: APP_URL.NFT_LENDING_DETAIL_LOAN,
    component: LoanDetail,
  },
  {
    path: APP_URL.NFT_LENDING_MY_NFT,
    component: MyAsset,
  },
  {
    path: APP_URL.NFT_LENDING_SUBMIT_WHITELIST,
    component: SubmitWhitelist,
  },
];

export default routes;