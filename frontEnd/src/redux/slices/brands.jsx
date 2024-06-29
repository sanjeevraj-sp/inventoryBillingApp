import { createSlice } from "@reduxjs/toolkit";

const brandSlice = createSlice({
    name: 'brand_state',
    initialState: {
        brandData: [], 
    },

    reducers: {
        setBrands: (state, action) => {
            state.brandData = action.payload.brands;
        },

        addBrand: (state, action) => {
            const brand = action.payload.newBrand;
            state.brandData.push(brand); 
        },

        updateBrand: (state, action) => {
            const updatedBrand = action.payload.updatedBrand;
            const index = state.brandData.findIndex((brand) => brand._id === updatedBrand._id);
            if (index !== -1) {
              const updatedBrandData = [...state.brandData];
              updatedBrandData[index] = updatedBrand;
              return { ...state, brandData: updatedBrandData };
            } else {
              return state;
            }
          },
          

        deleteBrand: (state, action) => {
            const delBrandId = action.payload.delBrandId;
            const updatedBrandData = state.brandData.filter((brand) => brand._id !== delBrandId);
            return { ...state, brandData: updatedBrandData };
        }
          
        
    }
});

export const { setBrands, addBrand , updateBrand , deleteBrand } = brandSlice.actions;
export default brandSlice.reducer;
