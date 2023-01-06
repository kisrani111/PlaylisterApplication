import { createContext, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'

export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");


export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    SET_SEARCH_MODE: "SET_SEARCH_MODE",
    SET_HOME: "SET_HOME",
    LOAD_USER: "LOAD_USER"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG",
    NAMING_ERROR : "NAMING ERROR"
}
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        searchMode: "h",
        currentCri: "",
        sortType: "name"
    });
    const history = useHistory();



    
    const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchMode: store.searchMode,
                    currentCri: store.currentCri,
                    sortType: store.sortType
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchMode: store.searchMode,
                    currentCri: store.currentCri,
                    sortType: store.sortType
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchMode: store.searchMode,
                    currentCri: store.currentCri,
                    sortType: store.sortType
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.pairsArray,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchMode: store.searchMode,
                    currentCri: payload.criteria,
                    sortType: payload.sortType
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    searchMode: store.searchMode,
                    currentCri: store.currentCri,
                    sortType: store.sortType
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.pairsArray,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchMode: store.searchMode,
                    currentCri: store.currentCri,
                    sortType: store.sortType
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchMode: store.searchMode,
                    currentCri: store.currentCri,
                    sortType: store.sortType
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchMode: store.searchMode,
                    currentCri: store.currentCri,
                    sortType: store.sortType
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchMode: store.searchMode,
                    currentCri: store.currentCri,
                    sortType: store.sortType
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchMode: store.searchMode,
                    currentCri: store.currentCri,
                    sortType: store.sortType
                });
            }
            case GlobalStoreActionType.SET_SEARCH_MODE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchMode: payload,
                    currentCri: store.currentCri,
                    sortType: store.sortType
                });
            }
            case GlobalStoreActionType.SET_HOME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchMode: "h",
                    currentCri: "",
                    sortType: store.sortType
                });
            }
            case GlobalStoreActionType.LOAD_USER: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.pairsArray,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchMode: "u",
                    currentCri: payload.criteria,
                    sortType: store.sortType
                });
            }
            case GlobalStoreActionType.NAMING_ERROR: {
                return setStore({
                    currentModal : CurrentModal.NAME_ERROR,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchMode: store.searchMode,
                    currentCri: store.currentCri,
                    sortType: store.sortType,
                    currentOpen: store.currentOpen
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id, auth.user.email);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs(store.sortType);
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                    else {
                        store.showNamingErrorModal();
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/")
        window.localStorage.clear();    
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function (name, songs) {
        let newListName = "Untitled" + store.newListCounter;
        if(name !== "") {
            newListName = name + "*";
        }
        let userName = auth.user.userName;

        const response = await api.createPlaylist(newListName, songs, [], auth.user.email, userName);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );
            store.loadIdNamePairs(store.currentCri, store.sortType);
        }
        else {
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function (criteria, sortType) {
        async function asyncLoadIdNamePairs() {
            let response;
            if(auth.user.email === "guest" && store.searchMode === "h") {
                response = await api.getAllPublishedPlaylistPairs(sortType);
            }
            else if(store.searchMode === "h") {
                response = await api.getPlaylistPairs(sortType);
            } 
            else if(store.searchMode === "n") {
                response = await api.getPlaylistPairsByName(criteria, auth.user.email, sortType);
            } 
            else if(store.searchMode === "u") {
                response = await api.getPlaylistPairsByUser(criteria, auth.user.email, sortType);
            }

            let pairsArray;
            if (response.data.success) {
                pairsArray = response.data.idNamePairs;
            }
            else {
                pairsArray = [];
            }

            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: {criteria: criteria, pairsArray: pairsArray, sortType: sortType}
            });
        }
        asyncLoadIdNamePairs();
    }

    store.setSearchMode = function(type) {
        storeReducer({
            type: GlobalStoreActionType.SET_SEARCH_MODE,
            payload: type
        });
    }
    
    store.setHome = function() {
        async function asyncSetHome() {
            let response = await api.getPlaylistPairs(store.sortType);
            if(response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.SET_HOME,
                    payload: pairsArray
                });
            }
        }
        asyncSetHome();
    }

    store.loadUser = function(email, by) {
        async function asyncLoadIdNamePairs() {
            let response = await api.getPlaylistPairsByUser(by, email, store.sortType);
            let pairsArray;
            if (response.data.success) {
                pairsArray = response.data.idNamePairs;
            }
            else {
                pairsArray = [];
            }

            storeReducer({
                type: GlobalStoreActionType.LOAD_USER,
                payload: {criteria: by, pairsArray: pairsArray}
            });
        }
        asyncLoadIdNamePairs();
    }

    store.publishList = function(id) {
        async function asyncPublishList() {
            let response = await api.publishPlaylistById(id);
            if (response.data.success) {
                store.setCurrentList(id);
            }
        }
        asyncPublishList();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id, auth.user.email);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadIdNamePairs(store.currentCri, store.sortType);
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
        window.location.reload();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.showNamingErrorModal = () => {
        storeReducer({
            type: GlobalStoreActionType.NAME_ERROR,
            payload: {}
        });        
    }

    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id, auth.user.email);
            if (response.data.success) {
                let playlist = response.data.playlist;

                async function asyncLoadIdNamePairs() {
                    let response;
                    if(auth.user.email === "guest" && store.searchMode === "h") {
                        response = await api.getAllPublishedPlaylistPairs(store.sortType);
                    }
                    else if(store.searchMode === "h") {
                        response = await api.getPlaylistPairs(store.sortType);
                    } 
                    else if(store.searchMode === "n") {
                        response = await api.getPlaylistPairsByName(store.currentCri, auth.user.email, store.sortType);
                    } 
                    else if(store.searchMode === "u") {
                        response = await api.getPlaylistPairsByUser(store.currentCri, auth.user.email, store.sortType);
                    }
        
                    let pairsArray;
                    if (response.data.success) {
                        pairsArray = response.data.idNamePairs;
                    }
                    else {
                        pairsArray = [];
                    }
        
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: {pairsArray: pairsArray, playlist: playlist}
                    });
                }
                asyncLoadIdNamePairs();
                window.localStorage.setItem('currentList', JSON.stringify(playlist));
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }

    store.sort = function(type) {
        store.loadIdNamePairs(store.currentCri, type);
    }

    store.addInfoById = function(userName, comment, like, dislike, listen, id) {
        tps.clearAllTransactions();
        async function asyncAddComment() {
            let response = await api.addInfoById(userName, comment, like, dislike, listen, id, auth.user.email);
            if (response.data.success) {
                async function asyncSetCurrentList(id) {
                    let response = await api.getPlaylistById(id, auth.user.email);
                    if (response.data.success) {
                        let playlist = response.data.playlist;
        
                        async function asyncLoadIdNamePairs() {
                            let response;
                            if(auth.user.email === "guest" && store.searchMode === "h") {
                                response = await api.getAllPublishedPlaylistPairs(store.sortType);
                            }
                            else if(store.searchMode === "h") {
                                response = await api.getPlaylistPairs(store.sortType);
                            } 
                            else if(store.searchMode === "n") {
                                response = await api.getPlaylistPairsByName(store.currentCri, auth.user.email, store.sortType);
                            } 
                            else if(store.searchMode === "u") {
                                response = await api.getPlaylistPairsByUser(store.currentCri, auth.user.email, store.sortType);
                            }
                
                            let pairsArray;
                            if (response.data.success) {
                                pairsArray = response.data.idNamePairs;
                            }
                            else {
                                pairsArray = [];
                            }
                
                            storeReducer({
                                type: GlobalStoreActionType.SET_CURRENT_LIST,
                                payload: {pairsArray: pairsArray, playlist: playlist}
                            });
                        }
                        asyncLoadIdNamePairs();
                        window.localStorage.setItem('currentList', JSON.stringify(playlist));
                    }
                }
                asyncSetCurrentList(id);
            }
        }
        asyncAddComment();
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            let response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                async function asyncLoadIdNamePairs() {
                    let response;
                    if(auth.user.email === "guest" && store.searchMode === "h") {
                        response = await api.getAllPublishedPlaylistPairs(store.sortType);
                    }
                    else if(store.searchMode === "h") {
                        response = await api.getPlaylistPairs(store.sortType);
                    } 
                    else if(store.searchMode === "n") {
                        response = await api.getPlaylistPairsByName(store.currentCri, auth.user.email, store.sortType);
                    } 
                    else if(store.searchMode === "u") {
                        response = await api.getPlaylistPairsByUser(store.currentCri, auth.user.email, store.sortType);
                    }
        
                    let pairsArray;
                    if (response.data.success) {
                        pairsArray = response.data.idNamePairs;
                    }
                    else {
                        pairsArray = [];
                    }
        
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: {pairsArray: pairsArray, playlist: store.currentList}
                    });
                }
                asyncLoadIdNamePairs();
                window.localStorage.setItem('currentList', JSON.stringify(store.currentList));
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.clearAllTransactions = function () {
        tps.clearAllTransactions();
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };