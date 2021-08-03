/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Select } from '@grafana/ui';
import { StandardEditorProps, SelectableValue } from '@grafana/data';
import { generateOptionsList, doesFieldExistInOptions } from '../utils/ArrayFieldEditorUtils';
import { dataFrameSubject } from '../subjects/dataFrameSubject';

/*
  A custom editor which displays a select menu containing only the fields of type array
  within the data series for users to choose from.
*/
export const ArrayFieldEditor: React.FC<StandardEditorProps<string>> = ({ item, value, onChange, context }) => {
  let options: Array<SelectableValue<string>> = [{ label: 'Default', value: 'default' }];
  const [currentDataFrame, setData] = useState();
  const updateCurrentData = (newData: any) => {
    setData((currentDataFrame) => newData);
  };

  /* 
    Subscribes to the dataFrameSubject
    Whenever the user selects a query they want to use under the display menu
    The code wrapped in this subscription will get fired and update the dataframe
    Whos values are listed in the field select menu
  */
  dataFrameSubject.getData().subscribe((dataMessage: any) => {
    const { dataFrame } = dataMessage.value;
    updateCurrentData(dataFrame);
  });

  generateOptionsList(currentDataFrame, options);

  // Set value to default if the previous value is not in the new DataFrame's options list
  if (doesFieldExistInOptions(value, options) === false) {
    value = 'default';
  }

  return <Select options={options} value={value} onChange={(selectableValue) => onChange(selectableValue.value)} />;
};
