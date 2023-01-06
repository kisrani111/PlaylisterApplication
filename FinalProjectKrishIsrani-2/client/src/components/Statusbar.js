//DONE
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { Box, Button, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    
    let content = <Typography variant="h4" style={{ fontSize: 20 }}> Playlister </Typography>;

    function handleCreateNewList() {
        store.createNewList("", []);
    }

    if (auth.loggedIn) {
        content = 
            <Button 
                aria-label="add"
                id="add-button"
                onClick={handleCreateNewList}
            >
                <AddIcon style={{ fontSize: 50 }}/>
            </Button>
    }
    if (store.currentList) {
        content = 
        <Box>
            <Button 
                aria-label="add"
                id="add-button"
                onClick={handleCreateNewList}
            >
                <AddIcon style={{ fontSize: 30 }}/>
                <Typography variant="h4" style={{ fontSize: 20 }}> {"New List"} </Typography>
            </Button>
                <Typography variant="h4" style={{ fontSize: 20 }}> {"     Selected List: " + store.currentList.name} </Typography>
                </Box>
    }

    if(auth.guest) {
        content="Guest Account";
    }

    return (
        <div id="playlister-statusbar">
            {content}
        </div>
    );
}

export default Statusbar;