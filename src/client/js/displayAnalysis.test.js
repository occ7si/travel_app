import { displaySentimentAnalysis } from './displayAnalysis'

test('If Aylien input is empty, throw error', () => {
    expect(() => {
        displaySentimentAnalysis({});
    }).toThrow();
});