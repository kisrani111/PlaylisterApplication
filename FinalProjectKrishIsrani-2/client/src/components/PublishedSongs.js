import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store/index.js'
import { Typography, Paper, Box } from '@mui/material';

function PublishedSongs(props) {
    const { store } = useContext(GlobalStoreContext);
    const { songs } = props;
    store.history = useHistory();
    let pub;
        pub = 
            <Paper 
                id="published-playlist-card" 
                sx={{ pd: 5, left: '3', height: '100%', width: '95%' }}
            >
                {
                    songs.map((song, index) => (
                        <Typography 
                            id={"published-song"+index}
                            key={"published-song"+index}
                            sx={{ pl: 1, py: 0.5, width: '100%', fontSize: 22, bgcolor: '#F0F8FF', color: 'blue' }}
                        >
                            {index + 1}.
                            {song.title} by {song.artist}
                        </Typography>
                    ))  
                }
            </Paper>            
    return (
        pub
    )
}
export default PublishedSongs;