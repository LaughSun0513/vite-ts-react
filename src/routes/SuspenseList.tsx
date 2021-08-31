import React, { Suspense, SuspenseList } from "react";

const fetchData = (id:number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: {
                    id,
                    name: `name${id}`
                }
            })
        }, 1000 * id);
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
let userDataMap:any = {
    1: createData(fetchData(1)),
    2: createData(fetchData(2)),
    3: createData(fetchData(3))
}
interface UserProps {
    id: number
}
const User = (props: UserProps) => {
    // 一定要是read这种方式请求，不然Suspense不会生效
    let result = userDataMap[props.id].read();
    if (result.success) {
        let user = result.data;
        return <>数据请求回来了===>id:{user.id}, name:{user.name}<br/></>
    }
    else {
        return null;
    }
}
/**
 * SuspenseList上的参数 返回数据的交互不一样
 * revealOrder backwards/forwards/together
 * tail collapsed/hidden
 */
export default class extends React.Component {
    render() {
        return (
            <>
                <SuspenseList revealOrder="forwards" tail="collapsed">
                    <Suspense fallback={<div>加载中3...</div>}>
                        <User id={ 3 }/>
                    </Suspense>
                    <Suspense fallback={<div>加载中2...</div>}>
                        <User id={ 2 }/>
                    </Suspense>
                    <Suspense fallback={<div>加载中1...</div>}>
                        <User id={ 1 }/>
                    </Suspense>
                </SuspenseList>
                <hr width="80%" color="#987cb9" size="3" />
                <SuspenseList revealOrder="backwards" tail="hidden">
                    <Suspense fallback={<div>加载中3...</div>}>
                        <User id={ 3 }/>
                    </Suspense>
                    <Suspense fallback={<div>加载中2...</div>}>
                        <User id={ 2 }/>
                    </Suspense>
                    <Suspense fallback={<div>加载中1...</div>}>
                        <User id={ 1 }/>
                    </Suspense>
                </SuspenseList>
            </>
        )
    }
}