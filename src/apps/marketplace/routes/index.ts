import { RouteProps } from "src/navigation/routes";
import { APP_URL } from "../constants/url";
import Dashboard from "../pages/dashboard";
import MarketplaceHome from "../pages/home";

const routes: Array<RouteProps> = [
  {
    path: APP_URL.HOME,
    component: MarketplaceHome,
  },
  {
    path: APP_URL.DASHBOARD,
    component: Dashboard,
  },
];

export default routes;
