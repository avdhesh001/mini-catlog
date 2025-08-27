import reducer, { toggleFavorite } from './favoritesSlice';

test('toggle favorites', () => {
  let state = reducer(undefined, { type: 'init' } as any);
  state = reducer(state, toggleFavorite('p1'));
  expect(state.ids['p1']).toBe(true);
  state = reducer(state, toggleFavorite('p1'));
  expect(state.ids['p1']).toBe(false);
});
