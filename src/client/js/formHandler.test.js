import { handleSubmit } from './formHandler'

test('If handleSubmit is called without argument, throw an error', () => {
        expect(() => {
            handleSubmit(null);
        }).toThrow();
    });