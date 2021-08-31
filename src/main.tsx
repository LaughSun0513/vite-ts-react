import React from "react";
import { render, createRoot } from "react-dom";
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import BatchState from './routes/BatchState';
import Suspense from "./routes/Suspense";
import MySuspense from "./routes/MySuspense";
import SuspenseList from "./routes/SuspenseList";
import ErrorBoundary from './routes/ErrorBoundary';
import StartTransition from './routes/StartTransition';
import UseTransitionDemo from './routes/UseTransitionDemo';
import UseDeferredValueDemo from './routes/UseDeferredValueDemo';


// render(<h1>hello</h1>, document.getElementById('root'));
// createRoot(document.getElementById('root')!).render(<h1>hello 111</h1>);

const routes = (
    <Router>
        <ul>
            <li><Link to='/BatchState'>batchState 一起批量更新</Link></li>
            <li><Link to='/Suspense'>Suspense可以添加失败UI或者过渡UI</Link></li>
            {/* <li><Link to='/MySuspense'>MySuspense</Link></li> */}
            <li><Link to='/SuspenseList'>SuspenseList可以批量放Suspense</Link></li>
            <li><Link to='/ErrorBoundary'>ErrorBoundary捕获子组件错误的父组件</Link></li>
            <li><Link to='/StartTransition'>StartTransition让页面上的请求直接覆盖切换，而不是loading闪一下再出现</Link></li>
            <li><Link to='/UseTransitionDemo'>UseTransitionDemo 可以知道StartTransition的进度</Link></li>
            <li><Link to='/UseDeferredValue'>UseDeferredValue 延迟更新某个不那么重要的部分</Link></li>
        </ul>
        <Route path='/BatchState' component={BatchState}></Route>
        <Route path='/Suspense' component={Suspense}></Route>
        {/* <Route path='/MySuspense' component={MySuspense}></Route> */}
        <Route path='/SuspenseList' component={SuspenseList}></Route>
        <Route path='/ErrorBoundary' component={ErrorBoundary}></Route>
        <Route path='/StartTransition' component={StartTransition}></Route>
        <Route path='/UseTransitionDemo' component={ UseTransitionDemo }></Route>
        <Route path='/UseDeferredValue' component={ UseDeferredValueDemo }></Route>
    </Router>
)
// render(routes, document.getElementById('root'));
createRoot(document.getElementById('root')!).render(routes);
