/*
Copyright 2021 VMware, Inc.
SPDX-License-Identifier: Apache-2.0
*/

import { Subject } from 'rxjs';

const subject = new Subject();

export const dataFrameSubject = {
  setData: (d: any) => subject.next({ value: d }),
  clearData: () => subject.next(),
  getData: () => subject.asObservable(),
};
