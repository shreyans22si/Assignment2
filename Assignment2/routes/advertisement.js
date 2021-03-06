﻿'use strict';
var express = require('express');
var router = express.Router();
var advertisements = require('../Model/Advertisement');

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect('/advertisement');
});
// List Advertisement Page
router.get('/advertisement', isUSerAuth, function (req, res) {

    advertisements.find(function (err, advertisements) {
        if (err) console.log(err);
        else
            res.render('list', { AllAdvertisement : advertisements });
    });
});

//Add Advertisement Page
router.get('/advertisement/add', isUSerAuth, function (req, res) {
    res.render('add');
});

// Add Advertisement and Save to DB
router.post('/advertisement/add', isUSerAuth, function (req, res) {
    advertisements.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location
    }, function (err, advertisement) {
        if (err) console.log(err);
        else {
            console.log('advertisement added : ' + advertisement);
            res.redirect('/advertisement');
        }
    });
});

//Delete A Advertisement
router.get('/advertisement/delete/:id', isUSerAuth , function (req, res) {
    var id = req.params.id;
    advertisements.deleteOne({ _id: id }, function (err) {
        console.log(id);
        if (err)
            console.log('Advertisement : ' + id + 'not found!');
        else
            res.redirect('/advertisement');
    });
});


//Edit A Product Page
router.get('/advertisement/edit/:id', isUSerAuth , function (req, res) {
    var id = req.params.id;

    advertisements.findById(id, function (err, advertisement) {
        if (err)
            res.send('Advertisement : ' + id + 'not found!');
        else
            res.render('edit', { advertisement: advertisement });
    });
});

//Edit a Advertisement and save to DB
router.post('/advertisement/edit', isUSerAuth ,function (req, res) {
    var id = req.body.id;
    var editedAdvertisment = {
        _id: id,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location
    };
    advertisements.updateOne({ _id: id }, editedAdvertisment, function (err) {
        if (err) res.send('Advertisement: ' + id + ' not found!');
        else {
            console.log('Advertisement' + id + ' updated!');
            res.redirect('/advertisement');
        }
    });

});

function isUSerAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log('Not authenticated!');
    res.redirect('/login');
}

module.exports = router;
