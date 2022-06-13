import { APP_URL } from 'src/common/constants/url';

import About from 'src/pages/about';
import Home from 'src/pages/home';
import Discover from 'src/pages/discover';
import LoanDetail from 'src/pages/loanDetail';
import ListingLoans from 'src/pages/listingLoans';
import MyAsset from 'src/pages/myAsset';
import SubmitWhitelist from 'src/pages/submitWhitelist';
import TermsOfService from "src/pages/termsOfService";
import FAQs from 'src/pages/faqs';
import Dashboard from 'src/pages/dashboard';

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
    path: APP_URL.PAWN_PROTOCOL,
    component: About,
  },
  {
    path: APP_URL.DISCOVER,
    component: Discover,
  },
  {
    path: APP_URL.LIST_LOAN,
    component: ListingLoans,
  },
  {
    path: APP_URL.DETAIL_LOAN,
    component: LoanDetail,
  },
  // {
  //   path: APP_URL.MY_NFT,
  //   component: MyAsset,
  // },
  {
    path: APP_URL.SUBMIT_WHITELIST,
    component: SubmitWhitelist,
  },
  {
    path: APP_URL.TERM_OF_SERVICE,
    component: TermsOfService,
  },
  {
    path: APP_URL.FAQS,
    component: FAQs,
  },
  {
    path: APP_URL.DASHBOARD,
    component: Dashboard,
  },
];

export default routes;