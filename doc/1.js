/**
 * React更新 是异步的 是批量的
 * 
 */

// 同步更新模式的原理
let state = 0;
let isBatchingUpdate = false; // 如果是同步更新
const updateArray = [];

const setState = (newState) => {
    if (isBatchingUpdate) {
        updateArray.push(newState);
    }
    else {
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
state = updateArray.pop(); // 取出更新队列的最后一个结果