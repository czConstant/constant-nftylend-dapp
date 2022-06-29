import React, { useState, useRef, ChangeEvent } from 'react';
import { Box, Flex, FormControl, FormErrorMessage, Icon, Input, InputGroup, InputRightElement, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { FaCaretDown, FaSearch } from 'react-icons/fa';
import EmptyList from '../emptyList';

interface FieldDropdownProps {
  input?: any;
  meta?: any;
  label?: string;
  placeholder?: string;
  alignMenu?:string;
  menuMinWidth?: number;
  className?:string;
  dropdownClassName?:string;
  list: Array<any>;
  labelField?: string;
  valueField?: string;
  searchable?: boolean;
  searchFields: Array<string>;
  disabled?: boolean;
  value?: any;
  defaultValue?: any;
  onChange: Function;
  onChangeValue: Function;
  handleOnChange: Function;
  handleItemOnChange: Function;
  handleSearch: Function;
}

const FieldDropdown = (props: FieldDropdownProps) => {
  const {
    input, meta, placeholder, alignMenu = '', menuMinWidth,
    dropdownClassName, list ,className, handleOnChange, handleItemOnChange, defaultValue,
    disabled, valueField, labelField, handleSearch, searchable, searchFields = [],
    value = null, onChangeValue = () => null, onChange = () => null
  } = props;
  const target = useRef();
  const [search, setSearch] = useState('');

  const { onChange: onReduxChange, onBlur, onFocus, value: reduxValue, name } = input || {};
  const _list = list || [];
  const { error, touched } = meta || {};
  const shouldShowError = !!(touched && error);
  
  const _valueField = valueField ? valueField : 'value';
  const _labelField = labelField? labelField : 'label';
  const isRefuxField = input !== undefined;

  const selectedItem = isRefuxField ? _list.find(e => {
    if(typeof reduxValue === 'object'){
      return e[_valueField] == (reduxValue[_valueField] || defaultValue);
    }
    return e[_valueField] == (reduxValue || defaultValue);
  }) || {} : value || {};

  const filterList = (arr: Array<any>) => {
    if (typeof handleSearch !== 'undefined') {
      return handleSearch(arr, search);
    }
    return search.trim() === '' ? arr : arr.filter(e => {
      let matched = false;
      for(let i of searchFields){
        matched = (typeof e[i] === 'string') ? e[i].toLowerCase().indexOf(search.toLocaleLowerCase()) >= 0 : false;
        if(matched) break;
      }
      return matched;
    });
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredList = filterList(_list);

  return (
    <FormControl isInvalid={shouldShowError}>
      <Menu
        autoSelect={false}
        onOpen={()=> {
          setSearch('');
          setTimeout(() => {
            const el = document.getElementById(`dropdown-search-${name}`);
            if (el) el.focus();
          }, 0);
        }}
      >
        <MenuButton
          ref={target}
          w='100%'
          h='45px'
          borderWidth={1}
          borderColor={shouldShowError ? 'brand.danger.400' : '#dedfe5'}
          borderRadius={8}
          bgColor='background.default'
          px={4}
          textAlign='left'
          type='button'
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
        >
          <Flex alignItems='center'>
            <Box flex={1}>{selectedItem.activeLabel || selectedItem[_labelField] || placeholder}</Box>
            <Icon fontSize='sm' color='text.secondary' as={FaCaretDown} />
          </Flex>
        </MenuButton>
        <MenuList w={`${target.current && target.current.getBoundingClientRect().width}px`} zIndex={2000}>
          {typeof searchable !== 'undefined' && (
            <InputGroup mb={2} px={2}>
              <Input border='none' bgColor='black' flex={1} placeholder="Search" value={search} id={`dropdown-search-${name}`} onChange={onSearchChange} autoFocus />
              <InputRightElement children={<Icon as={FaSearch} color='text.secondary' fontSize='sm' />} />
            </InputGroup>
          )}
          {filteredList.length > 0
            ? filteredList.map((item: any, index: number) => (item && (
              <MenuItem
                name={item[_valueField]}
                disabled={item?.disabled}
                key={name + index + item.id}
                onClick={() => {
                  if (isRefuxField) {
                    onReduxChange(item[_valueField]);
                  } else {
                    onChange(item);
                    onChangeValue(item[_valueField]);
                  }
                  if (typeof handleItemOnChange === 'function') {
                    handleItemOnChange(item);
                  } else {
                    if (typeof handleOnChange === 'function') {
                      handleOnChange(item[_valueField]);
                    }
                    if (typeof item?.onClick === 'function') {
                      item?.onClick();
                    }
                  }
                }}
                value={item[_valueField]}
              >
                {item[_labelField]}
              </MenuItem>
            )))
            : <EmptyList labelText="No result" />
          }
        </MenuList>
      </Menu>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default FieldDropdown;
