import { useEffect, useRef, useState } from "react";
import { projectFirestore } from "../firebase/config";

export const useCollection = (collection, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // to avoid infinite loop of useEffect.
  // this is necessary whenever you use r eference type as a dependency in useEffect
  const query = useRef(_query).current;
  const orderBy = useRef(_orderBy).current;

  // fires whenever the collection changes
  useEffect(() => {
    let ref = projectFirestore.collection(collection);

    if (query) {
      ref = ref.where(...query); // query only for the uid
    }
    if (orderBy) {
      ref = ref.orderBy(...orderBy);
    }

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        let results = [];
        // push each transaction record to result array
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id }); // NOTE: id is not same as uid which is user id
        });
        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );
    // unsubscribe on unmount
    return () => unsubscribe();
  }, [collection, query, orderBy]);

  return { documents, error };
};
