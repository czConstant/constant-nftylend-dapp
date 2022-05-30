import React, { useState } from "react";
import { ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import queryString from "query-string";

import styles from "./styles.module.scss";
import { APP_URL } from "src/common/constants/url";

const SortByItems = [
  {
    id: "created_at",
    label: "Recently Listed",
  },
  {
    id: "principal_amount",
    label: "Principal: Low to High",
  },
  {
    id: "-principal_amount",
    label: "Principal: High to Low",
  },
];

const LoansToolbar = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const _sortBy = queryString.parse(location.search)?.sortBy;
  const [sortBy, setShortBy] = useState(
    SortByItems.find((v) => v.id === _sortBy) || SortByItems[0]
  );

  const onSort = (item: any) => {
    setShortBy(item);
    const params = queryString.parse(location.search);
    const url = queryString.stringifyUrl({
      url: APP_URL.LIST_LOAN,
      query: {
        ...params,
        sort: item.id,
      },
    });

    return navigate(url.toString());
  };

  return (
    <div className={styles.toolbarContainer}>
      <DropdownButton
        as={ButtonGroup}
        id={`dropdown-variants-`}
        title={sortBy.label}
        className={styles.sortByDropdown}
      >
        {SortByItems.map((item) => (
          <Dropdown.Item
            key={item.id}
            eventKey={item.id}
            onClick={() => onSort(item)}
            active={item.id === sortBy.id}
          >
            {item.label}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
};

export default LoansToolbar;
