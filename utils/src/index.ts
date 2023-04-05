///倒计时的工具方法
export function timeout(fn: Function, time: number) {
    let timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        fn();
    }, time);
}