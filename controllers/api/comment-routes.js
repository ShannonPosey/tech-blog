const router =  require("express").Router();
const {Comment} = require("../../models");
// const withAut = require("../../utils/auth");

// GET all posted comments
router.get("/", (req, res) => {
    Comment.findAll()
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// with Aut
// POST new comments
// router.post("/", withAut, (req, res) => {
//     Comment.create({
//         comment_text: req.body.comment_text,
//         post_id: req.body.post_id,
//         user_id: req.body.user_id
//     })
//     .then(dbCommentData => res.json(dbCommentData))
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });
// });

// without Aut
router.post("/", (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        user_id: req.body.user_id
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// with Aut
// router.delete("/:id", withAut, (req, res) => {
//     Comment.destroy({
//         where: {
//             id: req.params.id
//         }
//     })0
//         .then(dbCommentData => {
//             if (!dbCommentData) {
//                 res.status(404).json({message: "No comment found with this id"});
//                 return;
//             }
//             res.json(dbCommentData);
//         })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });
// });

// without Aut
router.delete("/:id",(req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(404).json({message: "No comment found with this id"});
                return;
            }
            res.json(dbCommentData);
        })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;