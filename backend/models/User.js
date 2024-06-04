import mongoose from 'mongoose';

import validator from 'validator';
import bcrypt, { genSalt, compare } from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: {
        value: true,
        message: 'User name is required',
      },
      trim: true,
    },

    email: {
      type: String,
      unique: {
        value: true,
        message: 'Email is already in use',
      },
      required: {
        value: true,
        message: 'Email is required',
      },
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: 'Email is invalid',
      },
    },

    password: {
      type: String,
      required: {
        value: true,
        message: 'Password is required',
      },
      trim: true,
      minlength: [3, 'Password must be at least 3 characters'],

      select: false,
    },

    confirmPassword: {
      type: String,
      required: {
        value: true,
        message: 'Confirm password is required',
      },
      trim: true,
      select: false,

      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: 'Passwords do not match',
      },
    },

    image: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Schema middlewares
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    console.log('PASSWORD KHÔNG THAY ĐỔI');
    return next();
  }

  this.password = await bcrypt.hash(this.password, await genSalt(10));
  this.confirmPassword = null;
  console.log(this.password);

  next();
});

// userSchema.pre('save', function (next) {
//   console.log('next pre save hook');
// });

// Schema methods
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
