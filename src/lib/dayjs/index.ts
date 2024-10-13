import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import relativeLocale from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/vi';

dayjs.extend(updateLocale);
dayjs.extend(relativeLocale);

dayjs.locale('vi');

dayjs.updateLocale('vi', {
  relativeTime: {
    future: '%s tới',
    past: '%s trước',
    s: 'vài giây',
    m: '1 phút',
    mm: '%d phút',
    h: '1 giờ',
    hh: '%d giờ',
    d: '1 ngày',
    dd: '%d ngày',
    M: '1 tháng',
    MM: '%d tháng',
    y: '1 năm',
    yy: '%d năm',
  },
});

export default dayjs;
