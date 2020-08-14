import moment from 'moment';

export const formatTimeFull = (value) => {
  return moment(value).format('YYYY-MM-DD HH:mm:ss');
};
