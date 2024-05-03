import { format, addMinutes as addMinutesFns } from 'date-fns';
import localePtBr from 'date-fns/locale/pt-BR';

const formatDate = (date) => {
  return format(date, 'Pp', { locale: localePtBr });
};

const addMinutes = (date, minutes) => {
  const dateAdded = addMinutesFns(date, minutes);
  return formatDate(dateAdded);
};

export { formatDate, addMinutes };
