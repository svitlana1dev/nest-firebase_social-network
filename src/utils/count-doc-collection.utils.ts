export const countDocumentsInCollection = async (collectionRef) => {
  let count = 0;

  const snapshot = await collectionRef.get();
  count += snapshot.size;

  for (const doc of snapshot.docs) {
    const subcollections = await doc.ref.listCollections();
    for (const subcollection of subcollections) {
      count += await countDocumentsInCollection(subcollection);
    }
  }

  return count;
};
