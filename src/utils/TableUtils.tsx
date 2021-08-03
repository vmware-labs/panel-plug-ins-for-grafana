/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import { DataFrame, InterpolateFunction, toDataFrame } from '@grafana/data';
import { Keyable } from '../types';
import { cloneDeep } from 'lodash';
import React from 'react';
// Get the data in the appropriate form depending on the users query
// If the user made a default query, use the getDataFrame function
// Else user queried a field, use the getData function
export const getData = (data: any, query: string, isLightMode: boolean, replaceVariables: InterpolateFunction) => {
  if (query === 'default') {
    return getDataFrameInMaterialForm(data, isLightMode, replaceVariables);
  } else {
    return getDataInMaterialForm(data, isLightMode, replaceVariables);
  }
};

// Using the data from users selected array returns a formatted object containing data and column to pass MaterialTable
// Deep clone tableData because material ui will modify the data it is passed
// Convert tableData to dataframe and map fields into a columns array for the Material Table component
export const getDataInMaterialForm = (data: object[], isLightMode: boolean, replaceVariables: InterpolateFunction) => {
  const clonedTableData = cloneDeep(data);
  const df = toDataFrame(clonedTableData);
  const columns = isLightMode ? getColumnsFromData(df.fields, replaceVariables) : getColumnsFromDataDarkMode(df.fields);

  // return an object containing columns and data for the material-table
  return {
    columns: columns,
    formattedData: clonedTableData,
  };
};

// Get the data from the dataframe in the form required by material-table
// Utilized for the Default query option when user wants entire DataFrame displayed
export const getDataFrameInMaterialForm = (
  data: DataFrame,
  isLightMode: boolean,
  replaceVariables: InterpolateFunction
) => {
  // For every row of data, initializes a new row data object and adds cur field's data to it
  const tableData = data.fields;
  const columns = isLightMode ? getColumnsFromData(tableData, replaceVariables) : getColumnsFromDataDarkMode(tableData);
  const formattedData: any = [];
  for (let i = 0; i < data.length; i++) {
    const curRowData: Keyable = {};
    tableData.forEach((field) => {
      const curValue = field.values.get(i);
      if (Array.isArray(curValue) || (typeof curValue === 'object' && curValue !== null)) {
        curRowData[field.name] = '[object Object]';
      } else {
        curRowData[field.name] = curValue;
      }
      if (field.config.links !== undefined) {
        curRowData['url'] = field.config.links[0]?.url;
      }
    });
    formattedData.push(curRowData);
  }

  return {
    columns: columns,
    formattedData: formattedData,
  };
};

// Given an array of data, it will create an array of objects with the name of each field as title/field keys
// Will be passed to material-table which accepts it as columns
export const getColumnsFromData = (data: any[], replaceVariables: InterpolateFunction) => {
  const columns = data.map((field) => {
    return {
      title: field.config.displayName ? field.config.displayName : field.name,
      field: field.name,
      render: field.config.links?.length
        ? (rowData: any) => renderURL(rowData, field.name, replaceVariables)
        : undefined,
      //render: field.config.links?.length > 0 ? rowData => <Link to="/{rowData.url}" >view</Link> : undefined
    };
  });

  return columns;
};

const renderURL = (rowData: any, columnName: string, replaceVariables: InterpolateFunction) => {
  const url = replaceVariables(rowData.url);
  return (
    <a href={url} style={{ textDecoration: 'none' }}>
      {rowData[columnName]}
    </a>
  );
};

// Same as getColumns above, however adds a dark theme to each cell and header
export const getColumnsFromDataDarkMode = (data: any[]) => {
  const columns = data.map((field) => {
    return {
      title: field.config.displayName ? field.config.displayName : field.name,
      field: field.name,
      cellStyle: {
        backgroundColor: '#181818',
        color: '#FFF',
      },
    };
  });
  return columns;
};
