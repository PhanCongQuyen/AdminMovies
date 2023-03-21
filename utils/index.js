
export const ellipsisStr = (str, options) => {
    if (!str) {
      return '';
    }
    let strOffset = 32;
    if (options) {
      const { offset, width, size, margin } = options;
      if (offset) {
        strOffset = offset;
      }
      if (width && size) {
        strOffset = parseInt((width - (margin || 0) - 3 * size) / size) + 1;
      }
    }
    const subStr = (str.length > strOffset && '...') || '';
    return String(str).substring(0, strOffset) + subStr;
  };