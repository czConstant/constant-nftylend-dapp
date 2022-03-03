import React from "react";
import { APP_URL } from "src/common/constants/url";

import Home from 'src/pages/home';
import MyAsset from 'src/pages/myAsset';

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
    component: Home,
  },
  {
    path: APP_URL.NFT_LENDING_MY_NFT,
    component: MyAsset,
  }
];

export default routes;