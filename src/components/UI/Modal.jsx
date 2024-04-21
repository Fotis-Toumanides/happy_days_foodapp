import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({children, open, onClose, className=''}) {
    const dialog = useRef();
    
    useEffect(() => {
        const modal = dialog.current // We store this value of useRef because its value could change and we need this value to clean up with the return-cleanup fuction
        if(open){
            modal.showModal()
        }
        return () => modal.close();
    }, [open]);

    return createPortal(
        <dialog ref={dialog} className={`modal ${className}`} onClose={onClose}>
            {children}
        </dialog>, document.getElementById('modal')
    )
}