<a name="yRaE7"></a>
## 新特性
- React18新特性
   - 并发模式
   - 双缓冲
- 搭建vite环境
- 批量更新
   - 原有this.setState是如何更新渲染的
   - createRoot().render()
   - Suspense
   - SuspenseList
   - ErrorBoundary
   - StartTansition
   - useTransition
   - useDeferredValue
<a name="UVMa1"></a>
### 1.并发模式

1. React 18新加入 并发渲染 (concurrent rendering)机制
1. Concurrent模式 可帮助应用保持相应，根据用户的设备性能和网速进行适当的调整
1. Concurrent模式 渲染不是阻塞的 是可中断的

​<br />
<a name="zn4fF"></a>
#### 1.1 更新优先级

- 以前优先级高的更新不能打断之前的更新，需要等前面的更新完成后才可以进行
- 用户对不同操作的交互执行速度有不同预期 所以我们可以根据用户的预期更新不同的优先级
   - 高优先级的 用户希望马上感知到的操作  比如 用户输入 窗口缩放 拖拽事件
   - 低优先级的 可以不马上响应 比如 数据请求 下载文件等
- 高优先级的更新会中断正在进行的低优先级的更新
- 低优的更新等高优任务更新完成后基于高优的结果重新更新
- 并发 意味着 更急迫的更新 可以中断已经开始的渲染 （插队）
<a name="lWgMr"></a>
### 2. 双缓冲
当数据量很大时候，绘图需要几秒甚至更长时间，甚至出现闪烁现象，为解决该问题，采用双缓冲技术

   - 双缓冲 即在内存中创建一个与屏幕绘制区域一致的对象，先将图形绘制到内存中的这个对象上，再一次性将这个对象上的图形拷贝到屏幕上，这样能大大加快绘图速度
   - 对于 IO-bound的更新(例如从网络加载代码或数据)，并发意味着React甚至可以在全部数据到达之前就在内存中开始渲染，然后跳过令人不愉快的空白加载状态
<a name="DIp2h"></a>
### 3.搭建环境
<a name="ZBTU3"></a>
#### 3.1 Vite
plugin-react-refresh 支持react组件的热更新
```bash
npm i react@next react-dom@next @types/react @types/react-dom -S
npm i vite typescript @vitejs/plugin-react-refresh -D
node ./node_modules/esbuild/install.js
```
<a name="NoX6z"></a>
#### 3.2 vite.config.ts
```jsx
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
	plugins: [
  	reactRefresh()
  ]
})
```
<a name="gg1sk"></a>
#### 3.3 tsconfig.js 	
```bash
{
    "compilerOptions": {
        "target": "ESNext",
        "lib": ["DOM","DOM.Iterable","ESNext"],
        "allowJs": false,
        "skipLibCheck": false,
        "esModuleInterop": false,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "module": "ESNext",
        "moduleResolution": "Node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react",
        "types": ["react/next","react-dom/next"]
    },
    "include": ["./src"]
}
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/157828/1630292918153-c7d1927b-5723-49c0-88f5-446de9daeddf.png#clientId=uedffbbe1-7c54-4&from=paste&height=164&id=u5391c40e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=328&originWidth=1046&originalType=binary&ratio=1&size=61289&status=done&style=none&taskId=u19b87bcd-2d6e-4c4d-9523-9137de93848&width=523)<br />

<a name="GLm6c"></a>
### 4.批量更新

- automatic batching
- 在 concurrent 模式中更新是以优先级为依据进行合并的

​<br />
<a name="WbPY2"></a>
#### 4.1 安装路由

- npm强制安装 可以使用 -f/--force 参数
```bash
npm install react-router-dom @types/react-router-dom --force -S
```
```diff
import React from "react";
import { render, createRoot } from "react-dom";
+import { HashRouter as Router, Route, Link } from 'react-router-dom';
+import BatchState from './routes/BatchState';

+const routes = (
+    <Router>
+        <ul>
+            <li>
+                <Link to='/BatchState'>batchState</Link>
+            </li>
+       </ul>
+       <Route path='/BatchState' component={ BatchState }></Route>
+   </Router>
+);

-render(routes, document.getElementById('root'));
+createRoot(document.getElementById('root')!).render(routes);
```
<a name="Iy7Sn"></a>
#### 4.2 BatchState组件
<a name="ozOKQ"></a>
#### 4.2.1 this.setState原来的渲染模式
```jsx
import React from 'react';

export default class BatchState extends React.Component {
    state = {
        number: 0
    }
    handClk = () => {
        this.setState({ number: this.state.number + 1 });
        this.setState({ number: this.state.number + 1 });
        setTimeout(() => {
            this.setState({ number: this.state.number + 1 });
            this.setState({ number: this.state.number + 1 });
        });
    }
    render() {
        return (
            <>
                <p>{ this.state.number }</p>
                <button onClick={ this.handClk }>+</button>
            </>
            
        )
    }
}
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/157828/1630303123104-d068ef21-af16-4ca1-8a56-85ad35094114.png#clientId=uedffbbe1-7c54-4&from=paste&height=439&id=u15cdd8c4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=878&originWidth=1256&originalType=binary&ratio=1&size=403256&status=done&style=none&taskId=ue7eaf158-cb33-48de-9657-7d68857b786&width=628)<br />![image.png](https://cdn.nlark.com/yuque/0/2021/png/157828/1630304500228-29f61b27-4132-43ca-bf8b-aa3c55f7cc57.png#clientId=uedffbbe1-7c54-4&from=paste&height=200&id=u23ded0ec&margin=%5Bobject%20Object%5D&name=image.png&originHeight=127&originWidth=159&originalType=binary&ratio=1&size=5238&status=done&style=none&taskId=ubef18a81-8811-4323-bc52-d6bbfcb650b&width=250.5)

- 结论
   - setTimeout外的代码先执行，但是并没有立马改变，而是异步改变，
   - setTimeout外3个this.setState只会执行一遍
<a name="GSgfr"></a>
#### 4.2.2 原理

- 通过变量控制同步代码
- 异步代码直接更新
```javascript
/**
 * React更新 是异步的 是批量的
 * 
 */

// 同步更新模式的原理
let state = 0;
let isBatchingUpdate = false; // 如果是同步更新
const updateArray = [];

const setState = (newState) => {
    // 同步代码放进数组
    if (isBatchingUpdate) {
        updateArray.push(newState);
    }
    else {
      // 异步代码直接更新
        state = newState;
    }
}
// 1.同步代码只会执行一个setState，取最后一个结果
// 2.setTimeout里的代码立即执行替换
const updateOp = () => {
    setState(state + 1);
    console.log('打印state==>', state);

    setState(state + 1);
    console.log('打印state==>', state);

    // 异步的时候 isBatchingUpdate已经是false 所以立即执行替换
    setTimeout(() => {
        console.log('打印state==>', state);
      
        setState(state + 1);
        console.log('打印state==>', state);

        setState(state + 1);
        console.log('打印state==>', state);
    });
}
const handleClk = () => {
    isBatchingUpdate = true;
    updateOp();
    isBatchingUpdate = false;
}

handleClk();
state = updateArray.pop(); // 取出更新队列的最后一个结果 可以保证setState永远只有一个
```
<a name="Xq0Tm"></a>
#### 4.3 React18 怎么做到批量更新的
<a name="iHkJ4"></a>
#### 4.4 Suspense
```javascript
import { Suspense } from 'react';

<Suspense fallback={<div>loading.....</div>}>
    <Users/>
</Suspense>
```

- 让组件在渲染之前等待，等待时显示fallback里面的内容
- 执行流程
   - 在render函数中可以使用异步请求数据
   - react会从缓存中读取这个异步数据
   - 如果有缓存，就直接进行正常render
   - 如果没有，就抛出Promsie异常
   - 当这个Promise完成，react会继续回到原来的render中，把数据render出来
   - 完全同步写法，没有任何异步callback
- React提供内置函数 `componentDidCatch`  父组件可以通过该API捕获到下面子组件报错的信息



<a name="gEuB8"></a>
#### 4.5 SuspenseList

- revealOrder Suspense加载顺序
   - together 所有Suspense一起显示，也就是最后一个加载完了才一起显示全部
   - forwards 按照顺序显示Suspense
   - backwards 反序显示Suspense
- tail是否显示fallback，只在revealOrder为forwards或者backwards时候有效
   - hidden 不显示
   - collapsed 轮到自己再显示
```jsx
import { SuspenseList, Suspense } from 'react';

<SuspenseList revealOrder="forwards/backwards/together" tail="collapsed/hidden">
	<Suspense fallback={<div>loading1.....</div>}/>    
     <Users1/>
	</Suspense>
                      
  <Suspense fallback={<div>loading2.....</div>}/>
    <Users2/>
	</Suspense>
</SuspenseList>
```
<a name="S3rgC"></a>
#### 4.6 ErrorBoundary 
```typescript
import React from 'react';

interface Props {
    fallback: React.ReactNode
}
export default class ErrorBoundary extends React.Component<Props> {
    state = {
        hasError: false,
        errorMsg: null
    }
    static getDerivedStateFromError(error:any) {
        return {
            hasError: true,
            errorMsg: error
        }
    }
    render() {
        const { fallback, children } = this.props;
        const { hasError, errorMsg } = this.state;
        if (hasError) {
            return fallback;
        }
        return children;
    }
}
```
```jsx
<ErrorBoundary fallback={<div>Oops~~数据请求失败了...</div> }>
  <Suspense fallback={<div>加载中...</div>}>
    <User/>
  </Suspense>
</ErrorBoundary>
```
​

<a name="mhZEL"></a>
#### 4.7 StartTansition
startTransition包裹里的更新函数被当做是非紧急事件，<br />如果有别的紧急更新（urgent update）进来，那么这个startTransition包裹里的更新则会被打断。
<a name="Qf8li"></a>
##### transition
React把状态更新分成两种：

   - Urgent updates 紧急更新，指直接交互。如点击、输入、滚动、拖拽等
   - Transition updates 过渡更新，如UI从一个视图向另一个视图的更新
```jsx
import React, { startTransition } from 'react';

startTransition(() => {
   ...code 不紧急的渲染任务
})
```
```typescript
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
```
<a name="cYvNI"></a>
#### ​<br />
<a name="c0hWt"></a>
#### 4.8 useTransition
```jsx
import React, { useTransition } from 'react';

render() {
		const [isPending, startTransition ] = useTransition();
  
    const handclk = () => {
    	startTransition(()=>{
      		...code
      })
    }
		return (
      { isPending ? <div>如果你想知道startTransition的进度，我想告诉你，还在pending中。。。</div> : null}
    )
}
```
<a name="mQ8Zf"></a>
#### 4.9 useDeferredValue
延迟更新某个不那么重要的部分
```jsx
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
```
<a name="VRGSO"></a>
#### 参考

- [https://www.bilibili.com/video/BV1JU4y137Wt](https://www.bilibili.com/video/BV1JU4y137Wt)
- [https://github.com/bubucuo/react18-ice?spm_id_from=333.788.b_765f64657363.1](https://github.com/bubucuo/react18-ice?spm_id_from=333.788.b_765f64657363.1)
- [https://reactjs.org/docs/concurrent-mode-patterns.html#wrap-lazy-features-in-suspense](https://reactjs.org/docs/concurrent-mode-patterns.html#wrap-lazy-features-in-suspense)