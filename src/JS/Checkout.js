import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    decreaseQuantity,
    getDiscountOfProduct,
    getProductsThunk,
    getTotalPriceOfProduct,
    getTotalPriceOfProducts,
    increaseQuantity,
} from '../store/slices/productsSlice'
import styles from './Checkout.module.css'
import { LoadingIcon } from './Icons'

const Product = ({
    id,
    name,
    availableCount,
    price,
    orderedQuantity,
    total,
}) => {
    const dispatch = useDispatch()
    const onIncrement = () => {
        dispatch(
            increaseQuantity({
                id,
                quantity: orderedQuantity === undefined ? 0 : orderedQuantity,
            })
        )
    }

    const onDecrement = () => {
        dispatch(
            decreaseQuantity({
                id,
                quantity: orderedQuantity === undefined ? 0 : orderedQuantity,
            })
        )
    }

    useEffect(() => {
        dispatch(getTotalPriceOfProduct({ id, price }))
    }, [orderedQuantity])
    return (
        <tr>
            <td>{id}</td>
            <td>{name}</td>
            <td>{availableCount}</td>
            <td>${price}</td>
            <td>{orderedQuantity}</td>
            <td>${Number(total).toFixed(2)}</td>
            <td>
                <button className={styles.actionButton} onClick={onIncrement}>
                    +
                </button>
                <button className={styles.actionButton} onClick={onDecrement}>
                    -
                </button>
            </td>
        </tr>
    )
}

const Checkout = () => {
    const dispatch = useDispatch()
    const {
        products,
        isPending,
        isError,
        total,
        productsTotals,
        productsQuantity,
        discount,
    } = useSelector((state) => state.products)
    useEffect(() => {
        dispatch(getProductsThunk())
    }, [])
    useEffect(() => {
        dispatch(getTotalPriceOfProducts())
        dispatch(getDiscountOfProduct())
    }, [productsTotals])
    return (
        <div>
            <header className={styles.header}>
                <h1>Electro World</h1>
            </header>
            <main>
                {isPending && <LoadingIcon />}
                {isError && (
                    <h4 style={{ color: 'red' }}>Some thing went wrong</h4>
                )}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th># Available</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {!isError &&
                            products?.map(
                                ({ id, name, availableCount, price }) => (
                                    <Product
                                        key={id}
                                        id={id}
                                        availableCount={availableCount}
                                        name={name}
                                        price={price}
                                        orderedQuantity={
                                            productsQuantity[id]
                                                ? productsQuantity[id]
                                                : 0
                                        }
                                        total={productsTotals[id]}
                                    />
                                )
                            )}
                    </tbody>
                </table>
                <h2>Order summary</h2>
                <p>Discount: $ {Number(discount).toFixed(2)} </p>
                <p>Total: $ {Number(total).toFixed(2)}</p>
            </main>
        </div>
    )
}

export default Checkout
