/**
 * Utility class that simplifies page object creation
 */
export class Component {

    selector?: string | object;
    /**
     * @param {object | string} selector - component selector
     */
    constructor(selector?: object | string) {
        this.selector = selector;
    }

}
