import { APP_URL } from "src/common/constants/url";

import About from 'src/apps/pawn/pages/about';
import Home from 'src/apps/pawn/pages/home';
import Discover from 'src/apps/pawn/pages/discover';
import LoanDetail from 'src/apps/pawn/pages/loanDetail';
import ListingLoans from 'src/apps/pawn/pages/listingLoans';
import SubmitWhitelist from 'src/apps/pawn/pages/submitWhitelist';
import TermsOfService from "src/apps/pawn/pages/termsOfService";
import FAQs from 'src/apps/pawn/pages/faqs';
import Dashboard from 'src/apps/pawn/pages/dashboard';
import Voting from "src/apps/pawn/pages/voting";
import MakeProposal from "src/apps/pawn/pages/voting/makeProposal";
import VotingDetail from "src/apps/pawn/pages/voting/detail";
import ApplyAffiliate from 'src/apps/pawn/pages/applyAffiliate';
import VerifyEmail from 'src/apps/pawn/pages/verifyEmail';
import PageBorrower from 'src/apps/pawn/pages/borrower';

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
    path: APP_URL.DASHBOARD + '/*',
    component: Dashboard,
  },
  {
    path: APP_URL.VOTING,
    component: Voting,
  },
  {
    path: APP_URL.VOTING_PROPOSAL_MAKE,
    component: MakeProposal,
  },
  {
    path: APP_URL.VOTING_DETAIL,
    component: VotingDetail,
  },
  {
    path: APP_URL.APPLY_AFFILIATE,
    component: ApplyAffiliate,
  },
  {
    path: APP_URL.VERIFY_EMAIL,
    component: VerifyEmail,
  },
  {
    path: APP_URL.BORROWER,
    component: PageBorrower,
  }
];

export default routes;
