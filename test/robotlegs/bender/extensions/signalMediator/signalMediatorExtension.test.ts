//------------------------------------------------------------------------------
// Copyright (c) 2017 San Dinh Studios. All Rights Reserved.
//
// NOTICE: You are permitted to use, modify, and distribute this file
// in accordance with the terms of the license agreement accompanying it.
//------------------------------------------------------------------------------

import "../../../../entry.ts";
import { assert } from "chai";
import { Context } from "@robotlegsjs/core";
import { SignalMediatorExtension } from "../../../../../src/robotlegs/bender/extensions/signalMediator/SignalMediatorExtension";
import { ISignalMap } from "../../../../../src/robotlegs/bender/extensions/signalMediator/api/ISignalMap";
import { SignalMap } from "../../../../../src/robotlegs/bender/extensions/signalMediator/impl/SignalMap";
import { RelaySignal } from "./support/Signals";
import { Data } from "./support/Data";

describe("SignalMediatorExtension", () => {

    let context: Context;
    let handler: Function;
    let DATA: number;

    beforeEach(() => {
        context = new Context();
        DATA = 0;
        handler = (data: Data) => {
            DATA = data.value;
        }
    });

    afterEach(() => {
        context = null;
        DATA = 0;
    });

    it("signalMap is mapped into injector", () => {
        let actual: Object = null;
        context.install(SignalMediatorExtension);
        context.whenInitializing(function(): void {
            actual = context.injector.get(ISignalMap);
        });
        context.initialize();
        assert.isNotNull(actual);
        assert.instanceOf(actual, SignalMap);
    });

    it("chained injections pass through injection targets", () => {
        context.install(SignalMediatorExtension);
        context.injector.bind(RelaySignal).toConstantValue(new RelaySignal());
        context.initialize();

        let instance: ISignalMap = context.injector.get<ISignalMap>(ISignalMap);
        let signal = context.injector.get<RelaySignal>(RelaySignal);

        instance.addToSignal(signal, handler);

        DATA = 0;
        context.injector.get<RelaySignal>(RelaySignal).dispatch(new Data(3));
        assert.equal(DATA, 3);
    });
});
