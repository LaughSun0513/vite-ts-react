import React, { useState, useDeferredValue } from 'react';

function UseDeferredValueDemo() {
    const [data, setData] = useState('');
    const deferredData = useDeferredValue(data);

    const handleChange = (e:any) => {
        setData(e.target.value);
    }
    return (
        <>
            <input value={data} onChange={handleChange} />
            <h1>{ data }</h1>
            <h1>{ deferredData }</h1>
        </>
    )
}

export default UseDeferredValueDemo;