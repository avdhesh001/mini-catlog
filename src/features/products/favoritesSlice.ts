import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FavoritesState = {
  ids: Record<string, boolean>;
};

const initialState: FavoritesState = {
  ids: {},
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.ids[id] = !state.ids[id];
    },
    setFavorite: (state, action: PayloadAction<{ id: string; value: boolean }>) => {
      state.ids[action.payload.id] = action.payload.value;
    },
    clearFavorites: (state) => {
      state.ids = {};
    },
  },
});

export const { toggleFavorite, setFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
