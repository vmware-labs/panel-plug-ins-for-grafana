/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import { DataFrame, SelectableValue, toDataFrame } from '@grafana/data';
import {
  generateOptionsList,
  addFieldsToOptions,
  getArrayFieldsAsList,
  doesFieldExistInOptions,
} from '../utils/ArrayFieldEditorUtils';

// Test data ---------------------------------------------------
const testArrayCPU = [
  { CPU: 21, PID: 4624, SessionId: 2 },
  { CPU: 1, PID: 5712, SessionId: 4 },
];

const testArrayMemory = [
  { CPU: 21, PID: 4624, SessionId: 2 },
  { CPU: 1, PID: 5712, SessionId: 4 },
];
// DataFrame to mock the resulting query in Grafana
const testDataFrame = toDataFrame({
  name: 'dataframe',
  fields: [
    { name: 'topCPUConsumers', type: 'string', values: [testArrayCPU] },
    { name: 'topMemConsumers', type: 'string', values: [testArrayMemory] },
    { name: '@timestamp', type: 'time', values: ['2021-05-28T17:15:33.517459700+00:00'] },
  ],
});

const testDataFrameNoArrays = toDataFrame({
  name: 'dataframe',
  fields: [
    { name: '@timestamp', type: 'time', values: ['2021-05-28T17:15:33.517459700+00:00'] },
    { name: 'id', type: 'string', values: ['1234A'] },
  ],
});

// Test --------------------------------------------------------
describe('Get array fields as list', () => {
  it('should return a list containing fields which are of type array', () => {
    const expectedList = [testDataFrame.fields[0], testDataFrame.fields[1]]; //testDataFrame.fields.splice(0, 2);
    const receivedList = getArrayFieldsAsList(testDataFrame.fields);
    expect(receivedList).toEqual(expectedList);
  });
  it('should return an empty array when passed an empty array', () => {
    const expectedList: any[] = [];
    const receivedList = getArrayFieldsAsList([]);
    expect(receivedList).toEqual(expectedList);
  });
  it('should return an empty array when passed an array with no fields of type array', () => {
    const expectedList: any[] = [];
    const receivedList = getArrayFieldsAsList(testDataFrameNoArrays.fields);
    expect(receivedList).toEqual(expectedList);
  });
});

describe('Add fields to options', () => {
  it('should append an option object to options array for each item in arrayFields', () => {
    const options: any[] = [];
    const arrayFields = getArrayFieldsAsList(testDataFrame.fields);
    const expectedList = [
      { label: 'topCPUConsumers', value: 'topCPUConsumers' },
      { label: 'topMemConsumers', value: 'topMemConsumers' },
    ];
    const receivedList = addFieldsToOptions(options, arrayFields);
    expect(receivedList).toEqual(expectedList);
  });
});

describe('Generate options list', () => {
  it('should create an empty list for an undefined dataframe', () => {
    let data: DataFrame;
    let options: Array<SelectableValue<string>> = [];
    generateOptionsList(data!, options);

    expect(options).toEqual([]);
  });

  it('should populate options with all array type fields without removing existing ones', () => {
    let options: Array<SelectableValue<string>> = [{ label: 'Default', value: 'default' }];
    generateOptionsList(testDataFrame, options);
    const expectedList = [
      { label: 'Default', value: 'default' },
      { label: 'topCPUConsumers', value: 'topCPUConsumers' },
      { label: 'topMemConsumers', value: 'topMemConsumers' },
    ];

    expect(options).toEqual(expectedList);
  });

  it('should not add options if none of the fields are type array, while keeping existing options', () => {
    let options: Array<SelectableValue<string>> = [{ label: 'Default', value: 'default' }];
    generateOptionsList(testDataFrameNoArrays, options);
    const expectedList: Array<SelectableValue<string>> = [{ label: 'Default', value: 'default' }];

    expect(options).toEqual(expectedList);
  });
});

describe('doesFieldExistInOptions', () => {
  it('should return false if the given field name does not exist as a value in one of the options', () => {
    let options: Array<SelectableValue<string>> = [{ label: 'Default', value: 'default' }];
    const receivedResult = doesFieldExistInOptions('topCPUConsumers', options);

    expect(receivedResult).toEqual(false);
  });

  it('should return false if the given field name does not exist as a value in one of the options', () => {
    let options: Array<SelectableValue<string>> = [
      { label: 'Default', value: 'default' },
      { label: 'topCPUConsumers', value: 'topCPUConsumers' },
    ];
    const receivedResult = doesFieldExistInOptions('topCPUConsumers', options);

    expect(receivedResult).toEqual(true);
  });
});
