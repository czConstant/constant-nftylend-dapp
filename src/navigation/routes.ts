import { APP_URL } from 'src/common/constants/url';

import About from 'src/pages/about';
import Discover from 'src/pages/discover';
import LoanDetail from 'src/pages/loanDetail';
import Loans from 'src/pages/loans';
import MyAsset from 'src/pages/myAsset';
import SubmitWhitelist from 'src/pages/submitWhitelist';
import TermsOfService from "src/pages/termsOfService";
import FAQs from 'src/pages/faqs';

export interface RouteProps {
  path: string;
  component: (props?: any) => JSX.Element;
}

const routes: Array<RouteProps> = [
  {
    path: APP_URL.HOME,
    component: Discover,
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
    component: Loans,
  },
  {
    path: APP_URL.DETAIL_LOAN,
    component: LoanDetail,
  },
  {
    path: APP_URL.MY_NFT,
    component: MyAsset,
  },
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
];

export default routes;