/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Select } from '@grafana/ui';
import { StandardEditorProps, SelectableValue } from '@grafana/data';
import { dataFrameSubject } from 'subjects/dataFrameSubject';
//import { selectedFieldSubject } from 'subjects/selectedFieldSubject';
import { generateOptionsList, getOperationsOptions } from 'utils/ArithmeticFieldEditorUtils';
import { getDisplayDataByField } from 'utils/SimplePanelUtils';
import { doesFieldExistInOptions } from '../utils/ArrayFieldEditorUtils';

/* 
  A Grafana UI Select menu with the list of column names in the current Table
  The selected column will be used in the arithmetic operation as the first field
  Uses a subject for getting data on the current selected field in the dataframe
  The subject subscribe function fired whenever a change is made
*/
export const ArithmeticFirstFieldEditor: React.FC<StandardEditorProps<string>> = ({ value, onChange, context }) => {
  let options: Array<SelectableValue<string>> = [];

  const [currentField, setField] = useState();
  const updateCurrentField = (newField: any) => {
    setField((currentField) => newField);
  };

  dataFrameSubject.getData().subscribe((dataMessage: any) => {
    const { dataFrame, selectedField } = dataMessage.value;
    const currentFieldData = getDisplayDataByField(dataFrame, selectedField);
    updateCurrentField(currentFieldData.data);
  });
  generateOptionsList(currentField, options);
  // Set value to default if the previous value is not in the new DataFrame's options list
  if (doesFieldExistInOptions(value, options) === false && value !== undefined) {
    if (options[0]) {
      value = options[0]?.value!;
      onChange(value);
    }
  }
  return <Select options={options} value={value} onChange={(selectableValue) => onChange(selectableValue.value)} />;
};

/* 
  A Grafana UI Select menu with the list of column names in the current Table
  The selected column will be used in the arithmetic operation as the second field
*/
export const ArithmeticSecondFieldEditor: React.FC<StandardEditorProps<string>> = ({ value, onChange, context }) => {
  let options: Array<SelectableValue<string>> = [];

  const [currentField, setField] = useState();
  const updateCurrentField = (newField: any) => {
    setField((currentField) => newField);
  };

  dataFrameSubject.getData().subscribe((dataMessage: any) => {
    const { dataFrame, selectedField } = dataMessage.value;
    const currentFieldData = getDisplayDataByField(dataFrame, selectedField);
    updateCurrentField(currentFieldData.data);
  });
  generateOptionsList(currentField, options);

  // Set value to default if the previous value is not in the new DataFrame's options list
  if (doesFieldExistInOptions(value, options) === false && value !== undefined) {
    if (options[0]) {
      value = options[0].value!;
      onChange(value);
    }
  }
  return <Select options={options} value={value} onChange={(selectableValue) => onChange(selectableValue.value)} />;
};

/* 
  A Grafana UI Select menu with the list of arithmetic operations available
  Includes Addition, Subtraction, Multiplication, and Division
*/
export const ArithmeticOperationEditor: React.FC<StandardEditorProps<string>> = ({ value, onChange, context }) => {
  let options: Array<SelectableValue<string>> = getOperationsOptions();

  return <Select options={options} value={value} onChange={(selectableValue) => onChange(selectableValue.value)} />;
};
