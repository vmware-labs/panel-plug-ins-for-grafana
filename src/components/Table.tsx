/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import MaterialTable from 'material-table';
import { getData } from '../utils/TableUtils';
import { useTheme } from '@grafana/ui';
import { InterpolateFunction } from '@grafana/data';

type TableProps = {
  data: any;
  userSelectedField: string;
  options: any;
  title: string;
  replaceVariables: InterpolateFunction;
};

// Table component that is given either a DataFrame or array of objects to display
// Returns a MaterialTable component displaying the reformatted data from props
export const Table = (props: TableProps) => {
  const theme = useTheme();
  let tableData = getData(props.data, props.userSelectedField, theme.isLight, props.replaceVariables);
  let style = {};
  if (theme.isDark) {
    props.options.headerStyle = {
      backgroundColor: '#404040',
      color: '#FFF',
    };
    props.options.searchFieldStyle = {
      color: '#FFF',
    };
    style = { background: '#121212' };
  }
  return (
    <MaterialTable
      style={style}
      title=""
      data={tableData.formattedData}
      columns={tableData.columns}
      options={props.options}
    />
  );
};
