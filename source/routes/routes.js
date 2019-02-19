const express = require('express');
const vCardJS = require('vcards-js');

const VCard = require('../models/VCard');


const router = express.Router();

router.param('slug', function(req, res, next, slug) {
    VCard.findOne({'slug': slug}, function(err, vcard) {
        if (err) {
            next(new Error(err));
        } else if (vcard) {
            req.vcard = vcard;
            next();
        } else {
            res.status(404);
            next();
        }
    });
});

// Index page
router.get('/', function(req, res, next) {
    VCard.find({}, function(err, vcards) {
        if (err) {
            next(new Error(err));
        } else {
            res.render('pages/index', {vcards: vcards});
        }
    });
});

// Create new card
router.route('/create')
    .get(function(req, res, next) {
        res.render('pages/create');
    })
    .post(function(req, res, next) {
        const {
            firstname,
            lastname,
            email,
            phone,
            street,
            street_no,
            city,
            zip,
            website,
            company,
            job
        } = req.body;
        
        const vcard = new VCard();

        vcard.firstname = firstname;
        vcard.lastname = lastname;
        vcard.email = email;
        vcard.phone = phone;
        vcard.street = street;
        vcard.street_no = street_no;
        vcard.city = city;
        vcard.zip = zip;
        vcard.website = website;
        vcard.company = company;
        vcard.job = job;

        vcard.save()
            .then(function(vcard) {
                res.redirect('/' + vcard.slug);
            })
            .catch(function(err) {
                next(new Error(err));
            });
    });

// Read existing card
router.get('/:slug', function(req, res, next) {
    res.render('pages/read', {vcard: req.vcard});
});

// Update existing card
router.route('/:slug/update')
    .get(function(req, res, next) {
        res.render('pages/update', {vcard: req.vcard});
    })
    .post(function(req, res, next) {
        const {
            firstname,
            lastname,
            email,
            phone,
            street,
            street_no,
            city,
            zip,
            website,
            company,
            job
        } = req.body;
        
        const vcard = req.vcard;

        vcard.firstname = firstname;
        vcard.lastname = lastname;
        vcard.email = email;
        vcard.phone = phone;
        vcard.street = street;
        vcard.street_no = street_no;
        vcard.city = city;
        vcard.zip = zip;
        vcard.website = website;
        vcard.company = company;
        vcard.job = job;

        vcard.save()
            .then(function(vcard) {
                res.redirect('/' + vcard.slug);
            })
            .catch(function(err) {
                next(new Error(err));
            });
    });

// Delete existing card
router.route('/:slug/delete')
    .get(function(req, res, next) {
        res.render('pages/delete', {vcard: req.vcard});
    })
    .post(function(req, res, next) {
        req.vcard.delete()
            .then(function() {
                res.redirect('/');
            })
            .catch(function(err) {
                next(new Error(err));
            });
    });

// Dynamic vCard endpoint
router.get('/:slug/contact.vcf', function(req, res, next) {
    const vcard = req.vcard;

    const v = vcard.getVCF();

    res.set('Content-Type', 'text/vcard; name="contact.vcf"');
    res.set('Content-Disposition', 'inline; filename="contact.vcf"');

    res.send(v.getFormattedString());
});

module.exports = router;