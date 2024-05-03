export const serializeForm = (formRef) => {
  const formData = new FormData(formRef);
  return Array.from(formData.entries()).reduce((data, [key, value]) => {
    data[key] = key in data ? [...data[key], value] : value;
    return data;
  }, {});
};
  