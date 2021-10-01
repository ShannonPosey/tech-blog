const router = require("express").Router();
const {Post, User, Comment} = require("../models");
// const withAut = require("../utils/auth");

// with Aut
router.get("/", (req, res) => {
    Post.findAll({
        order: [["created_at", "DESC"]],
        include: [
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username"]
                }
            },
            {
                model: User,
                attributes: ["username"]
            }
        ]
    })
    .then(dbPostData => {
        const post = dbPostData.map(post => post.get({
            plain: true}));
            res.render("homepage", {
                post,
                loggedIn: req.session.loggedIn
            });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// with Aut
// router.get("/", withAut, (req, res) => {
//     Post.findAll({
//         order: [["created_at", "DESC"]],
//         include: [
//             {
//                 model: Comment,
//                 attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
//                 include: {
//                     model: User,
//                     attributes: ["username"]
//                 }
//             },
//             {
//                 model: User,
//                 attributes: ["username"]
//             }
//         ]
//     })
//     .then(dbPostData => {
//         const posts = dbPostData.map(post => post.get({
//             plain: true}));
//             res.render("homepage", {
//                 post,
//                 loggedIn: req.session.loggedIn
//             });
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });
// });

router.get("/login", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
        return;
    }
    res.render("login");
});

router.get("/signup", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
        return;
    }
    res.render("signup");
});

router.get("/post/:id", (req, res) => {
    Post.findOne({
        where: { 
            id: req.params.id
        },
        include: [
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username"]
                }
            }, 
            {
                model: User,
                attributes: ["username"]
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: "No post found with that id"});
            return;
        }
        const post = dbPostData.get({plain: true});

        // pass data to template
        res.render("single=post", {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;