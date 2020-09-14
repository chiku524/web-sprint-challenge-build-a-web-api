const express = require("express");
const data = require("./actionModel");
const router = express.Router();

router.get('/', (req, res) => {
    data.get()
        .then(actions => {
            res.status(200).json(actions);
        })
})

router.get("/:id", userIdValidation, (req, res) => {
    const id = req.params.id;
    
    data.get(id)
        .then(action => {
            res.status(200).json(action);
        })
        .catch(error => {
            res.status(404).json({message: 'invalid ID'});
        })
})

router.post("/:id", userIdValidation, (req, res) => {
    const id = req.params.id;
    const {description, notes} = req.body;
    
    data.insert({project_id: id, description, notes})
        .then(response => {
            res.status(201).json(response);
        })
        .catch(error => {
            res.status(406).json({message: 'must provide description or notes'})
        })
})

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    
    data.remove(id)
        .then(response => {
            res.status(200).json({message: "successfully removed"});
        })
        .catch(error => {
            res.status(404).json({message: "ID not valid"});
        })
})

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const {description, notes, project_id} = req.body;
    
    data.update(id, {project_id, description, notes})
        .then(response => {
            res.status(201).json(response)
        })
        .catch(error => {
            res.status(406).json({message: "must provide action_id, notes or description"});
        })
})


function userIdValidation(req, res, next) {
    const id = req.params.id;
    
    data.get(id)
        .then(response => {
            next();
        })
        .catch(error => {
            res.status(404).json({error: "invalid user ID or missing valid actions"});
        })
}

module.exports = router;