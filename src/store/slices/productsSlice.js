import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getProducts } from '../../TS/dataService'

const initialState = {
    products: [],
    isPending: true,
    isError: false,
    total: 0,
    productsTotals: {},
    productsQuantity: {},
    discount: 0,
}

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        getTotalPriceOfProducts: (state) => {
            if (state.products.length !== 0) {
                const total = state.products.reduce((acc, product) => {
                    return acc + state.productsTotals[product.id]
                }, 0)

                state.total = total
            }
        },

        increaseQuantity: (state, { payload: { id, quantity } }) => {
            const productQuantity = state.products.find(
                (product) => product.id === id
            ).availableCount

            if (productQuantity > quantity) {
                state.productsQuantity[id] = quantity + 1
            }
        },

        decreaseQuantity: (state, { payload: { id, quantity } }) => {
            if (quantity !== 0) {
                state.productsQuantity[id] = quantity - 1
            }
        },

        getTotalPriceOfProduct: (state, { payload: { id, price } }) => {
            let total = 0
            for (let index = 0; index < state.productsQuantity[id]; index++) {
                total += price
            }
            state.productsTotals[id] = total
        },

        getDiscountOfProduct: (state) => {
            const total = state.total
            if (total >= 1000) {
                const discount = total / 10
                state.discount = discount
                state.total = total - discount
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductsThunk.fulfilled, (state, { payload }) => {
                console.log(payload)
                state.products = payload
                state.isPending = false
                state.isError = false
                getTotalPriceOfProducts(payload)
            })
            .addCase(getProductsThunk.pending, (state) => {
                state.isPending = true
                state.isError = false
            })
            .addCase(getProductsThunk.rejected, (state) => {
                state.isPending = false
                state.isError = true
            })
    },
})

export const getProductsThunk = createAsyncThunk(
    'products/getProductsThunk',
    async () => {
        try {
            const response = await getProducts()
            return response.products
        } catch (error) {
            throw error.message || error
        }
    }
)

export const {
    getTotalPriceOfProducts,
    increaseQuantity,
    decreaseQuantity,
    getTotalPriceOfProduct,
    getDiscountOfProduct,
} = productsSlice.actions
