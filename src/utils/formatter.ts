const deg2Rad = (degress: number): number => {
  const pi = Math.PI;

  return (degress * pi) / 180;
};

const formatDate = (date: Date): string => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth();
  const day = new Date(date).getDate();

  return `${month + 1}/${day}/${year}`;
};

export { deg2Rad, formatDate };
