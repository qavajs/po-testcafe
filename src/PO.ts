import parseTokens, { Token } from './parseTokens';
import { Selector } from 'testcafe';
import { Definition } from './register';

interface PageObject {
    selector?: string;
}

class PO {

    private config: { timeout?: number } = {};

    public init(options = { timeout: 2000 }) {
        this.config.timeout = options.timeout;
    }

    /**
     * Get element from page object
     * @public
     * @param {string} alias
     * @returns { Selector }
     */
    public getElement(alias: string): Selector {
        const tokens: Array<Token> = parseTokens(alias);
        let po: PO | PageObject = this;
        let element = Selector('html');
        while (tokens.length > 0) {
            const token = tokens.shift() as Token;
            [element, po] = this.getEl(element, po, token);
        }
        return element
    }

    public register(obj: Object) {
        for (const prop in obj) {
            // @ts-ignore
            this[prop] = obj[prop]
        }
    };

    /**
     * Get element by provided page object and token
     * @private
     * @param {Selector} element
     * @param {Object} po
     * @param {Token} token
     * @returns
     */
    private getEl(element: Selector, po: Object, token: Token): [Selector, Object] | undefined {
        const elementName: string = token.elementName.replace(/\s/g, '');
        // @ts-ignore
        const newPo: Definition = po[elementName];
        if (!newPo) throw new Error(`${token.elementName} is not found`);
        const currentElement = newPo.ignoreHierarchy ? Selector('html') : element;
        if (!newPo.isCollection && token.suffix) throw new Error(`Unsupported operation. ${token.elementName} is not collection`);
        if (newPo.isCollection && !newPo.selector) throw new Error(`Unsupported operation. ${token.elementName} selector property is required as it is collection`);
        if (!newPo.selector) return [currentElement, newPo];

        if (newPo.isCollection && token.suffix === 'in') return [
            this.getElementByText(currentElement, newPo, token),
            newPo
        ];
        if (newPo.isCollection && token.suffix === 'of') return [
            this.getElementByIndex(currentElement, newPo, token),
            newPo
        ];
        return [this.getSingleElement(currentElement, newPo.selector), newPo]
    }

    /**
     * @private
     * @param {Selector} element - element to get
     * @param {Definition} po - page object
     * @param {Token} token - token
     * @returns
     */
    private getElementByText(element: Selector, po: Definition, token: Token): Selector {
        const tokenValue = token.value as string;
        if (token.prefix === '#') {
            return element.find(po.selector).withText(tokenValue);
        }
        if (token.prefix === '@') {
            return element.find(po.selector).withExactText(tokenValue);
        }
        if (token.prefix === '/') {
            return element.find(po.selector).withText(new RegExp(tokenValue));
        }
        throw new Error(`${token.prefix} is not supported`)
    }

    /**
     * @private
     * @param {Selector} element - element to get
     * @param {Definition} po - page object
     * @param {Token} token - token
     * @returns
     */
    private getElementByIndex(element: Selector, po: Definition, token: Token): Selector {
        const index = parseInt(token.value as string) - 1;
        return element.find(po.selector).nth(index);
    }

    /**
     * @private
     * @param {Selector} element - element to get
     * @param {string} selector - selector
     * @returns
     */
    private getSingleElement(element: Selector, selector: string) {
        return element.find(selector);
    }

}

export default new PO();
