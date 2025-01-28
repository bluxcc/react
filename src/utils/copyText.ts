const copyText = (text: string) => {
  return navigator.clipboard.writeText(text);
};

export default copyText;
