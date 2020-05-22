import { timeToDeparture } from '../client/js/handler'


test('days left until date', () => {
    const today = new Date();
    expect(timeToDeparture(today)).toBe(0);
});
