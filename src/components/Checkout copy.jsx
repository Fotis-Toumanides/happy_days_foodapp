import { useContext, useState } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";

export default function Checkout() {
    const[isSending, setIsSending] = useState(false)
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);
    let customerData;

    function handleClose() {
        userProgressCtx.hideCheckout();
    }

    function handleFinish(){
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();        
    }

    function handleSubmit(event){
        event.preventDefault(); // To avoid sending a request to the frontend
        setIsSending(true);
        const fd = new FormData(event.target);
        customerData = Object.fromEntries(fd.entries());
        
        fetch('http://localhost:3000/orders', {
            method:'POST',
            headers: {
                'Content-Type':'application/json'  //to inform the backend that we submit json formatted data
            },
            body: JSON.stringify({
                order: {
                    items:cartCtx.items,
                    customer: customerData
                }
            })
        })

        return(
            
            <Modal open={true} onClose={handleFinish}>{console.log("check")}
                <p>Your order was submitted</p>
                <p>Thank you so much! We'll get back to you in a few minutes</p>
                <p>Check your E-Mail</p>
                <p className="modal-actions">
                    <Button onClick={handleFinish}>Ok</Button>
                </p>
            </Modal>
        )
    }
    // id names bellow must much backend names
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
                <p className="modal-actions">
                <Button textOnly type='button' onClick={handleClose}>Close</Button>
                <Button>Submit Order</Button> 
                </p>
            </form>
        </Modal>
    )
}