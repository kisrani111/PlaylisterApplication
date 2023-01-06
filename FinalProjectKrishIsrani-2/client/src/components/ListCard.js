import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { Accordion, AccordionDetails, AccordionSummary, Button, Paper, Link } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import PublishIcon from '@mui/icons-material/Publish';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Songs from './Songs';
import EditToolbar from './EditToolbar';
import MUIDeleteModal from './MUIDeleteModal'
import PublishedSongs from './PublishedSongs';
import AuthContext from '../auth';


function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair } = props;

    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);
            if(idNamePair.publishDate === "N/A") {
                store.addInfoById('none', 'none', false, false, false, id);
            }
            else{
                store.addInfoById('none', 'none', false, false, true, id);
            }
        }
    }
    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }
    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }
    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }
    function handleInfo(event, type) {
        event.stopPropagation();
        if(type === 1) {
            store.addInfoById('none', 'none', true, false, false, idNamePair._id);
        }
        else if(type === 2) {
            store.addInfoById('none', 'none', false, true, false, idNamePair._id);
        }
    }

    function handleDuplicate() {
        store.createNewList(idNamePair.name, idNamePair.songs);
    }

    function handlePublish() {
        store.publishList(idNamePair._id);
    }

    let dislikeButton =
    <Button 
        aria-label="dislike"
        id="dislike-button"
        sx={{ color: "#000000", mr: 5 }}
        startIcon={<ThumbDownAltOutlinedIcon style={{fontSize:'26pt'}} />}
        onClick={(event) => handleInfo(event, 2)}
    >
        {idNamePair.dislikes}
    </Button>;
    let likeButton =
        <Button 
            aria-label="like"
            id="like-button"
            sx={{ color: "#000000", ml: 40, mr: 5}}
            startIcon={<ThumbUpAltOutlinedIcon style={{fontSize:'26pt'}} />}
            onClick={(event) => handleInfo(event, 1)}
        >
            {idNamePair.likes}
        </Button>;
    let duplicateButton;
    let deleteButton;
    if(auth.guest) {
        likeButton =
        <Button 
            aria-label="like"
            id="like-button"
            sx={{ color: "#000000", ml: 40, mr: 5}}
            startIcon={<ThumbUpAltOutlinedIcon style={{fontSize:'24pt'}} />}
            onClick={(event) => handleInfo(event, 1)}
            disabled={true}
        >
            {idNamePair.likes}
        </Button>;

        dislikeButton =
        <Button 
            aria-label="dislike"
            id="dislike-button"
            sx={{ color: "#000000", mr: 5 }}
            startIcon={<ThumbDownAltOutlinedIcon style={{fontSize:'24pt'}} />}
            onClick={(event) => handleInfo(event, 2)}
            disabled={true}
        >
            {idNamePair.dislikes}
        </Button>;

        duplicateButton =
        <IconButton 
            onClick={handleDuplicate} 
            aria-label='duplicate'>
            <FileCopyIcon style={{fontSize:'30pt'}} />
        </IconButton>;

    }

    if(auth.user.email === idNamePair.owner && !auth.guest) {
        deleteButton = 
        <IconButton 
            onClick={(event) => {handleDeleteList(event, idNamePair._id)}} 
            aria-label='delete'>
            <DeleteIcon style={{fontSize:'30pt'}} />
        </IconButton>;
    }

    function handleLoadUser(event) {
        event.stopPropagation();
        store.loadUser(auth.user.email, idNamePair.by);
    }
    
    let cardElement;

    let notPublishedList = (
    <Paper 
            id={idNamePair._id}
            sx={{ margin: '10px', width: '95%', borderRadius: '5px' }}
        > 
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ height: '20%', p: 1, flexWrap: 'wrap', bgcolor: '#FF7F00', "&:hover":{ bgcolor: '#FF7F00' }, borderTopRightRadius: '5px', borderTopLeftRadius: '5px' }}
                button
                onDoubleClick={handleToggleEdit}
            >
                <Box sx={{ pr: 10, pl: 1, fontSize: 30, fontWeight: 'bold', width: '100%' }}>{idNamePair.name}</Box>
                <Box sx={{ pl: 1, fontSize: 20, width: '55%'}}>By: 
                    {<Link  
                        component='button'
                        onClick={handleLoadUser}
                        sx={{ fontSize: 20 }}
                    >
                        {idNamePair.by}
                    </Link>}
                </Box>
                
            </ListItem>
            <Accordion   
                id={idNamePair._id}              
                sx={{ bgcolor: '#FF7F00', '&:before': {display: 'none'} }} 
                elevation={0}
                disableGutters
                onChange={(event, expanded) => { if(expanded) {handleLoadList(event, idNamePair._id)} }}
            >
                <AccordionSummary 
                    expandIcon={ 
                        <KeyboardDoubleArrowDownIcon 
                            style={{ fontSize: 30, color: 'black' }} 
                        /> 
                    }/>
                <AccordionDetails sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    <Songs
                        songs={idNamePair.songs}
                    />
                    <EditToolbar/>
                    <MUIDeleteModal/>
                    <IconButton 
                        onClick={(event) => {handleDeleteList(event, idNamePair._id)}} 
                        aria-label='delete'>
                        <DeleteIcon style={{fontSize:'30pt'}} />
                    </IconButton>
                    <IconButton 
                        onClick={handleDuplicate} 
                        aria-label='duplicate'>
                        <FileCopyIcon style={{fontSize:'30pt'}} />
                    </IconButton>
                    <IconButton 
                        onClick={handlePublish} 
                        aria-label='publish'>
                        <PublishIcon style={{fontSize:'30pt'}} />
                    </IconButton>
                </AccordionDetails>
            </Accordion>
        </Paper>
    )
    let publishedList = (
        <Paper 
            id={idNamePair._id}
            sx={{ margin: '10px', width: '95%', borderRadius: '5px' }}
        > 
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ height: '20%', p: 1, flexWrap: 'wrap', bgcolor: '#6495ED', "&:hover":{ bgcolor: '#6495ED' }, borderTopRightRadius: '5px', borderTopLeftRadius: '5px' }}
                button
            >
                <Box sx={{ pr: 10, pl: 1, fontSize: 30, fontWeight: 'bold' }}>{idNamePair.name}</Box>
                {likeButton}
                {dislikeButton}
                <Box sx={{ pl: 1, fontSize: 20, width: '55%'}}>By: 
                    {<Link  
                        component='button'
                        onClick={handleLoadUser}
                        sx={{ fontSize: 20 }}
                    >
                        {idNamePair.by}
                    </Link>}
                </Box>
                <Box sx={{ fontSize: 20, width: '25%'}}>Published: {idNamePair.publishDate}</Box>
                <Box sx={{ fontSize: 20, width: '15%'}}>Listens: {idNamePair.listens}</Box>
            </ListItem>
            <Accordion   
                id={idNamePair._id}              
                sx={{ bgcolor: '#6495ED', '&:before': {display: 'none'} }} 
                elevation={0}
                disableGutters
                onChange={(event, expanded) => { if(expanded) {handleLoadList(event, idNamePair._id)} }}
            >
                <AccordionSummary 
                    expandIcon={ 
                        <KeyboardDoubleArrowDownIcon 
                            style={{ fontSize: 30, color: 'black' }} 
                        /> 
                    }/>
                <AccordionDetails sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    <PublishedSongs
                        songs={idNamePair.songs}
                        >
                    </PublishedSongs>
                    <MUIDeleteModal/>
                    {deleteButton}
                    {duplicateButton}
                </AccordionDetails>
            </Accordion>
        </Paper>

    )
    if(idNamePair.publishDate === "N/A") {
        cardElement = notPublishedList
        
    }
    else {
        cardElement = publishedList
        
    }

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                width='100%'
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;