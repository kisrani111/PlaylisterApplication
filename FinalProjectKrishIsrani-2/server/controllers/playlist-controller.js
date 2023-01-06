const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + playlist.toString());
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    async function asyncFindUser(list) {
        await User.findOne({ email: list.ownerEmail }, (err, user) => {
            console.log("user._id: " + user._id);
            console.log("req.userId: " + req.userId);
            if (user._id == req.userId) {
                console.log("correct user!");
                    user.playlists.push(playlist._id);
                    user
                        .save()
                        .then(() => {
                            playlist
                                .save()
                                .then(() => {
                                    return res.status(201).json({
                                        playlist: playlist
                                    })
                                })
                                .catch(error => {
                                    return res.status(400).json({
                                        errorMessage: 'Playlist Not Created!'
                                    })
                                })
                        });
            }
            else {
                console.log("incorrect user!");
                return res.status(400).json({ success: false, description: "authentication error" });
            }
        });
    }
    asyncFindUser(playlist);
}
deletePlaylist = async (req, res) => {
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    //user.playlists.filter(list => list.toString() == req.params.id);
                    //user.save();
                    console.log("Playlist deleted");
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({});
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistById = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
                console.log("list email: " + list.ownerEmail);
                console.log("req email: " + req.params.email);
                if (req.params.email === list.ownerEmail || list.publishDate !== "N/A") {
                    console.log("correct user!");
                    return res.status(200).json({ success: true, playlist: list })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
        }
        asyncFindUser(list);
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    console.log("getPlaylistPairs");
    console.log("sort: " +req.params.sort)
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email, sort) {
            console.log("find all Playlists owned by " + email);
            await Playlist.find({ ownerEmail: email }, (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS

                    if(sort === "name") {
                        playlists.sort((a, b) => a.name.localeCompare(b.name));
                        console.log("sort by name")
                    }
                    else if(sort === "publish") {
                        playlists.sort((a, b) => a.publishDate.localeCompare(b.publishDate));
                        console.log("sort by pub")
                    }
                    else if(sort === "listen") {
                        playlists.sort((a, b) => parseInt(a.listens) >= parseInt(b.listens))
                        console.log("sort by lis")
                    }
                    else if(sort === "like") {
                        playlists.sort((a, b) => parseInt(a.likes) >= parseInt(b.likes))
                        console.log("sort by like")
                    }
                    else if(sort === "dislike") {
                        playlists.sort((a, b) => parseInt(a.dislikes) >= parseInt(b.dislikes))
                        console.log("sort by dislike")
                    }
                    

                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            owner: list.ownerEmail,
                            likes: list.likes,
                            dislikes: list.dislikes,
                            songs: list.songs,
                            by: list.by,
                            publishDate: list.publishDate,
                            listens: list.listens,
                            likedDislikedUsers: list.likedDislikedUsers
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email, req.params.sort);
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    async function asyncGetPlaylists(sort) { 
        await Playlist.find({}, (err, playlists) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!playlists.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Playlists not found` })
            }
            else {
                console.log("Send the Playlist pairs");
                // PUT ALL THE LISTS INTO ID, NAME PAIRS
                if(sort === "name") {
                    playlists.sort((a, b) => a.name.localeCompare(b.name));
                    console.log("sort by name")
                }
                else if(sort === "publish") {
                    playlists.sort((a, b) => a.publishDate.localeCompare(b.publishDate));
                    console.log("sort by pub")
                }
                else if(sort === "listen") {
                    playlists.sort((a, b) => parseInt(a.listens) >= parseInt(b.listens))
                    console.log("sort by lis")
                }
                else if(sort === "like") {
                    playlists.sort((a, b) => parseInt(a.likes) >= parseInt(b.likes))
                    console.log("sort by like")
                }
                else if(sort === "dislike") {
                    playlists.sort((a, b) => parseInt(a.dislikes) >= parseInt(b.dislikes))
                    console.log("sort by dislike")
                }
                

                let pairs = [];
                for (let key in playlists) {
                    let list = playlists[key];
                    if (list.publishDate !== "N/A" || list.ownerEmail === req.params.email) {
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            owner: list.ownerEmail,
                            likes: list.likes,
                            dislikes: list.dislikes,
                            songs: list.songs,
                            by: list.by,
                            publishDate: list.publishDate,
                            listens: list.listens,
                            likedDislikedUsers: list.likedDislikedUsers
                        };
                        pairs.push(pair);
                    }
                }
                return res.status(200).json({ success: true, idNamePairs: pairs })
            }
        }).catch(err => console.log(err))
    }
    asyncGetPlaylists(req.params.sort);
}
updatePlaylist = async (req, res) => {
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId || list.publishDate !== "N/A") {
                    console.log("correct user!");
                    console.log("req.body.name: " + req.body.name);
                    if(list.publishDate === "N/A") {
                        list.name = body.playlist.name;
                        list.songs = body.playlist.songs;
                        list
                            .save()
                            .then(() => {
                                console.log("SUCCESS!!!");
                                return res.status(200).json({
                                    success: true,
                                    id: list._id,
                                    message: 'Playlist updated!',
                                })
                            })
                            .catch(error => {
                                console.log("FAILURE: " + JSON.stringify(error));
                                return res.status(404).json({
                                    error,
                                    message: 'Playlist not updated!',
                                })
                            })
                    }
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
addInfoById = async (req, res) => {
    const body = req.body
    console.log("Adding comment/like/dislike")
    console.log("req.body: " + req.body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        if(body.userName !== "none" && body.comment !== "none") {
            playlist.comments.push({by: body.userName, comment: body.comment});
        }
        if(body.listen) {
            playlist.listens = playlist.listens + 1;
        }
        if(body.like && !playlist.likedDislikedUsers.includes(req.params.email)) {
            playlist.likes = playlist.likes + 1; 
            playlist.likedDislikedUsers.push(req.params.email);
        }
        else if(body.dislike && !playlist.likedDislikedUsers.includes(req.params.email)) {
            playlist.dislikes = playlist.dislikes + 1;
            playlist.likedDislikedUsers.push(req.params.email); 
        }
        playlist
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    message: 'Playlist updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Playlist not updated!',
                })
            })
    })   
}
publishPlaylistById = async (req, res) => {
    console.log("publishPlaylist: " + JSON.stringify(req.params.id));

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name: " + req.body.name);

                    let date = new Date();
                    list.publishDate = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Playlist published!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Playlist not published!',
                            })
                        })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistPairsByName = async (req, res) => {
    console.log("getPlaylistPairsByName");
    console.log(req.params);
    let cri = req.params.criteria;
    let email = req.params.email;
        async function asyncFindList(re, em, sort) {
            console.log("find all Playlists with " + re);
            await Playlist.find({name: {$regex: re}}, (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(200).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(200)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS

                    if(sort === "name") {
                        playlists.sort((a, b) => a.name.localeCompare(b.name));
                        console.log("sort by name")
                    }
                    else if(sort === "publish") {
                        playlists.sort((a, b) => a.publishDate.localeCompare(b.publishDate));
                        console.log("sort by pub")
                    }
                    else if(sort === "listen") {
                        playlists.sort((a, b) => parseInt(a.listens) >= parseInt(b.listens))
                        console.log("sort by lis")
                    }
                    else if(sort === "like") {
                        playlists.sort((a, b) => parseInt(a.likes) >= parseInt(b.likes))
                        console.log("sort by like")
                    }
                    else if(sort === "dislike") {
                        playlists.sort((a, b) => parseInt(a.dislikes) >= parseInt(b.dislikes))
                        console.log("sort by dislike")
                    }
                    else if(sort === "creation") {
                        playlists.sort((a, b) => new Date(a.createdAt).getTime() <= new Date(b.createdAt).getTime())
                        console.log("sort by create")
                    }
                    else if(sort === "edit") {
                        playlists.sort((a, b) => new Date(a.updatedAt).getTime() <= new Date(b.updatedAt).getTime())
                        console.log("sort by edit")
                    }

                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        if (list.publishDate !== "N/A" || list.ownerEmail === em) {
                            let pair = {
                                _id: list._id,
                                name: list.name,
                                owner: list.ownerEmail,
                                likes: list.likes,
                                dislikes: list.dislikes,
                                songs: list.songs,
                                by: list.by,
                                publishDate: list.publishDate,
                                listens: list.listens,
                                likedDislikedUsers: list.likedDislikedUsers
                            };
                            pairs.push(pair);
                            console.log("matched!")
                        }
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(cri, email, req.params.sort);
}

getPlaylistPairsByUser = async (req, res) => {
    console.log("getPlaylistPairsByName");
    console.log(req.body);
    let cri = req.params.criteria;
    let email = req.params.email;
        async function asyncFindList(re, em, sort) {
            console.log("find all Playlists with " + re);
            await Playlist.find({by: {$regex: re}}, (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(200).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(200)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS

                    if(sort === "name") {
                        playlists.sort((a, b) => a.name.localeCompare(b.name));
                        console.log("sort by name")
                    }
                    else if(sort === "publish") {
                        playlists.sort((a, b) => a.publishDate.localeCompare(b.publishDate));
                        console.log("sort by pub")
                    }
                    else if(sort === "listen") {
                        playlists.sort((a, b) => parseInt(a.listens) >= parseInt(b.listens))
                        console.log("sort by lis")
                    }
                    else if(sort === "like") {
                        playlists.sort((a, b) => parseInt(a.likes) >= parseInt(b.likes))
                        console.log("sort by like")
                    }
                    else if(sort === "dislike") {
                        playlists.sort((a, b) => parseInt(a.dislikes) >= parseInt(b.dislikes))
                        console.log("sort by dislike")
                    }
                    
                    
                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        if (list.publishDate !== "N/A" || list.ownerEmail === em) {
                            let pair = {
                                _id: list._id,
                                name: list.name,
                                owner: list.ownerEmail,
                                likes: list.likes,
                                dislikes: list.dislikes,
                                songs: list.songs,
                                by: list.by,
                                publishDate: list.publishDate,
                                listens: list.listens,
                                likedDislikedUsers: list.likedDislikedUsers
                            };
                            pairs.push(pair);
                        }
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(cri, email, req.params.sort);
}

getAllPublishedPlaylistPairs = async (req, res) => {
    console.log("getAllPublishedPlaylistPairs");
        async function asyncFindList(sort) {
            console.log("find all published Playlists");
            await Playlist.find({publishDate: {$not: /N\/A/}}, (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(200).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(200)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS

                    if(sort === "name") {
                        playlists.sort((a, b) => a.name.localeCompare(b.name));
                        console.log("sort by name")
                    }
                    else if(sort === "publish") {
                        playlists.sort((a, b) => a.publishDate.localeCompare(b.publishDate));
                        console.log("sort by pub")
                    }
                    else if(sort === "listen") {
                        playlists.sort((a, b) => parseInt(a.listens) >= parseInt(b.listens))
                        console.log("sort by lis")
                    }
                    else if(sort === "like") {
                        playlists.sort((a, b) => parseInt(a.likes) >= parseInt(b.likes))
                        console.log("sort by like")
                    }
                    else if(sort === "dislike") {
                        playlists.sort((a, b) => parseInt(a.dislikes) >= parseInt(b.dislikes))
                        console.log("sort by dislike")
                    }
                    else if(sort === "creation") {
                        playlists.sort((a, b) => new Date(a.createdAt).getTime() <= new Date(b.createdAt).getTime())
                        console.log("sort by create")
                    }
                    else if(sort === "edit") {
                        playlists.sort((a, b) => new Date(a.updatedAt).getTime() <= new Date(b.updatedAt).getTime())
                        console.log("sort by edit")
                    }

                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                            let pair = {
                                _id: list._id,
                                name: list.name,
                                owner: list.ownerEmail,
                                likes: list.likes,
                                dislikes: list.dislikes,
                                songs: list.songs,
                                by: list.by,
                                publishDate: list.publishDate,
                                listens: list.listens,
                                likedDislikedUsers: list.likedDislikedUsers
                            };
                            pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(req.params.sort);
}

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    addInfoById,
    publishPlaylistById,
    getPlaylistPairsByName,
    getPlaylistPairsByUser,
    getAllPublishedPlaylistPairs
}