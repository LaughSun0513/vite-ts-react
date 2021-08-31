import React, { useState, startTransition,Suspense } from 'react';
import { fetchProfileData } from "../utils/index";


const initialResource = fetchProfileData(0);

function getNextId(id:number) {
    return id === 3 ? 0 : id + 1;
}
function Text(props:any) {
    const user = props.resource.user.read();
    return <h1>{user.name}</h1>;
}
function StartTransition() {
    const [data1, setData1] = useState(initialResource);
    const [data2, setData2] = useState(initialResource);

    const handleClk = () => {
        // startTransition 可以让结果一起返回 类似Promise.all
        startTransition(() => {
            const nextUserId = getNextId(data1.userId);
            const nextUserId2 = getNextId(data2.userId);
            setData1(fetchProfileData(nextUserId));
            setData2(fetchProfileData(nextUserId2))
        })
        
    }
    const handleClk2 = () => {
        const nextUserId = getNextId(data1.userId);
        const nextUserId2 = getNextId(data2.userId);
        setData1(fetchProfileData(nextUserId));
        setData2(fetchProfileData(nextUserId2))
    }
    return (
        <>
            <Suspense fallback={<h1>loading data1</h1>}>
                <Text resource={ data1 }></Text>
            </Suspense>
            <Suspense fallback={<h1>loading data2</h1>}>
                <Text resource={ data2 }></Text>
            </Suspense>
            <span>
                <button onClick={handleClk}>startTransition 一起变</button>
                <button onClick={ handleClk2 }>no transition</button>
            </span>
        </>
    )
}

export default StartTransition;