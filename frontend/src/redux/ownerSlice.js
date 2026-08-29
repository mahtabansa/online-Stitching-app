import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    myShopData: null,
  },

  reducers: {
    setMyShopData: (state, actions) => {
      state.myShopData = actions.payload;
    },
    updateMyshopData: (state, action) => {
      const { shopId, shop, created } = action.payload;

      if (!shopId || !shop) return;

      // agar myShopData abhi null/undefined hai, empty array bana do
      if (!state.myShopData) {
        state.myShopData = [];
      }

      const index = state.myShopData.findIndex(
        (s) => String(s._id) === String(shopId),
      );

      if (index !== -1) {
        // existing shop -> update
        state.myShopData[index] = { ...state.myShopData[index], ...shop };
      } else {
        // naya shop -> array mein push karo
        state.myShopData.push(shop);
      }
    },
    updateShopItem: (state, action) => {
      const { shopId, itemId, item } = action.payload;

      if (!shopId || !itemId || !item) {
        console.log("shopId, itemId or item missing");
        return;
      }
      if (!state.myShopData) {
        console.log("myShopData not loaded yet");
        return;
      }

      const shopIndex = state.myShopData.findIndex(
        (s) => String(s._id) === String(shopId),
      );
      if (shopIndex === -1) {
        console.log("shop not found");
        return;
      }

      const itemIndex = state.myShopData[shopIndex].items.findIndex(
        (i) => String(i._id) === String(itemId),
      );
      if (itemIndex === -1) {
        console.log("item not found in shop items array");
        return;
      }

      state.myShopData[shopIndex].items[itemIndex] = {
        ...state.myShopData[shopIndex].items[itemIndex],
        ...item,
      };
    },

    setNewItem: (state, actions) => {
      const { shopId, Item } = actions.payload;
      if (!shopId || !Item) {
        console.log("shopId or item missing");
        return;
      }
      if (!state.myShopData) {
        console.log("myShopData not loaded yet");
        return;
      }

      const shopIndex = state.myShopData.findIndex(
        (s) => String(s._id) === String(shopId),
      );

      if (shopIndex === -1) {
        console.log("shop not found");
        return;
      }

      if (shopIndex === -1) {
        console.log("shop not found");
        return;
      }

      if (!state.myShopData[shopIndex].items) {
        state.myShopData[shopIndex].items = [];
      }

      state.myShopData[shopIndex].items.unshift(Item);
    },
    deleteItem: (state, actions) => {
      const { shopId, ItemId, Item } = actions.payload;
      if ((!shopId || !Item, !ItemId)) {
        console.log("shopId or ItemId or item missing");
        return;
      }
      if (!state.myShopData) {
        console.log("myShopData not loaded yet");
        return;
      }

      const shopIndex = state.myShopData.findIndex(
        (s) => String(s._id) === String(shopId),
      );

      if (shopIndex === -1) {
        console.log("shop not found");
        return;
      }

      state.myShopData[shopIndex].items = state.myShopData[
        shopIndex
      ].items.filter((i) => String(i._id) !== String(ItemId));
    },
  },
});
export const {
  setMyShopData,
  updateMyshopData,
  updateShopItem,
  setNewItem,
  deleteItem,
} = ownerSlice.actions;

export const ownerReducer = ownerSlice.reducer;
export default ownerSlice.reducer;
