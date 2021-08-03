/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Select } from '@grafana/ui';
import { StandardEditorProps, SelectableValue } from '@grafana/data';
import { generateOptionsList } from '../utils/QueryEditorUtils';

/*
  A custom editor which displays a select menu containing the list of dataframes the user can display
  There will be a DataFrame listed for each query the user made on Grafana
*/
export const QueryEditor: React.FC<StandardEditorProps<string>> = ({ item, value, onChange, context }) => {
  let options: Array<SelectableValue<string>> = [];
  // Adds the list of query names to the list of options
  generateOptionsList(context.data, options);

  // Default to the first option if there is only one Query
  if (options.length === 1) {
    value = options[0].value!;
  }
  return <Select options={options} value={value} onChange={(selectableValue) => onChange(selectableValue.value)} />;
};
