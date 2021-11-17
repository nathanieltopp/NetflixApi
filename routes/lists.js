const router = require("express").Router();
const List = require("../models/List");
const authenticate = require("../middleware/auth");

//CREATE LIST
router.post("/", authenticate, async(req, res) => {
    if(!req.user.isAdmin){
        return res.status(403).json("Access denied.");
    }

    const newList = new List(req.body);

    try {
        const savedList = await newList.save();
        res.status(201).json(savedList);
    } catch (error) {
        res.status(400).json(error);
    }
});

//DELETE LIST
router.delete("/:id", authenticate, async(req, res) => {
    if(!req.user.isAdmin){
        return res.status(403).json("Access denied.");
    }

    try {
        await List.findByIdAndDelete(req.params.id);
        res.status(201).json("The list has been deleted successfully");
    } catch (error) {
        res.status(400).json(error);
    }
});

//GET ALL LISTS
router.get("/", authenticate, async(req, res) => {
    if(!req.user.isAdmin){
        return res.status(403).json("Access denied.");
    }

    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];

    
    try {
        if(typeQuery){
            if(genreQuery){
                list = await List.aggregate([
                    {$sample: {size: 10}},
                    {$match: {type: typeQuery, genre: genreQuery}} 
                ]);
            }else {
                list = await List.aggregate([
                    {$sample: {size: 10}},
                    {$match: {type: typeQuery}} 
                ]);
            }
        }else{
    
            list = await List.aggregate([{$sample:{size: 10}}]);
        }
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;