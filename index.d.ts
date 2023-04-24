import { Selector } from 'testcafe';
declare function $(selector: string|Object, options?: { ignoreHierarchy: boolean }): Object;
declare function $$(selector: string|Object, options?: { ignoreHierarchy: boolean }): Object;
declare type PageObject = {
    init(options: { timeout: number }): void;
    register(pageObject: Object): void;
    getElement(path: string): Selector
}
declare let po: PageObject;
declare class Component {
    constructor(selector?: string | object)
}
declare module '@qavajs/po-playwright' {
    export { $, $$, po, Component }
}
