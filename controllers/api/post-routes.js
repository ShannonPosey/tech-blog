const { returnStatement } = require("@babel/types");
const router = require("express");
// const sequelize = require("../../config/connection");
const {Post, User, Comment} = require("../../models");
// const withAut = require("../../utils/auth");

// GET all users
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// get single user
router.get("/:id", (req, res) => {
    Post.findOne({
        where: {
            id: req. params.id
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
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// create posts
// without Aut
router.get("/", (req, res) => {
    Post.create({
        title: req.body.title,
        text: req.body.text,
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// // with Aut
// router.get("/", withAut, (req, res) => {
//     Post.create({
//         title: req.body.title,
//         text: req.body.text,
//         user_id: req.session.user_id
//     })
//     .then(dbPostData => res.json(dbPostData))
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });
// });

// update posts by user
// without Aut
router.put("/:id", (req, res) => {
    Post.update(
        {
            title: req.body.title,
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: "No post found with that id"});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// with Aut
// router.put("/:id", withAut, (req, res) => {
//     Post.update(
//         {
//             title: req.body.title,
//         },
//         {
//             where: {
//                 id: req.params.id
//             }
//         }
//     )
//     .then(dbPostData => {
//         if (!dbPostData) {
//             res.status(404).json({ message: "No post found with that id"});
//             return;
//         }
//         res.json(dbPostData);
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });
// });

// delete post
// without Aut
router.delete("/:id", (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: "No post found with that id"});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// with Aut
// router.delete("/:id", withAut, (req, res) => {
//     Post.destroy({
//         where: {
//             id: req.params.id
//         }
//     })
//     .then(dbPostData => {
//         if (!dbPostData) {
//             res.status(404).json({message: "No post found with that id"});
//             return;
//         }
//         res.json(dbPostData);
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });
// });

module.exports = router;