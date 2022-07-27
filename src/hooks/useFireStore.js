import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../Firebase/config';

const useFirestore = (collectionName, condition = {}) => {
    const [data, setData] = useState([]); 
    const conditionString = JSON.stringify(condition)  

    useEffect(() => {
        let unsubscribe;
        const getData = async () => {
            if (collectionName) {
                const collectionRef = collection(db, collectionName);
                let q = '';
                if (Object.keys(condition).length > 0) {
                    const { value1, compareValue, value2 } = condition;
                    q = query(
                        collectionRef,
                        where(value1, compareValue, value2),
                        orderBy('createAt')
                    );
                } else {
                    q = query(collectionRef, orderBy('createAt'));
                }
                unsubscribe = onSnapshot(q, (querySnapshot) => {
                    let docs = [];
                    querySnapshot.forEach((doc) => {
                        docs.push({
                            ...doc.data(),
                            id: doc.id,
                        });
                    });
                    setData((docs));
                });
            }
        };
        getData();
        return unsubscribe;
    }, [collectionName, conditionString]);

    return data;
};

export { useFirestore };
