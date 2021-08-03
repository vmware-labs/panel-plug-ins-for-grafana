/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import { toDataFrame } from '@grafana/data';
import {
  getArithmeticOperationResult,
  handleArrayOperation,
  handleDataFrameOperation,
} from 'utils/ArithmeticOperationsUtils';

// Test Data
const testDataFrame = toDataFrame({
  name: 'dataframe',
  fields: [
    { name: 'count', type: 'string', values: [2, 5, 7] },
    { name: 'input', type: 'string', values: [1, 2, 3] },
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

const expectedDFSumResult = toDataFrame({
  name: 'dataframe',
  fields: [
    { name: 'count', type: 'string', values: [2, 5, 7] },
    { name: 'input', type: 'string', values: [1, 2, 3] },
    {
      name: '@timestamp',
      type: 'time',
      values: [
        '2021-05-28T17:15:33.517459700+00:00',
        '2021-05-28T17:15:33.517459700+00:00',
        '2021-05-28T17:15:33.517459700+00:00',
      ],
    },
    { name: 'Sum', type: 'string', values: [3, 7, 10] },
  ],
});

const expectedDFDifResult = toDataFrame({
  name: 'dataframe',
  fields: [
    { name: 'count', type: 'string', values: [2, 5, 7] },
    { name: 'input', type: 'string', values: [1, 2, 3] },
    {
      name: '@timestamp',
      type: 'time',
      values: [
        '2021-05-28T17:15:33.517459700+00:00',
        '2021-05-28T17:15:33.517459700+00:00',
        '2021-05-28T17:15:33.517459700+00:00',
      ],
    },
    { name: 'Difference', type: 'string', values: [1, 3, 4] },
  ],
});

const expectedDFProdResult = toDataFrame({
  name: 'dataframe',
  fields: [
    { name: 'count', type: 'string', values: [2, 5, 7] },
    { name: 'input', type: 'string', values: [1, 2, 3] },
    {
      name: '@timestamp',
      type: 'time',
      values: [
        '2021-05-28T17:15:33.517459700+00:00',
        '2021-05-28T17:15:33.517459700+00:00',
        '2021-05-28T17:15:33.517459700+00:00',
      ],
    },
    { name: 'Product', type: 'string', values: [2, 10, 21] },
  ],
});

const expectedDFQuotResult = toDataFrame({
  name: 'dataframe',
  fields: [
    { name: 'count', type: 'string', values: [2, 5, 7] },
    { name: 'input', type: 'string', values: [1, 2, 3] },
    {
      name: '@timestamp',
      type: 'time',
      values: [
        '2021-05-28T17:15:33.517459700+00:00',
        '2021-05-28T17:15:33.517459700+00:00',
        '2021-05-28T17:15:33.517459700+00:00',
      ],
    },
    { name: 'Quotient', type: 'string', values: [2, 2.5, 2.3333333333333335] },
  ],
});

// Test cases -----------------------------------
/*  Test for expectedSumResult
    It should return the orig dataframe with a new column, with the result of the operation
*/
describe('HandleDataFrameOperation', () => {
  it('should return the orig dataframe with a new column containing operation values for sum', () => {
    const opResult = handleDataFrameOperation(testDataFrame, {
      firstField: 'count',
      secondField: 'input',
      operation: 'Sum',
      alias: 'Sum',
    });

    expect(opResult.fields).toEqual(expectedDFSumResult.fields);
  });

  it('should return the orig dataframe with a new column containing operation values for difference', () => {
    const opResult = handleDataFrameOperation(testDataFrame, {
      firstField: 'count',
      secondField: 'input',
      operation: 'Difference',
      alias: 'Difference',
    });

    expect(opResult.fields).toEqual(expectedDFDifResult.fields);
  });

  it('should return the orig dataframe with a new column containing operation values for product', () => {
    const opResult = handleDataFrameOperation(testDataFrame, {
      firstField: 'count',
      secondField: 'input',
      operation: 'Product',
      alias: 'Product',
    });

    expect(opResult.fields).toEqual(expectedDFProdResult.fields);
  });

  it('should return the orig dataframe with a new column containing operation values for quotient', () => {
    const opResult = handleDataFrameOperation(testDataFrame, {
      firstField: 'count',
      secondField: 'input',
      operation: 'Quotient',
      alias: 'Quotient',
    });

    expect(opResult.fields).toEqual(expectedDFQuotResult.fields);
  });
});

// Tests for handling operations on array based data

// Test data ---------------------------------------------------
const expectedArraySum = [
  { CPU: 21, PID: 4624, SessionId: 2, Sum: 23 },
  { CPU: 1, PID: 5712, SessionId: 4, Sum: 5 },
];

const expectedArrayDif = [
  { CPU: 21, PID: 4624, SessionId: 2, Difference: 19 },
  { CPU: 1, PID: 5712, SessionId: 4, Difference: -3 },
];

const expectedArrayProd = [
  { CPU: 21, PID: 4624, SessionId: 2, Product: 42 },
  { CPU: 1, PID: 5712, SessionId: 4, Product: 4 },
];

const expectedArrayQuot = [
  { CPU: 21, PID: 4624, SessionId: 2, Quotient: 10.5 },
  { CPU: 1, PID: 5712, SessionId: 4, Quotient: 0.25 },
];

describe('HandleArrayOperation', () => {
  it('should return the orig array with each row having new key containing operation values for sum', () => {
    const testArrayCPU = [
      { CPU: 21, PID: 4624, SessionId: 2 },
      { CPU: 1, PID: 5712, SessionId: 4 },
    ];
    const opResult = handleArrayOperation(testArrayCPU, {
      firstField: 'CPU',
      secondField: 'SessionId',
      operation: 'Sum',
      alias: 'Sum',
    });

    expect(opResult).toEqual(expectedArraySum);
  });

  it('should return the orig array with each row having new key containing operation values for difference', () => {
    const testArrayCPU = [
      { CPU: 21, PID: 4624, SessionId: 2 },
      { CPU: 1, PID: 5712, SessionId: 4 },
    ];
    const opResult = handleArrayOperation(testArrayCPU, {
      firstField: 'CPU',
      secondField: 'SessionId',
      operation: 'Difference',
      alias: 'Difference',
    });

    expect(opResult).toEqual(expectedArrayDif);
  });

  it('should return the orig array with each row having new key containing operation values for product', () => {
    const testArrayCPU = [
      { CPU: 21, PID: 4624, SessionId: 2 },
      { CPU: 1, PID: 5712, SessionId: 4 },
    ];
    const opResult = handleArrayOperation(testArrayCPU, {
      firstField: 'CPU',
      secondField: 'SessionId',
      operation: 'Product',
      alias: 'Product',
    });

    expect(opResult).toEqual(expectedArrayProd);
  });

  it('should return the orig array with each row having new key containing operation values for quotient', () => {
    const testArrayCPU = [
      { CPU: 21, PID: 4624, SessionId: 2 },
      { CPU: 1, PID: 5712, SessionId: 4 },
    ];
    const opResult = handleArrayOperation(testArrayCPU, {
      firstField: 'CPU',
      secondField: 'SessionId',
      operation: 'Quotient',
      alias: 'Quotient',
    });

    expect(opResult).toEqual(expectedArrayQuot);
  });
});

describe('getArithmeticOperationResult', () => {
  it('should return the data result from DF operation if given a dataframe', () => {
    const opResult = getArithmeticOperationResult(testDataFrame, {
      firstField: 'count',
      secondField: 'input',
      operation: 'Sum',
      alias: 'Sum',
    });

    expect(opResult.fields).toEqual(expectedDFSumResult.fields);
  });

  it('should return the data result from array operation if given a array', () => {
    const testArrayCPU = [
      { CPU: 21, PID: 4624, SessionId: 2 },
      { CPU: 1, PID: 5712, SessionId: 4 },
    ];
    const opResult = getArithmeticOperationResult(testArrayCPU, {
      firstField: 'CPU',
      secondField: 'SessionId',
      operation: 'Sum',
      alias: 'Sum',
    });

    expect(opResult).toEqual(expectedArraySum);
  });

  it('should return the data itslef if the data was not an array or dataframe', () => {
    const opResult = getArithmeticOperationResult(undefined, {
      firstField: 'CPU',
      secondField: 'SessionId',
      operation: 'Sum',
      alias: 'Sum',
    });

    expect(opResult).toEqual(undefined);
  });
});
