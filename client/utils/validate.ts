 export const isValidDate = (value: string) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  };