/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { DataFrame, InterpolateFunction } from '@grafana/data';
import { Table } from '../components/Table';
import { getArithmeticOperationResult } from './ArithmeticOperationsUtils';
import { cloneDeep } from 'lodash';

/*  
  Returns display component to render on the grafana panel
  If the data is null, component will state error "No data"
  If user has not selected an option (this will be later replaced by a default option) the display component will display a prompt to user to select
  Else if the data is valid and user selects field, the display component will be a material-table loaded with the user's query field
*/
export const getDisplayComponent = (
  dataFrame: DataFrame,
  selectedField: string,
  arithmeticData: any,
  replaceVariables: InterpolateFunction
) => {
  if (dataFrame === undefined) {
    return <h1>No data</h1>;
  } else {
    const { data, userSelectedField } = getDisplayDataByField(dataFrame, selectedField);
    let deepCloneData = cloneDeep(data);
    if (arithmeticData) {
      deepCloneData = getArithmeticOperationResult(deepCloneData, arithmeticData);
      console.log(deepCloneData);
    }
    return (
      <Table
        data={deepCloneData}
        userSelectedField={userSelectedField}
        options={getMaterialTableOptions()}
        title={userSelectedField}
        replaceVariables={replaceVariables}
      />
    );
  }
};

// Given a dataframe and field name, this will extract the values from the matching field
export const getDisplayDataByField = (dataFrame: DataFrame | undefined, fieldName: string) => {
  if (fieldName === 'default' || undefined) {
    return {
      data: dataFrame,
      userSelectedField: 'default',
    };
  }

  // Field did not exist in this DataFrame, do default instead
  const listOfFields = dataFrame?.fields;
  const chosenField = listOfFields?.find((field) => field.name === fieldName);
  const fieldValues = chosenField?.values.get(0);
  if (fieldValues === undefined) {
    return {
      data: dataFrame,
      userSelectedField: 'default',
    };
  } else {
    return {
      data: fieldValues,
      userSelectedField: fieldName,
    };
  }
};

/*
  Given the users chosen query, grab the DataFrame from the list of DataFrames
  which matches the query name.
  1st branch returns first query if user hasnt yet selected one
  2nd branch checks for a transformation, if so will return the transofmation DataFrame
  3rd branch searches for the dataframe matching the query, will return undefined if no match found
*/
export const getDataFrameFromQuery = (dataFrameList: DataFrame[], queryName: string): DataFrame | undefined => {
  // TODO: see how to identify transformation here, and return that if it exists
  if (queryName === undefined || dataFrameList.length === 1) {
    return dataFrameList[0];
  } else {
    let dataFrame = dataFrameList.find((dataFrame) => {
      return dataFrame.refId === queryName;
    });
    return dataFrame;
  }
};

// Returns the options required for the material-table component
export const getMaterialTableOptions = () => {
  return {
    search: true,
    paging: true,
    exportButton: true,
    headerStyle: { backgroundColor: '#fff', color: '#000' },
  };
};
