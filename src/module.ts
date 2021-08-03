/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';
import { ArrayFieldEditor } from 'custom-editors/ArrayFieldEditor';
import { QueryEditor } from 'custom-editors/QueryEditor';
import {
  ArithmeticFirstFieldEditor,
  ArithmeticSecondFieldEditor,
  ArithmeticOperationEditor,
} from './custom-editors/ArithmeticFieldCustomEditor';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).useFieldConfig().setPanelOptions((builder) => {
  return builder
    .addCustomEditor({
      id: 'selectedQuery',
      path: 'selectedQuery',
      name: 'Query',
      editor: QueryEditor,
      defaultValue: 'A',
    })
    .addCustomEditor({
      id: 'selectedField',
      path: 'selectedField',
      name: 'Field to Display',
      editor: ArrayFieldEditor,
      defaultValue: 'default',
    })
    .addBooleanSwitch({
      path: 'showArithmeticMenu',
      name: 'Show arithmetic operation menu',
      defaultValue: false,
    })
    .addCustomEditor({
      id: 'arithmeticOperation',
      path: 'arithmeticOperation',
      name: 'Operation',
      editor: ArithmeticOperationEditor,
      showIf: (config) => config.showArithmeticMenu,
    })
    .addCustomEditor({
      id: 'firstArithmeticField',
      path: 'firstArithmeticField',
      name: 'First field',
      editor: ArithmeticFirstFieldEditor,
      showIf: (config) => config.showArithmeticMenu,
    })
    .addCustomEditor({
      id: 'secondArithmeticField',
      path: 'secondArithmeticField',
      name: 'Second field',
      editor: ArithmeticSecondFieldEditor,
      showIf: (config) => config.showArithmeticMenu,
    })
    .addTextInput({
      path: 'arithmeticColumnAlias',
      name: 'Operation alias',
      description: 'Enter an alias for the new column',
      defaultValue: '',
      showIf: (config) => config.showArithmeticMenu,
    })
    .addBooleanSwitch({
      path: 'arithmeticOperationIsActive',
      name: 'Activate arithmetic operation',
      defaultValue: false,
      showIf: (config) => {
        return (
          config.firstArithmeticField !== undefined &&
          config.secondArithmeticField !== undefined &&
          config.arithmeticOperation !== undefined &&
          config.showArithmeticMenu
        );
      },
    })
    .addTextInput({
      path: 'text',
      name: 'Simple text option',
      description: 'Description of panel option',
      defaultValue: 'Default value of text input option',
    });
});
