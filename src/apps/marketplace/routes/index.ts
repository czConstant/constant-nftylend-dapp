import { RouteProps } from "src/navigation/routes";
import { APP_URL } from "../constants/url";
import MarketplaceHome from "../pages/home";

const routes: Array<RouteProps> = [
  {
    path: APP_URL.HOME,
    component: MarketplaceHome,
  },
];

export default routes;