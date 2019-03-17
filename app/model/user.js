// {app_root}/app/model/user.js
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    mobile_phone: { type: String  },
    password: { type: String  },
  });

  return mongoose.model('User', UserSchema);
}