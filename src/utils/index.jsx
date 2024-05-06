import { format } from 'date-fns';
import localePtBr from 'date-fns/locale/pt-BR';

const formatDate = (date) => {
  return format(date, 'Pp', { locale: localePtBr });
};

export { formatDate };
