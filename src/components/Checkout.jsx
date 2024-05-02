import { useContext, useState } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type':'application/json'  //to inform the backend that we submit json formatted data,
    },
    

}
export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);
    const {data, isLoading:isSending, error, sendRequest, clearData} = useHttp('https://foodapp-api-2.onrender.com/orders', requestConfig);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);
    let customerData;

    function handleClose() {
        userProgressCtx.hideCheckout();
    }

    function handleFinish(){
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    function handleSubmit(event){
        event.preventDefault(); // To avoid sending a request to the frontend
        
        const fd = new FormData(event.target);
        customerData = Object.fromEntries(fd.entries());
        
        sendRequest(JSON.stringify({
            order: {
                items:cartCtx.items,
                customer: customerData,
            },
        })
    );
    }
let actions = (
    <>
    <Button textOnly type='button' onClick={handleClose}>Close</Button>
    <Button>Submit Order</Button> 
    </>
);
 
    if(isSending){
        actions = (<span>Sending order...</span>)
    }
    if(data && !error){
        return (
            <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
                <h2>Success</h2>
                <p>Thank you for your order. We'll inform you by e-mail as soon as it's ready</p>
                <p>For any question call 555-666-999</p>
                <p className="modal-actions">
                    <Button onClick={handleFinish}>OK</Button>
                </p>
            </Modal>
        )
    }
    
    return (
        <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
                <Input label="Full Name" type="text" id="name" />  
                <Input label="E-Mail" type="email" id="email" />
                <Input label="Street" type="text" id="street" />
                <div className="control-row">
                    <Input label="Postal Code" type="text" id="postal-code" />
                    <Input label="City" type="text" id="city" />
                </div>
                {error && <Error title="failed to send order" message={error}/>}
                <p className="modal-actions">
                    {actions}
                </p>
            </form>
        </Modal>
    );
}
