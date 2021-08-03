/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import { toDataFrame } from '@grafana/data';
import {
  getColumnsFromData,
  getColumnsFromDataDarkMode,
  getDataFrameInMaterialForm,
  getDataInMaterialForm,
  getData,
} from '../utils/TableUtils';

// Test data -----------------------------------
const testArrayCPU = [
  { CPU: 21, PID: 4624, SessionId: 2 },
  { CPU: 1, PID: 5712, SessionId: 4 },
];

const testArrayMemory = [
  { CPU: 21, PID: 4624, SessionId: 2 },
  { CPU: 1, PID: 5712, SessionId: 4 },
];

const testArrayToDataFrame = toDataFrame(testArrayCPU);

const expectedColumns = [
  { title: 'CPU', field: 'CPU' },
  { title: 'PID', field: 'PID' },
  { title: 'SessionId', field: 'SessionId' },
];

const expectedColumnsDarkMode = [
  { title: 'CPU', field: 'CPU', cellStyle: { backgroundColor: '#181818', color: '#FFF' } },
  { title: 'PID', field: 'PID', cellStyle: { backgroundColor: '#181818', color: '#FFF' } },
  { title: 'SessionId', field: 'SessionId', cellStyle: { backgroundColor: '#181818', color: '#FFF' } },
];

const expectedData = {
  columns: expectedColumns,
  formattedData: testArrayCPU,
};

// DataFrame to mock the resulting query in Grafana
const testDataFrame = toDataFrame({
  name: 'dataframe',
  fields: [
    { name: 'topCPUConsumers', type: 'string', values: [testArrayCPU] },
    { name: 'topMemConsumers', type: 'string', values: [testArrayMemory] },
    { name: 'objectData', type: 'object', values: [{ source: 123 }] },
    { name: '@timestamp', type: 'time', values: ['2021-05-28T17:15:33.517459700+00:00'] },
  ],
});

const testMultiValueDataFrame = toDataFrame({
  name: 'dataframe',
  fields: [
    { name: 'count', type: 'string', values: [3, 7, 9] },
    {
      name: '@timestamp',
      type: 'time',
      values: [
        '2021-05-28T17:15:33.517459700+00:00',
        '2021-05-28T17:15:33.517459700+00:00',
        '2021-05-28T17:15:33.517459700+00:00',
      ],
    },
  ],
});

// Expected columns from the above test DataFrame
const expectedDataFrameColumns = [
  { title: 'topCPUConsumers', field: 'topCPUConsumers' },
  { title: 'topMemConsumers', field: 'topMemConsumers' },
  { title: 'objectData', field: 'objectData' },
  { title: '@timestamp', field: '@timestamp' },
];

// Expected Data from the above DataFrame
const timestamp = '@timestamp';
const expectedDataFrameData = {
  columns: expectedDataFrameColumns,
  formattedData: [
    {
      topCPUConsumers: '[object Object]',
      topMemConsumers: '[object Object]',
      objectData: '[object Object]',
      [timestamp]: '2021-05-28T17:15:33.517459700+00:00',
    },
  ],
};

// Expected columns from the above test DataFrame
const expectedMultiValueDataFrameData = {
  columns: [
    { title: 'count', field: 'count' },
    { title: '@timestamp', field: '@timestamp' },
  ],
  formattedData: [
    {
      count: 3,
      [timestamp]: '2021-05-28T17:15:33.517459700+00:00',
    },
    {
      count: 7,
      [timestamp]: '2021-05-28T17:15:33.517459700+00:00',
    },
    {
      count: 9,
      [timestamp]: '2021-05-28T17:15:33.517459700+00:00',
    },
  ],
};

// Test cases -----------------------------------
/*  Test for getColumns function which is given a list of fields
    It should return a list of objects in format { title: fieldName, field: fieldName }
*/
describe('Get columns from data', () => {
  it('should work when given array turned to dataframe', () => {
    const columns = getColumnsFromData(testArrayToDataFrame.fields, undefined!);
    expect(columns).toEqual(expectedColumns);
  });
});

/*  Test for getColumns function which is given a list of fields
    It should return a list of objects in format { title: fieldName, field: fieldName }
*/
describe('Get columns from data', () => {
  it('should work when given array turned to dataframe', () => {
    const columns = getColumnsFromDataDarkMode(testArrayToDataFrame.fields);
    expect(columns).toEqual(expectedColumnsDarkMode);
  });
});

/*  Test for get Data in material-form function which is given a list of values from a field in a DataFrame
    It should return an object containing the column names for each value in field, and a list of the values for each column
*/
describe('Get array data in material form', () => {
  const receivedData = getDataInMaterialForm(testArrayCPU, true, undefined!);
  it('should return an object with {columns: ", formattedData: "} when given array of field data', () => {
    expect(receivedData).toEqual(expectedData);
  });
});

/*  Test for getting a DataFrame in material-table form function which is given a DataFrame
    It should get the column names and list of the values for each column
    Array fields should be replaced with the value '[object]'
*/
describe('GetDataframe in material form', () => {
  const receivedData = getDataFrameInMaterialForm(testDataFrame, true, undefined!);
  it('should return an object with {columns: ", formattedData: "} when given array of field data', () => {
    expect(receivedData).toEqual(expectedDataFrameData);
  });
});

/*  Test for getting a DataFrame in material-table form function which is given a DataFrame
    It should get the column names and list of the values for each column, for all columns
    Array fields should be replaced with the value '[object]'
*/
describe('GetDataframe in material form with multiple rows', () => {
  const receivedData = getDataFrameInMaterialForm(testMultiValueDataFrame, true, undefined!);
  it('should return an object with {columns: ", formattedData: "} when given array of field data', () => {
    expect(receivedData).toEqual(expectedMultiValueDataFrameData);
  });
});

/*  The getData function should call the appropriate function based on the users field query
    If the user queried for the 'default' option to display the whole dataframe,
    then getDataFrameInMaterialForm should be called
    Else the user queried for one of the array fields, call getDataInMaterialForm
*/
describe('GetData', () => {
  it('should use getDataFrameInMaterialForm when given default query', () => {
    const receivedData = getData(testDataFrame, 'default', true, undefined!);
    expect(receivedData).toEqual(expectedDataFrameData);
  });
  it('should use getDataInMaterialForm when given a field name query not equal to default', () => {
    const receivedData = getData(testArrayCPU, 'topCPUConsumers', true, undefined!);
    expect(receivedData).toEqual(expectedData);
  });
});
