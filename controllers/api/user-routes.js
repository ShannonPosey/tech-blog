const { returnStatement } = require("@babel/types");
const router = require("express");
const {User, Comment, Post} = require("../../models");
// const withAut = require("../../utils/auth");

// GET /api/users
router.get("/", (req, res) => {
    User.findAll({
        attributes: {exclude: ["password"]}
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.json(500).json(err);
    });
});

// GET /api/users/1
router.get("/:id", (req, res) => {
    User.findOne({
        attributes: { exclude: ["password"]},
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ["id", "title", "text", "created_at"]
            },
            {
                model: Comment,
                attributes: ["id", "comment_text", "created_at"],
                include: {
                    model: Post,
                    attributes: ["title"]
                }
            },
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: "No user found with that id"});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
// without Aut
router.post("/", (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true,

            res.json(dbUserData);
        });
    });
});

// with AUt
// router.post("/", withAut, (req, res) => {
//     User.create({
//         username: req.body.username,
//         email: req.body.email,
//         password: req.body.password
//     })
//     .then(dbUserData => {
//         req.session.save(() => {
//             req.session.user_id = dbUserData.id;
//             req.session.username = dbUserData.username;
//             req.session.loggedIn = true,

//             res.json(dbUserData);
//         });
//     });
// });

// POST /api/login
// without Aut
router.post("/login", withAut, (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({message: "No user with that email address"});
            return;
        }

        // verify user
        const verifyPassword = dbUserData.checkPassword(req.body.password);
        if (!verifyPassword) {
            res.status(400).json({ message: "Incorrect password!"});
            return;
        }

        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: " You are now logged in!"});
        });
      });
});

// with Aut
// router.post("/login", withAut, (req, res) => {
//     User.findOne({
//         where: {
//             email: req.body.email
//         }
//     })
//     .then(dbUserData => {
//         if (!dbUserData) {
//             res.status(400).json({message: "No user with that email address"});
//             return;
//         }

//         // verify user
//         const verifyPassword = dbUserData.checkPassword(req.body.password);
//         if (!verifyPassword) {
//             res.status(400).json({ message: "Incorrect password!"});
//             return;
//         }

//         req.session.save(() => {
//             req.session.user_id = dbUserData.id;
//             req.session.username = dbUserData.username;
//             req.session.loggedIn = true;

//             res.json({ user: dbUserData, message: " You are now logged in!"});
//         });
//       });
// });

// without Aut
router.post("/logout", withAut, (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

// with Aut
// router.post("/logout", withAut, (req, res) => {
//     if (req.session.loggedIn) {
//         req.session.destroy(() => {
//             res.status(204).end();
//         });
//     }
//     else {
//         res.status(404).end();
//     }
// });

// without Aut
router.put("/:id", withAut, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({message: "No user found with that id"});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// with Aut
// router.put("/:id", withAut, (req, res) => {
//     User.update(req.body, {
//         individualHooks: true,
//         where: {
//             id: req.params.id
//         }
//     })
//     .then(dbUserData => {
//         if (!dbUserData[0]) {
//             res.status(404).json({message: "No user found with that id"});
//             return;
//         }
//         res.json(dbUserData);
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });
// });

// DELETE /api/users/1
// without Aut
router.delete("/:id", (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(500).json({message: " No user found with that id"});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(404).json(err);
    });
});

// with Aut
// router.delete("/:id", withAut, (req, res) => {
//     User.destroy({
//         where: {
//             id: req.params.id
//         }
//     })
//     .then(dbUserData => {
//         if (!dbUserData) {
//             res.status(500).json({message: " No user found with that id"});
//             return;
//         }
//         res.json(dbUserData);
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(404).json(err);
//     });
// });






















module.exports = router;