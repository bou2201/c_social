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

export const getTitleContentMetadata = (text: string) => {
  if (text?.length <= 100) {
    return text; // Return the full text if it's 50 characters or shorter
  }

  const trimmed = text.slice(0, 100);

  // Find the last valid break point (space or newline)
  const lastBreakIndex = Math.max(trimmed.lastIndexOf(' '), trimmed.lastIndexOf('\n'));

  // If a valid break point exists, truncate to it and add ellipsis
  if (lastBreakIndex !== -1) {
    return trimmed.slice(0, lastBreakIndex) + '...';
  }

  // If no break point exists, return the trimmed text with ellipsis
  return trimmed + '...';
};
