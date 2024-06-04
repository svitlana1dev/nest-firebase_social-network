export const formatDate = (doc: any, fieldName: string): string => {
  return doc.get(fieldName)?.toDate();
};
