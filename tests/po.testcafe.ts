import po from '../src/PO';
import samplePO from './samplePO';
import { $ } from '../src/register';

fixture`Test structure`
    .page`./test_page.html`
    .beforeEach(async (t: TestController) => {
        po.init({ timeout: 5000 });
        po.register(samplePO);
    });

test('get single element', async (t) => {
    const element = await po.getElement('Single Element');
    await t.expect(element.innerText).eql('text of single element');
});

test('get collection', async (t) => {
    const collection = await po.getElement('List');
    await t.expect(collection.count).eql(6);
});

test('get element from collection by index', async (t) => {
    const element = await po.getElement('#2 of List');
    await t.expect(element.innerText).eql('Second');
});

test('get element from collection by partial text', async (t) => {
    const element = await po.getElement('#Thi in List');
    await t.expect(element.innerText).eql('Third');
});

test('get element from collection by exact text', async (t) => {
    const element = await po.getElement('@Third in List');
    await t.expect(element.innerText).eql('Third');
});

test('get element from collection by regexp text', async (t) => {
    const element = await po.getElement('/Thi/ in List');
    await t.expect(element.innerText).eql('Third');
});

test('get element from component', async (t) => {
    const element = await po.getElement('Single Component > Child Item');
    await t.expect(element.innerText).eql('text of first child item');
});

test('get element from multiple component item by index', async (t) => {
    const element = await po.getElement('#2 of Multiple Components > ChildItem');
    await t.expect(element.innerText).eql('second inner');
});

test('get element from multiple component item by partials text', async (t) => {
    const element = await po.getElement('#second in Multiple Components > Child Item');
    await t.expect(element.innerText).eql('second inner');
});

test('get element from multiple component item by exact text', async (t) => {
    const element = await po.getElement('@third inner in Multiple Components > Child Item');
    await t.expect(element.innerText).eql('third inner');
});

test('get child item of each element of collection', async (t) => {
    const collection = await po.getElement('Multiple Components > Child Item');
    await t.expect(collection.count).eql(3);
    await t.expect(collection.nth(0).innerText).eql('first inner');
});

test('get element from collection by partial text containing in', async (t) => {
    const element = await po.getElement('#Contain in in List');
    await t.expect(element.innerText).eql('Contain in word');
});

test('get element that not exist in collection by text', async (t) => {
    const element = await po.getElement('#notexist in List');
    await t.expect(element.visible).eql(false);
});

test('get element that not exist in collection by index', async (t) => {
    const element = await po.getElement('#42 of List');
    await t.expect(element.visible).eql(false);
});

test('get element from async collection', async (t) => {
    const element = await po.getElement('Async Component > #2 of Child Items');
    await t.expect(element.innerText).eql('async 2');
});

test('get collection from collection', async (t) => {
    const elements = await po.getElement('Level 1 Elements > Level 2 Elements > List Items');
    const text7 = elements.nth(6).innerText;
    await t.expect(text7).eql('x31');
    await t.expect(elements.count).eql(9);
});

//TODO not supported currently
test.skip('get collection element from collection', async (t) => {
    const elements = await po.getElement('Level 1 Elements > Level 2 Elements > #2 of List Items');
    const text12 = await elements.nth(0).innerText;
    const text22 = await elements.nth(0).innerText;
    const text32 = await elements.nth(0).innerText;
    await t.expect(text12).eql('x12');
    await t.expect(text22).eql('x22');
    await t.expect(text32).eql('x32');
    await t.expect(await elements.count).eql(3);
});

test('ignore hierarchy flag', async (t) => {
    const element = await po.getElement('Single Component > Ignore Hierarchy Item');
    await t.expect(element.innerText).eql('first inner');
});

test('get not existing element', async (t) => {
    try {
        await po.getElement('Not Existing Element');
        throw new Error('error has not been thrown')
    } catch (err) {
        await t.expect(err.message).eql('Not Existing Element is not found')
    }
});

test('throw error if params are not passed into register function', async (t) => {
    try {
        //@ts-ignore
        $();
        throw new Error('error has not been thrown')
    } catch (err) {
        await t.expect(err.message).eql('Selector or component should be passed!')
    }
});

test('get element from component without selector', async (t) => {
    const element = await po.getElement('Component Without Selector > Single Element');
    await t.expect(element.innerText).eql('text of single element');
});

test('get element from collection from component without selector', async (t) => {
    const element = await po.getElement('Component Without Selector > #2 of List');
    await t.expect(element.innerText).eql('Second');
});

test('throw an error if component without selector registered as collection', async (t) => {
    try {
        await po.getElement('#1 of Components Without Selector > #2 of List');
        throw new Error('error has not been thrown')
    } catch (err) {
        await t.expect(err.message).eql('Unsupported operation. Components Without Selector selector property is required as it is collection')
    }
});

