const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        by: { type: String, required: true},
        ownerEmail: { type: String, required: true },
        likes: {type: Number, required: true},
        dislikes: {type: Number, required: true},
        listens: {type: Number, required: true},
        publishDate: {type: String, required: true},
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], required: true },
        comments: { type: [{
            by: String, 
            comment: String
        }], required: true },
        likedDislikedUsers: {type: [String], required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
