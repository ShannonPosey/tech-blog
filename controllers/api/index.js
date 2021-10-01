const router = require("express").Router();

const userRouters = require("./user-routes");
const postRouters = require("./post-routes");
const commentRouters = require("./comment-routes");

router.use("/user", userRouters);
router.use("/post", postRouters);
router.use("/comments", commentRouters);

module.exports = router;
