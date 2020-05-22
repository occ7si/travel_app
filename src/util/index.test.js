import { getPictureForDest } from'../server/index'

test('If getPictureForDest is called without a city name throw an error', () => {
    expect(() => {
        getPictureForDest('');
    }).toThrow();
});