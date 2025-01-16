import { Sequelize, DataTypes, Model } from '@sequelize/core';
import bcrypt from 'bcrypt';
// import validator from 'validator';
var validator = require('validator');
const isEmail = require('validator/lib/isEmail');
import {sequelize} from '../sequelize';


interface UserAttributes {
    id?: number;
    email: string;
    hashedPassword: string;
  }

  class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public hashedPassword!: string;

    // Instance methods for comparing passwords
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.hashedPassword);
  }
}

// Define the User model
User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { name: 'unique_email',
          msg: 'Email already exists', },
        validate: {
          isEmail: {
            msg: 'Invalid email format',
          },
        },
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 255],
            msg: 'Minimum password length is 6 characters',
          },
        },
      },
    },
    {
      sequelize,
      tableName: 'users',  
      freezeTableName: true,  // Disable automatic pluralization
      timestamps: false,
      hooks: {
        beforeCreate: async (user: User) => {
          if (!validator.isEmail(user.email)) {
            throw new Error('Invalid email format');
          }
          const salt = await bcrypt.genSalt(10);
          user.hashedPassword = await bcrypt.hash(user.hashedPassword, salt);
        },
      },
    }
  );
  
  export default User;