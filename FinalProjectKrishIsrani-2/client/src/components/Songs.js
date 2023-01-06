import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'

function Songs(props) {
    const { store } = useContext(GlobalStoreContext);
    const { songs } = props;
    store.history = useHistory();
    let pub;

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
        pub = 
        <Box>
            <List 
                id="playlist-cards" 
                sx={{ pd: 5, left: '0%', height: '100%', width: '95%', bgcolor: '#eeeeedd'  }}
            >
                {
                    songs.map((song, index) => (
                        <SongCard
                            id={'playlist-song-' + (index)}
                            key={'playlist-song-' + (index)}
                            index={index}
                            song={song}
                        />
                    ))  
                }
            </List>
            {modalJSX}
         </Box>            
    return (
        pub
    )
}
export default Songs;