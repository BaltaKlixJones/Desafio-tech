const express = require("express");
const {Router} = require("express");
const routerUsers = express.Router();

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Sequelize = require("sequelize");
require("dotenv").config();
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;
const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);

const User = require("../models/User")(sequelize);


// Serializar el usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializar el usuario
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

// Local Strategy
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ where: { email: email } });
      if (user) {
        return done(
          null,
          false,
          req.flash("signupMessage", "Este mail ya esta en uso")
        );
      } else {
        const newUser = User.build({
          email,
          password: User.encryptPassword(password),
          status: "active",
        });
        await newUser.save();
        return done(null, newUser);
      }
    }
  )
);


// Logeo de usuario
passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({
    where: { email: email },
  });
  if(!user) {
    return done(null, false, req.flash('signinMessage', 'No User Found'));
  }
  if(!user.comparePassword(password)) {
    return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
  }
  return done(null, user);
}));


passport.use('local-changePassword', new LocalStrategy(
    { usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
  },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
          return done(null, false, { message: 'Correo electrónico no registrado' });
        }
  
        const hashedPassword = await User.encryptPassword(password, 10);
        user.password = hashedPassword;
        await user.save();
       
        return done(null, user);
      } catch (error) {
        console.log(error);
      }
    }
  ));