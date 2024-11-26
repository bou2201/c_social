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

export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy text to clipboard:', error);
      return false;
    }
  } else {
    console.error('Clipboard API is not supported in this browser.');
    return false;
  }
};
