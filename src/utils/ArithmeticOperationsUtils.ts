/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import { DataFrame, FieldType, MutableDataFrame } from '@grafana/data';

/*
    Calls appropriate handle method for data if it is a DataFrame or an Array
    Else no operation is performed and data is returned as is
*/
export const getArithmeticOperationResult = (data: any, arithmeticData: any) => {
  if (data?.fields) {
    return handleDataFrameOperation(data, arithmeticData);
  } else if (Array.isArray(data)) {
    return handleArrayOperation(data, arithmeticData);
  } else {
    return data;
  }
};

/*
    Calls appropriate arithmetic operation based on the operation value in arithmeticData
*/
export const handleArrayOperation = (data: any[], arithmeticData: any) => {
  if (arithmeticData.operation === 'Sum') {
    return sumArrayOperation(data, arithmeticData);
  } else if (arithmeticData.operation === 'Difference') {
    return differenceArrayOperation(data, arithmeticData);
  } else if (arithmeticData.operation === 'Product') {
    return multiplicationArrayOperation(data, arithmeticData);
  } else if (arithmeticData.operation === 'Quotient') {
    return divisionArrayOperation(data, arithmeticData);
  }
};

/*
    Calls appropriate arithmetic operation based on the operation value in arithmeticData
*/
export const handleDataFrameOperation = (data: DataFrame, arithmeticData: any) => {
  if (arithmeticData.operation === 'Sum') {
    return sumDataFrameOperation(data, arithmeticData);
  } else if (arithmeticData.operation === 'Difference') {
    return differenceDataFrameOperation(data, arithmeticData);
  } else if (arithmeticData.operation === 'Product') {
    return multiplicationDataFrameOperation(data, arithmeticData);
  } else {
    return divisionDataFrameOperation(data, arithmeticData);
  }
};

/*
    Operation functions perform the given operation on the given two fields
    Added as a new column into the table
*/
export const sumArrayOperation = (data: any, arithmeticData: any) => {
  // add the new column to each row
  data.forEach((row: any) => {
    row[arithmeticData.alias] = row[arithmeticData.firstField] + row[arithmeticData.secondField];
  });
  return data;
};

export const differenceArrayOperation = (data: any, arithmeticData: any) => {
  // add the new column to each row
  data.forEach((row: any) => {
    row[arithmeticData.alias] = row[arithmeticData.firstField] - row[arithmeticData.secondField];
  });
  return data;
};

export const multiplicationArrayOperation = (data: any, arithmeticData: any) => {
  // add the new column to each row
  data.forEach((row: any) => {
    row[arithmeticData.alias] = row[arithmeticData.firstField] * row[arithmeticData.secondField];
  });
  return data;
};

export const divisionArrayOperation = (data: any, arithmeticData: any) => {
  // add the new column to each row
  data.forEach((row: any) => {
    row[arithmeticData.alias] = row[arithmeticData.firstField] / row[arithmeticData.secondField];
  });
  return data;
};

export const sumDataFrameOperation = (data: DataFrame, arithmeticData: any) => {
  const newDataFrame = new MutableDataFrame({ fields: data.fields });
  const newFieldValuesList = [];
  for (let i = 0; i < data.length; i++) {
    const calculatedVal =
      getValueFromField(data, arithmeticData.firstField, i) + getValueFromField(data, arithmeticData.secondField, i);
    newFieldValuesList.push(calculatedVal);
  }
  newDataFrame.addField({ name: arithmeticData.alias, type: FieldType.string, values: newFieldValuesList });
  data = newDataFrame;
  return data;
};

export const differenceDataFrameOperation = (data: DataFrame, arithmeticData: any) => {
  const newDataFrame = new MutableDataFrame({ fields: data.fields });
  const newFieldValuesList = [];
  for (let i = 0; i < data.length; i++) {
    const calculatedVal =
      getValueFromField(data, arithmeticData.firstField, i) - getValueFromField(data, arithmeticData.secondField, i);
    newFieldValuesList.push(calculatedVal);
  }
  newDataFrame.addField({ name: arithmeticData.alias, type: FieldType.string, values: newFieldValuesList });
  data = newDataFrame;
  return data;
};

export const multiplicationDataFrameOperation = (data: DataFrame, arithmeticData: any) => {
  const newDataFrame = new MutableDataFrame({ fields: data.fields });
  const newFieldValuesList = [];
  for (let i = 0; i < data.length; i++) {
    const calculatedVal =
      getValueFromField(data, arithmeticData.firstField, i) * getValueFromField(data, arithmeticData.secondField, i);
    newFieldValuesList.push(calculatedVal);
  }
  newDataFrame.addField({ name: arithmeticData.alias, type: FieldType.string, values: newFieldValuesList });
  data = newDataFrame;
  return data;
};

export const divisionDataFrameOperation = (data: DataFrame, arithmeticData: any) => {
  const newDataFrame = new MutableDataFrame({ fields: data.fields });
  const newFieldValuesList = [];
  for (let i = 0; i < data.length; i++) {
    const calculatedVal =
      getValueFromField(data, arithmeticData.firstField, i) / getValueFromField(data, arithmeticData.secondField, i);
    newFieldValuesList.push(calculatedVal);
  }
  newDataFrame.addField({ name: arithmeticData.alias, type: FieldType.string, values: newFieldValuesList });
  data = newDataFrame;
  return data;
};

const getValueFromField = (data: DataFrame, fieldName: string, index: number) => {
  const field = data.fields.find((field) => field.name === fieldName);
  return field?.values.get(index);
};
