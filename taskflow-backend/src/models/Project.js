'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.User, { 
        foreignKey: 'ownerId', 
        as: 'owner' 
      });
      Project.hasMany(models.ProjectMember, { 
        foreignKey: 'projectId', 
        as: 'members' 
      });
      Project.hasMany(models.TaskList, { 
        foreignKey: 'projectId', 
        as: 'taskLists' 
      });
      Project.hasMany(models.Task, { 
        foreignKey: 'projectId', 
        as: 'tasks' 
      });
      Project.hasMany(models.ActivityLog, { 
        foreignKey: 'projectId', 
        as: 'activities' 
      });
    }
  }

  Project.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: true,
      validate: {
        is: /^#[0-9A-F]{6}$/i
      }
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_archived'
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'owner_id',
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Project',
    tableName: 'projects',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Project;
};