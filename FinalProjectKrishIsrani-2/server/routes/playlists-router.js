/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id/:email', PlaylistController.getPlaylistById)
router.get('/playlistpairs/:sort', auth.verify, PlaylistController.getPlaylistPairs)
router.get('/playlists/:email/:sort', PlaylistController.getPlaylists)
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist)
router.put('/playlist/comment/:id/:email', PlaylistController.addInfoById)
router.put('/playlist/publish/:id', auth.verify, PlaylistController.publishPlaylistById)
router.get('/playlistpairs/name/:criteria/:email/:sort', PlaylistController.getPlaylistPairsByName)
router.get('/playlistpairs/user/:criteria/:email/:sort', PlaylistController.getPlaylistPairsByUser)
router.get('/playlistpairs/published/:sort', PlaylistController.getAllPublishedPlaylistPairs)

module.exports = router