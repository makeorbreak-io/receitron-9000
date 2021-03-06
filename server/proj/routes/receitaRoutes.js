var express = require('express');
var Receita = require('../models/receita.js')
var router = express.Router();
var app = require('../../index');

//  *******
//  * GET *
//  *******

router.get('/', function (req, res) {
    Receita.find(function (err, result) {
        if (err) {
            return res.send(err);
        }
        return res.send(result);
    })
});

/* GET receita by id - /api/receita/{id} */

router.get('/id/:receita_id', function (req, res) {
    Receita.find({ "_id": req.params['receita_id'] }, function (err, result) {
        if (err) {
            return res.send(err);
        }
        return res.json(result);
    })
});

router.get('/page/:page', function (req, res) {
    let page = req.params["page"];
    Receita.paginate({}, { page: page, limit: 16 }, function (err, result) {
        if (err) {
            return res.send(error);
        }
        return res.send(result);
    });
})

/* GET all ingredients - /api/receita/ingredients */
router.get('/ingredients', function (req, res) {
    Receita.find().distinct("ingredientes.desc", function (err, result) {
        if (err) {
            res.send(err);
        }
        return res.json(result);
    })
});

/* GET all restricoes - /api/receita/restrictions */
router.get('/restrictions', function (req, res) {
    Receita.find().distinct("restricoes", function (err, result) {
        if (err) {
            return res.send(err);
        }
        return res.json(result);
    })
});

/* GET all dificuldades - /api/receita/ingredients */
router.get('/dificuldade', function (req, res) {
    Receita.find().distinct("dificuldade", function (err, result) {
        if (err) {
           return res.send(err);
        }
        return res.json(result);
    })
});



//  ********
//  * POST *
//  ********


/* GET receita by ingredient - /api/receita/ingredients */
router.post('/ingredients', function (req, res) {
    var x = req.body["ingredientes"].toString().split(",")
    var restrictions = [];

    x.forEach(element => {
        restrictions.push({ "ingredientes.desc": { "$regex": element, "$options": "i" } })
    });

    Receita.find({ $and: restrictions }, function (err, result) {
        if (err)
            return res.send(err);
        return res.json(result);
    })
});


/* GET receita by dificuldade - /api/receita/dificuldade */
router.post('/difficulty', function (req, res) {
    Receita.find({ "dificuldade": req.body["dificuldade"].toString() }, function (err, result) {
        if (err)
            return res.send(err);
        return res.json(result);
    })
});

router.post('/filtered/all', function (req, res) {
    filters = req.body;
    filterBy(filters, req, res);
})

function filterBy(filter, req, res) {
    console.log(req.body)

    let ingredients = req.body['ingredientes'];
    let restrictions = [];
    if (ingredients) {
        ingredients.forEach(element => {
            restrictions.push({ "ingredientes.desc": { "$regex": element, "$options": "i" } })
        });
    }

    if (filter["dificuldade"]) {
        restrictions.push({ "dificuldade": filter['dificuldade'] })
    }


    if (filter["restricoes"]) {
        filter["restricoes"].forEach(each => {
            console.log(each)
            restrictions.push({ "restricoes": { "$regex": each, "$options": "i" } })
        })
    }

    Receita.find({ $and: restrictions }, function (err, result) {
        if (err)
            return res.send(err);
        if (result) {
            console.log(result.length)
            return res.json(result);
        }
    })
}


router.post('/calcqt', function (req, res) {
    Receita.find({ "_id": req.body['id'] }, function (err, result) {
        if (err) {
            return res.send(err);
        }
        result = calcQuantity(result, req.body['qt'])
        return res.send(result);
    })
});

function calcQuantity(json, desiredQt) {
    var origQt;
    var splitted = json[0]['dose'].split(" ");
    for (let i = 0; i < splitted.length; i++) {
        if (!isNaN(splitted[i])) {
            origQt = splitted[i];
            break;
        }
    }
    if (origQt == null) {
        return json;
    }
    json[0]['ingredientes'].forEach(element => {
        var qt = element['quantidade']
        if (!isNaN(qt)) {
            element['quantidade'] = Math.ceil(parseFloat(qt) * parseFloat(desiredQt) / parseFloat(origQt))
        }
    });

    return json;
}


module.exports = router;