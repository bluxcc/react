export const shortenAddress = (address: string, numChars = 8) => {
  const shortenedAddress = address.slice(0, numChars) + '...' + address.slice(-numChars);

  return shortenedAddress;
};
