import type { ProductInterface } from '@/types/product.Type'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
const initialState={
   products:[] as ProductInterface[]
}

export  const productAction=createAsyncThunk("Product/getAllProducts",async()=>{

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/products`);
    if (!response.ok) throw new Error("Unable to load products");
    const res: ProductInterface[] = (await response.json()).data;

return res;

})

export const ProductSlice = createSlice({
     name: 'Product',
     initialState,

        reducers:{

        },
        extraReducers:(builder)=>{
builder.addCase(productAction.pending,(state,action)=>{


});
builder.addCase(productAction.fulfilled,(state,action)=>{
    state.products=action.payload

});

builder.addCase(productAction.rejected,(state,action)=>{
    
});

        }
     }
    )
    export const ProductReducer=ProductSlice.reducer;


