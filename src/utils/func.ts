export const getShortName = (fullname: string) => {
  if (!fullname || fullname.trim() === '') {
    return '';
  }
  const words = fullname.split(' ');
  let shortName = '';

  for (const word of words) {
    if (word) {
      shortName += word[0];
    }
  }

  return shortName.toUpperCase();
};

export const getContent = (content: string, isExpanded: boolean, maxLength: number): string => {
  if (isExpanded) {
    return content?.replace(/\n/g, '<br/>') ?? '';
  }

  const truncatedContent = content?.slice(0, maxLength)?.replace(/\n/g, '<br/>') ?? '';
  const needsEllipsis = content.length > maxLength;
  return truncatedContent + (needsEllipsis ? '...' : '');
};
