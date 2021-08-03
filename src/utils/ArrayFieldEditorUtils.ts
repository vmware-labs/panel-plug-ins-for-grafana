/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import { DataFrame, SelectableValue } from '@grafana/data';

// A field is valid if it is of type array, contains atleast one element, and its data is of type object
export const getArrayFieldsAsList = (fields: any[]) => {
  const arrayFields = fields.filter((f) => {
    const fieldValues = f.values.get(0);
    return Array.isArray(fieldValues) && fieldValues.length >= 1 && fieldValues.every((val) => typeof val === 'object');
  });

  return arrayFields;
};

// Given an array of fields, create a list of objects format { label: string, value: string }
// To be passed to Grafana Select menu component
export const addFieldsToOptions = (options: any[], arrayFields: any[]) => {
  for (let i = 0; i < arrayFields.length; i++) {
    options.push({
      label: arrayFields[i].name.toString(),
      value: arrayFields[i].name.toString(),
    });
  }
  return options;
};

export const generateOptionsList = (data: DataFrame | undefined, options: Array<SelectableValue<string>>) => {
  // If the DataFrame is not undefined, and it contains atleast one field
  if (data) {
    const listOfAllFields = data.fields;

    // Grab all array fields
    const listOfArrayFields = getArrayFieldsAsList(listOfAllFields);

    // Populate options array with SelectableValue objects labeled with each fields name
    addFieldsToOptions(options, listOfArrayFields);
  }
};

export const doesFieldExistInOptions = (currentField: string, options: Array<SelectableValue<string>>): boolean => {
  if (options.find((option) => option.value === currentField) === undefined) {
    return false;
  }
  return true;
};
