import * as React from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useContext } from 'react'
import GlobalStoreContext from '../store';

export default function MUINamingError() {
    const { store } = useContext(GlobalStoreContext);
    const CurrentModal = {
        NONE : "NONE",
        DELETE_LIST : "DELETE_LIST",
        EDIT_SONG : "EDIT_SONG",
        REMOVE_SONG : "REMOVE_SONG",
        NAME_ERROR : "NAME_ERROR"
    }

    function handleClose() {
        store.hideModals();
    }

    return (
        <Dialog
            open={store.currentModal === CurrentModal.NAME_ERROR}
            onClose={handleClose}
            aria-labelledby="modal-north"
            aria-describedby="modal-center-content">
            <DialogTitle id="modal-north" component="h6" variant="h2" style={{fontSize: 30}}>Error</DialogTitle> 
            <DialogContent>
                <Alert id="modal-center-content" severity="warning">This name already exists</Alert> 
            </DialogContent>
            <DialogActions> 
                <Button type="close" variant='text' onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}