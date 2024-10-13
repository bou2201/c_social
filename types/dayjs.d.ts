// From: https://github.com/iamkun/dayjs/pull/418/files#diff-e5e546dd2eb0351f813d63d1b39dbc48

import { Dayjs, PluginFunc } from 'dayjs';
type DateType = string | number | Date | Dayjs;

declare module 'dayjs' {
  interface Dayjs {
    fromNow(withoutSuffix?: boolean): string;
    from(compared: DateType, withoutSuffix?: boolean): string;
    toNow(withoutSuffix?: boolean): string;
    to(compared: DateType, withoutSuffix?: boolean): string;
  }
}
