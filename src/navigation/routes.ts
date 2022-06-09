import { APP_URL } from "src/common/constants/url";

import Home from "src/pages/home";
import Discover from "src/pages/discover";
import LoanDetail from "src/pages/loanDetail";
import Loans from "src/pages/loans";
import MyAsset from "src/pages/myAsset";
import SubmitWhitelist from "src/pages/submitWhitelist";
import TermsOfService from "src/pages/termsOfService";
import FAQs from "src/pages/faqs";
import Voting from "src/pages/voting";
import MakeProposal from "src/pages/voting/makeProposal";
import VotingDetail from "src/pages/voting/detail";

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
  {
    path: APP_URL.NFT_LENDING_TERM_OF_SERVICE,
    component: TermsOfService,
  },
  {
    path: APP_URL.NFT_LENDING_FAQS,
    component: FAQs,
  },
  {
    path: APP_URL.NFT_LENDING_VOTING,
    component: Voting,
  },
  {
    path: APP_URL.NFT_LENDING_VOTING_PROPOSAL_MAKE,
    component: MakeProposal,
  },
  {
    path: APP_URL.NFT_LENDING_VOTING_DETAIL,
    component: VotingDetail,
  },
];

export default routes;
