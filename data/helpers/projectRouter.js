const express = require("express");
const data = require("./projectModel");
const router = express.Router();


router.get('/', (req, res) => {
    data.get()
        .then(project => {
            res.status(200).json(project);
        })
})

router.get("/:id", idValidation, (req, res) => {
    const id = req.params.id;

    data.get(id)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(error => {
            res.status(404).json({message: "invalid ID"});
        })
})

router.post("/", postValidation, (req, res) => {
    const {name, description} = req.body;

    data.insert({name, description})
        .then(response => {
            res.status(201).json(response);
        })
        .catch(error => {
            res.status(406).json({message: "must provide a name or description"});
        })
})

router.put("/:id", idValidation, postValidation, (req, res) => {
    const id = req.params.id;
    const {name, description} = req.body;
    
    data.update(id, {name, description})
        .then(response => {
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(406).json({message: "must provide a name or description"});
        })
})

router.delete("/:id", idValidation, (req, res) => {
    const id = req.params.id;

    data.remove(id)
        .then(response => {
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(404).json({message: "not a valid ID"});
        })
})


function postValidation(req, res, next) {
    const {name, description} = req.body;

    if(!name || !description) {
        res.status(400).json({message: "please enter a valid name or description"});
    } else {
        next();
    }
}

function idValidation(req, res, next) {
    const id = req.params.id;

    data.get(id)
        .then(response => {
            next();
        })
        .catch(error => {
            res.status(404).json({message: "ID is not valid"});
        })
}

module.exports = router;