/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory } from '@grafana/ui';
import { getDisplayComponent, getDataFrameFromQuery } from './utils/SimplePanelUtils';
import { dataFrameSubject } from './subjects/dataFrameSubject';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height, replaceVariables }) => {
  const styles = getStyles();

  // Get the DataFrame matching the options name
  const dataFrame = getDataFrameFromQuery(data.series, options.selectedQuery);
  dataFrameSubject.setData({
    dataFrame: dataFrame,
    selectedField: options.selectedField,
  });
  let arithmeticData = options.arithmeticOperationIsActive
    ? {
        operation: options.arithmeticOperation,
        firstField: options.firstArithmeticField,
        secondField: options.secondArithmeticField,
        alias: options.arithmeticColumnAlias ? options.arithmeticColumnAlias : options.arithmeticOperation,
      }
    : undefined;
  const displayComponent = getDisplayComponent(dataFrame!, options.selectedField, arithmeticData, replaceVariables);

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      {displayComponent}
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
});
