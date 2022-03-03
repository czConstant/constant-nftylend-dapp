import React, { useState, useRef, ChangeEvent } from 'react';
import { Dropdown } from 'react-bootstrap';
import cx from 'classnames';
import FormGroup from 'react-bootstrap/FormGroup';

// import ErrorOverlay from 'src/components/errorOverlay';
// import EmptyList from 'src/components/emptyList';

import styles from './styles.module.scss';
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
  const target = useRef(null);
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
    <FormGroup className={cx(styles.formGroup)}>
      <Dropdown
        ref={target}
        className={cx(styles.dropdownWrapper, className, shouldShowError && styles.borderDanger)}
        onToggle={()=> {
          setSearch('');
          setTimeout(() => {
            const el = document.getElementById(`dropdown-search-${name}`);
            if (el) el.focus();
          }, 0);
        }}
      >
        <Dropdown.Toggle
          name={name}
          className={styles.dropdownToggle}
          variant="basic"
          onFocus={() => onFocus ? onFocus(): null}
          onBlur={() => onBlur ? onBlur(): null}
          disabled={disabled}
        >
          {selectedItem.activeLabel || selectedItem[_labelField] || placeholder}
        </Dropdown.Toggle>
        <Dropdown.Menu
          className={cx(dropdownClassName, styles.menu, styles[alignMenu || ''])}
          style={{ minWidth: menuMinWidth || '100%' }}
        >
          {typeof searchable !== 'undefined' && (<>
            <div className={styles.searchBox}>
              <input placeholder="Search" value={search} id={`dropdown-search-${name}`} onChange={onSearchChange} autoFocus />
              <i className="far fa-search" />
            </div>
            <div className={styles.divider} />
          </>)}
          {filteredList.length > 0
            ? filteredList.map((item: any, index: number) => (item && (
              <Dropdown.Item
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
              </Dropdown.Item>
            )))
            : <EmptyList labelText="No result" />
          }
        </Dropdown.Menu>
      </Dropdown>
      {/* <ErrorOverlay placement="bottom" target={target} shouldShowError={shouldShowError} error={error} zIndex={zIndex} /> */}
    </FormGroup>
  );
};

export default FieldDropdown;
