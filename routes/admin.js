var express = require('express');
var crypto = require('crypto')

var User = require('../model/user')
var Obat = require('../model/obatan')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/admin', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        //console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    }).select('username email firstname lastname users createdAt updatedAt')
});

/* GET users listing. */
router.get('/dataobat', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Obat.find({}, function(err, obatan) {
        //console.log(obatan);
        res.render('admin/obat/table', { session_store: session_store, obatans: obatan })
    }).select('_id kodeobat namaobat jenisobat stockobat harga created_at')
});

/* GET users listing. */
router.get('/inputobat', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/obat/input_data', { session_store: session_store})
});

//input data obatan
router.post('/inputobat', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

        Obat.find({ kodeobat: req.body.kodeobat }, function(err, obatan) {
            if (obatan.length == 0) {
                var dataobat = new Obat({
                    kodeobat: req.body.kodeobat,
                    namaobat: req.body.namaobat,
                    jenisobat: req.body.jenisobat,
                    stockobat: req.body.stockobat,
                    harga: req.body.harga,
                })
                dataobat.save(function(err) {
                    if (err) {
                        console.log(err);
                        req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                        res.redirect('/dataobat')
                    } else {
                        req.flash('msg_info', 'User telah berhasil dibuat')
                        res.redirect('/dataobat')
                    }
                })
            } else {
                req.flash('msg_error', 'Maaf, kode buku sudah ada....')
                res.render('admin/obat/input_data', {
                    session_store: session_store,
                    kodeobat: req.body.kodeobat,
                    namaobat: req.body.namaobat,
                    jenisobat: req.body.jenisobat,
                    stockobat: req.body.stockobat,
                    harga: req.body.harga,
                })
            }
        })
})

//menampilkan data berdasarkan id
router.get('/:id/editobat', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Obat.findOne({ _id: req.params.id }, function(err, obatan) {
        if (obatan) {
            console.log("obattt"+obatan);
            res.render('admin/obat/edit_data', { session_store: session_store, obatans: obatan })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/dataobat')
        }
    })
})

router.post('/:id/editobat', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

        Obat.findById(req.params.id, function(err, obat) {
            obat.kodeobat = req.body.kodeobat,
            obat.namaobat = req.body.namaobat,
            obat.jenisobat = req.body.jenisobat,
            obat.stockobat = req.body.stockobat,
            obat.harga = req.body.harga;

            obat.save(function(err, user) {
                if (err) {
                    req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
                } else {
                    req.flash('msg_info', 'Edit data berhasil!');
                }

                res.redirect('/dataobat');

            });
        });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Obat.findById(req.params.id, function(err, obatan){
        obatan.remove(function(err, obatan){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data buku berhasil dihapus!');
            }
            res.redirect('/dataobat');
        })
    })
})
module.exports = router;
