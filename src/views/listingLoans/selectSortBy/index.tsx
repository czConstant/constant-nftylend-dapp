import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

import { Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { FaCaretDown } from 'react-icons/fa';

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

const SelectSortBy = ({ defaultValue, onChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sortBy, setShortBy] = useState(
    SortByItems.find((v) => v.id === defaultValue) || SortByItems[0]
  );

  const onSort = (item: any) => {
    setShortBy(item);
    if (onChange) onChange(item.id)
    // const params = queryString.parse(location.search);
    // const url = queryString.stringifyUrl({
    //   url: APP_URL.LIST_LOAN,
    //   query: {
    //     ...params,
    //     sort: item.id,
    //   },
    // });

    // return navigate(url.toString());
  };

  return (
    <Menu variant='outline'>
      <MenuButton h='40px' minW='120px'>
        <Flex alignItems='center' justifyContent='space-between' pl={4} pr={2}>
          <Text>{sortBy?.label || 'Sort by'}</Text>
          <Icon fontSize='xl' as={FaCaretDown} />
        </Flex>
      </MenuButton>
      <MenuList>
        {SortByItems.map(e => (
          <MenuItem key={e.id} onClick={() => onSort(e)}>{e.label}</MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default SelectSortBy;
