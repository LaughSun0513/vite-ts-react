import React from "react";
import MySuspense from '../components/MySuspense';

const fetchData = (id:number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: {
                    id: 1,
                    name: `name${id}`
                }
            })
        }, 1000);
    });
}
// React.lazy实现原理
const createData = (promise:Promise<any>) => {
    let status = 'pending';
    let result:any;
    return {
        read() {
            if (status === 'success' || status === 'error') {
                return result;
            }
            else {
                // 关键代码 一进入子组件 就通过抛出一个错误的方式 来和父组件通信 父组件通过捕获错误触发重新渲染数据
                throw promise.then((data: any) => {
                    status = 'success';
                    result = data;
                }, (error: any) => {
                    status = 'error';
                    result = error;
                });
                
            }
        }
    }
}
let userData = createData(fetchData(1));

const User = () => {
    let result = userData.read();
    console.log(result)
    if (result.success) {
        let user = result.data;
        return <>数据请求回来了===>id:{user.id}, name:{user.name}</>
    }
    else {
        return null;
    }
}
export default class extends React.Component {
    render() {
        return (
            <>
                <MySuspense fallback={<div>加载中...</div>}>
                    <User/>
                </MySuspense>
            </>
            
        )
    }
}