const { Router } = require("express");
const router = Router();
const userRouter = require("./userRoute");
const passport = require("passport");
router.use("/user", userRouter);

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/users",
    failureRedirect: "/users",
    passReqToCallback: true,
  }),
  (req, res) => {
    return res.json({ data: req.user });
  }
);

router.put(
  "/update",
  passport.authenticate("local-changePassword", {
    successRedirect: "/users",
    failureRedirect: "/users",
    passReqToCallback: true,
  }),
  (req, res) => {
    return res.json({ data: req.user });
  }
);

router.post(
  "/signin",
  passport.authenticate("local-signin", {
    successRedirect: "/users",
    failureRedirect: "/users",
    failureFlash: true,
  }),
  (req, res) => {
    return res.json({ data: req.user });
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
});

module.exports = router;
