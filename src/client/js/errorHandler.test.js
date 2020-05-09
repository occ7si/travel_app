import { showErrorMsg } from './errorHandler'

test('Returns error if input string is empty', () => {
    expect(() => {
        showErrorMsg('');
    }).toThrow();
});