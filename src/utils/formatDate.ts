const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  const day = date.getUTCDate();
  const month = date.toLocaleString('en-US', { month: 'long' });

  return `${day} ${month}`;
};

export default formatDate;
