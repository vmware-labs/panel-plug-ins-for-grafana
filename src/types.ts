/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

type SeriesSize = 'sm' | 'md' | 'lg';

export interface SimpleOptions {
  selectedQuery: string;
  selectedField: string;
  showArithmeticMenu: boolean;
  firstArithmeticField: string;
  secondArithmeticField: string;
  arithmeticOperation: string;
  arithmeticColumnAlias: string;
  arithmeticOperationIsActive: boolean;
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
}

export interface Keyable {
  [key: string]: any;
}
