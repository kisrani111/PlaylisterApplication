import { useContext } from 'react'
import { GlobalStoreContext } from '../store/index.js'
import { List, TextField, Box } from '@mui/material';
import CommentCard from './CommentCard.js';
import AuthContext from '../auth';

function ListComments() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let commenting;
    let textfield;
    if(!auth.guest) {
        textfield =
        <TextField 
            id="outlined-basic" 
            label="Add New Comment" 
            variant="outlined" 
            sx={{ width: '100%', backgroundColor: 'white', mt: 1}}
            onKeyPress={handleEnter}
        />;
    }

    function handleEnter(event) {
        if(event.key === "Enter") {
            let comment = event.target.value;
            store.addInfoById(auth.user.userName, comment, false, false, false, store.currentList._id);
        }
    }
    if(store.currentList) {
        commenting = 
            <Box sx={{ height: 350}}>
                <List 
                    id="playlist-cards" 
                    sx={{ pd: 5, mr: 2, height: '100%', width: '90%', bgcolor: '#FAEBD7', overflowY: 'auto' }}
                >
                    {store.currentList.comments.map((comment, index) => (
                            <CommentCard
                                id={'comments'+index}
                                key={'comments'+index}
                                comment={comment}
                            />
                        ))
                    }
                </List>
                {textfield}
            </Box>
    } 
    else {
        commenting =
        <Box sx={{ height: 350}}>
        <List 
            id="playlist-cards" 
            sx={{ pd: 5, left: '2.5%', height: '100%', width: '95%', bgcolor: '#FAEBD7', overflowY: 'auto' }}
        >
        </List>
    </Box>
    }

    return (
        commenting
    )
}

export default ListComments;