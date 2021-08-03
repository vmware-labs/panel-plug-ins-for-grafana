/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import { SelectableValue, toDataFrame } from '@grafana/data';
import { cloneDeep } from 'lodash';
import { addFieldsToOptions } from './ArrayFieldEditorUtils';

export const getNumericFields = (fields: any[]) => {
  const numericFields = fields.filter((f) => {
    const fieldValue = f.values.get(0);
    console.log(`value is ${fieldValue}`);
    return isNaN(fieldValue) === false && fieldValue !== undefined;
  });
  return numericFields;
};

export const generateOptionsList = (data: any, options: Array<SelectableValue<string>>) => {
  // If the DataFrame is not undefined, and it contains atleast one field
  if (data) {
    let listOfAllFields = data.fields;

    // Grab all array fields
    if (!listOfAllFields) {
      const clonedTableData = cloneDeep(data);
      const tableDataAsDataFrame = toDataFrame(clonedTableData);
      listOfAllFields = tableDataAsDataFrame.fields;
      // TODO get the two cases: default dataframe or the field given is the array of objects
    }
    //const listOfNumericFields = getNumericFields(listOfAllFields);
    addFieldsToOptions(options, listOfAllFields);
  }
};

export const getOperationsOptions = () => {
  return [
    { label: '+', value: 'Sum' },
    { label: '-', value: 'Difference' },
    { label: '*', value: 'Product' },
    { label: '/', value: 'Quotient' },
  ];
};
