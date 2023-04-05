/** Event触发 */
export default class Event {
    events: any
    constructor() {
        this.events = Object.create(null)
    }

    // tslint:disable-next-line: ban-types
    on(name: string, fn: Function) {
        if (!this.events[name]) {
            this.events[name] = []
        }
        this.events[name].push(fn)
        return this
    }

    emit(name: string, ...args: any) {
        if (!this.events[name]) {
            return this
        }
        const fns = this.events[name]
        fns.forEach((fn: any) => fn.call(this, ...args))
        return this
    }

    // tslint:disable-next-line: ban-types
    off(name: string, fn: Function) {
        if (!this.events[name]) {
            return this
        }
        if (!fn) {
            this.events[name] = null
            return this
        }
        const index = this.events[name].indexOf(fn)
        this.events[name].splice(index, 1)
        return this
    }

    // tslint:disable-next-line: ban-types
    once(name: string, fn: Function) {
        const only = () => {
            fn.apply(this, arguments)
            this.off(name, only)
        }
        this.on(name, only)
        return this
    }
}