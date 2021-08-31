import React, { Suspense } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

const fetchData = (id: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject({
                success: false,
                error: '数据请求失败'
            })
        }, 1000);
    });
}
// React.lazy实现原理
const createData = (promis:Promise<any>) => {
    let status = 'pending';
    let result:any;
    return {
        read() {
            if (status === 'success' || status === 'error') {
                return result;
            }
            else {
                // 关键代码 一进入子组件 就通过抛出一个错误的方式 来和父组件通信 父组件通过捕获错误触发重新渲染数据
                throw promis.then((data: any) => {
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
    if (result.success) {
        let user = result.data;
        return <>数据请求回来了===>id:{user.id}, name:{user.name}</>
    }
    else {
        throw result.error;
    }
}
export default class extends React.Component {
    render() {
        return (
            <ErrorBoundary fallback={<div>Oops~~数据请求失败了...</div> }>
                <Suspense fallback={<div>加载中...</div>}>
                    <User/>
                </Suspense>
            </ErrorBoundary>
            
        )
    }
}