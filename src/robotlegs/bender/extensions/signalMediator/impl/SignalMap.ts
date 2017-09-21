import { injectable } from "robotlegs";
import { ISignalMap } from "../api/ISignalMap";
import { ISignal } from "signals.js";

@injectable()
export class SignalMap implements ISignalMap {

    /*============================================================================*/
    /* Protected Properties                                                       */
    /*============================================================================*/

    protected _handlersBySignal: Map<ISignal, Array<Function>> = new Map();

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    addToSignal(signal: ISignal, handler: Function): void {
        signal.add(handler);
        this.storeSignalHandler(signal, handler);
    }

    addOnceToSignal(signal: ISignal, handler: Function): void {
        signal.addOnce(handler);
        this.storeSignalHandler(signal, handler);
    }


    /**
     * @private
     */
    removeFromSignal(signal: any, handler: Function): void {
        signal.remove(handler);

        const oldHandlers = this._handlersBySignal.get(signal);

        if (oldHandlers == undefined || oldHandlers.length == 0) {
            return;
        }

        const handlerIndex = oldHandlers.indexOf(handler);

        if (handlerIndex > -1) {
            oldHandlers.splice(handlerIndex, 1);
        }
    }

    /**
     * @private
     */
    removeAll(): void {
        this._handlersBySignal.forEach(
            (handlers, signal) => handlers.forEach(handler => signal.remove(handler))
        );

        this._handlersBySignal.clear();
    }

    /*============================================================================*/
    /* Protected Functions                                                        */
    /*============================================================================*/

    protected storeSignalHandler(signal: any, handler: Function): void {
        if (!this._handlersBySignal.has(signal)) {
            this._handlersBySignal.set(signal, [handler]);
        } else {
            this._handlersBySignal.get(signal).push(handler);
        }
    }
}