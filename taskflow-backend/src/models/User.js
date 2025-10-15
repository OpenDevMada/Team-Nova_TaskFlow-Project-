'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Définition des associations
      User.hasMany(models.Project, { 
        foreignKey: 'ownerId', 
        as: 'ownedProjects' 
      });
      User.hasMany(models.ProjectMember, { 
        foreignKey: 'userId', 
        as: 'projectMemberships' 
      });
      User.hasMany(models.Task, { 
        foreignKey: 'assigneeId', 
        as: 'assignedTasks' 
      });
      User.hasMany(models.Task, { 
        foreignKey: 'createdBy', 
        as: 'createdTasks' 
      });
      User.hasMany(models.TaskComment, { 
        foreignKey: 'authorId', 
        as: 'comments' 
      });
      User.hasMany(models.Notification, { 
        foreignKey: 'userId', 
        as: 'notifications' 
      });
      User.hasMany(models.PasswordReset, { 
        foreignKey: 'userId', 
        as: 'passwordResets' 
      });
      User.hasMany(models.ActivityLog, { 
        foreignKey: 'userId', 
        as: 'activities' 
      });
      User.hasMany(models.ProjectMember, { 
        foreignKey: 'invitedBy', 
        as: 'invitedMembers' 
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash'
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'last_name'
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'avatar_url'
    },
    roleGlobal: {
      type: DataTypes.ENUM('admin', 'member', 'viewer'),
      defaultValue: 'member',
      field: 'role_global'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login_at'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return User;
};