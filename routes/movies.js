const router = require("express").Router();
const Movie = require("../models/Movie");
const authenticate = require("../middleware/auth");

//CREATE MOVIE
router.post("/", authenticate, async(req, res) => {
    if(!req.user.isAdmin){
        return res.status(403).json("Access denied.");
    }

    const newMovie = new Movie(req.body);

    try {
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(400).json(error);
    }
});

//UPDATE MOVIE
router.put("/:id", authenticate, async(req, res) => {
    if(!req.user.isAdmin){
        return res.status(403).json("Access denied.");
    }

    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        res.status(200).json(updatedMovie);
    } catch (error) {
        res.status(400).json(error);
    }
});

//DELETE MOVIE
router.delete("/:id", authenticate, async(req, res) => {
    if(!req.user.isAdmin){
        return res.status(403).json("Access denied.");
    }

    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json("Movie deleted successfully");
    } catch (error) {
        res.status(400).json(error);
    }
});

//Get MOVIE
router.get("/find/:id", authenticate, async(req, res) => {

    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
    } catch (error) {
        res.status(400).json(error);
    }
});

//Get Random Movie
router.get("/random", authenticate, async(req, res) => {
    const type = req.query.type;
    let movie;
    try {
        if(type === "series"){
            movie = await Movie.aggregate([
                {$match: {isSeries: true}},
                {$sample: {size: 1}}
            ]);
        }else {
            movie = await Movie.aggregate([
                {$match: {isSeries: false}},
                {$sample: {size: 1}}
            ]);
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(400).json(error);
    }
});

//Get All Movies
router.get("/", authenticate, async(req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies.reverse());
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;