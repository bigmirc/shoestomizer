const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('./models/user')


function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        const user2 = (await User.findOne({email:email})).toJSON()
        if (user == null) {
            return done(null, false, { message: 'There is no user with that password. Please try again'})
        };

        try {
            if ( await bcrypt.compare(password,user.password)) {
                return done(null,user)

            } else {
                return done(null, false, {message: "Wrong password! Please try again."})
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'},authenticateUser))
    passport.serializeUser((user,done) => done(null,user.id))
    passport.deserializeUser((id,done) => {
        return done(null,getUserById(id))
    })

    

}



module.exports = initialize