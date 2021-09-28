const router = require("express").Router();
const {Post, User, Comment} = require("../models");
// const withAut = require("../utils/auth");

// without AUt
router.get("/", (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        include:[
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
        const post = dbPostData.map(post => post.get({plain: true}));
        res.render("dashboard", {posts, loggedIn: true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// with Aut
// router.get("/", withAut, (req, res) => {
//     Post.findAll({
//         where: {
//             user_id: req.session.user_id
//         },
//         include:[
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
//         const post = dbPostData.map(post => post.get({plain: true}));
//         res.render("dashboard", {posts, loggedIn: true});
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });
// });

// without Aut
router.get("/add", (req, res) => {
    res.render("add-post", {
        loggedIn: req.session.loggedIn
    });
});

// with Aut
// router.get("/add", withAut, (req, res) => {
//     res.render("add-post", {
//         loggedIn: req.session.loggedIn
//     });
// });

// without Aut
router.get("/edit/:id", (req, res) => {
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
            res.status(400).json({message: "No post found with that id"});
            return;
        }
        const post = dbPostData.get({plain: true});
        res.render("edit=post", {
            post,
            loggedIn: true
        });
    });
});

// with Aut
// router.get("/edit/:id", withAut, (req, res) => {
//     Post.findOne({
//         where: {
//             id: req.params.id
//         },
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
//         if (!dbPostData) {
//             res.status(400).json({message: "No post found with that id"});
//             return;
//         }
//         const post = dbPostData.get({plain: true});
//         res.render("edit=post", {
//             post,
//             loggedIn: true
//         });
//     });
// });

module.exports = router;