/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import { DataFrame, SelectableValue } from '@grafana/data';

export const generateOptionsList = (data: DataFrame[], options: Array<SelectableValue<string>>) => {
  data.forEach((query) => {
    options.push({
      label: query.refId ? query.refId : 'Transformation',
      value: query.refId ? query.refId : 'Transformation',
    });
  });
};
