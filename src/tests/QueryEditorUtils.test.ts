/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import { DataFrame, SelectableValue, toDataFrame } from '@grafana/data';
import { generateOptionsList } from 'utils/QueryEditorUtils';

// Test data ---------------------------------------------------
const testArrayCPU = [
  { CPU: 21, PID: 4624, SessionId: 2 },
  { CPU: 1, PID: 5712, SessionId: 4 },
];

const testArrayMemory = [
  { CPU: 21, PID: 4624, SessionId: 2 },
  { CPU: 1, PID: 5712, SessionId: 4 },
];
// DataFrame to be in the array of DataFrames
const testDataFrameA = toDataFrame({
  name: 'dataframe',
  fields: [
    { name: 'topCPUConsumers', type: 'string', values: [testArrayCPU] },
    { name: 'topMemConsumers', type: 'string', values: [testArrayMemory] },
    { name: '@timestamp', type: 'time', values: ['2021-05-28T17:15:33.517459700+00:00'] },
  ],
});

// DataFrame to be in the array of DataFrames
const testDataFrameB = toDataFrame({
  name: 'dataframe',
  fields: [
    { name: 'topCPUConsumers', type: 'string', values: [testArrayCPU] },
    { name: 'topMemConsumers', type: 'string', values: [testArrayMemory] },
    { name: '@timestamp', type: 'time', values: ['2021-05-28T17:15:33.517459700+00:00'] },
  ],
});

const testDataFrameArray: DataFrame[] = [testDataFrameA, testDataFrameB];

// Tests --------------------------------------------------------
describe('Get array fields as list', () => {
  it('should return an empty list when given an empty DataFrame array', () => {
    const expectedList: Array<SelectableValue<string>> = [];
    let receivedOptions: Array<SelectableValue<string>> = [];
    generateOptionsList([], receivedOptions);
    expect(receivedOptions).toEqual(expectedList);
  });
  it('should return a list populated with each DataFrames refId', () => {
    testDataFrameA.refId = 'A';
    testDataFrameB.refId = 'B';
    const expectedList: Array<SelectableValue<string>> = [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
    ];
    let receivedOptions: Array<SelectableValue<string>> = [];
    generateOptionsList(testDataFrameArray, receivedOptions);
    expect(receivedOptions).toEqual(expectedList);
  });
  it('should return a list with one option as Transformation when given an undefined refId', () => {
    const testTransformationDataFrame = toDataFrame({
      name: 'dataframe',
      fields: [
        { name: '@timestamp', type: 'time', values: ['2021-05-28T17:15:33.517459700+00:00'] },
        { name: 'value', type: 'number', values: [0] },
      ],
    });
    testTransformationDataFrame.refId = undefined;
    const mockTransformationArray = [testTransformationDataFrame];
    const expectedList: Array<SelectableValue<string>> = [{ label: 'Transformation', value: 'Transformation' }];
    let receivedOptions: Array<SelectableValue<string>> = [];
    generateOptionsList(mockTransformationArray, receivedOptions);
    expect(receivedOptions).toEqual(expectedList);
  });
});
