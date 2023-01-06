import { Paper, Box, Typography, Link } from '@mui/material';
import React, { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';

function CommentCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const { comment } = props;

    function handleLoadUser(event) {
        store.loadUser(auth.user.email, comment.by);
    }

    return (
        <Paper sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column', my: 1, width: '100%', height: '20%', bgcolor: '#D2691E'	 }}>
           <Box sx={{ pl: 3, fontSize: 15 }}>
           {<Link  
                component='button'
                onClick={handleLoadUser}
                sx={{ fontSize: 15 }}
            >
                {comment.by}
            </Link>}
            </Box>
           <Typography sx={{ pt: 1, pl: 3, fontSize: 15 }}>{comment.comment}</Typography> 
        </Paper>
    );
}

export default CommentCard;