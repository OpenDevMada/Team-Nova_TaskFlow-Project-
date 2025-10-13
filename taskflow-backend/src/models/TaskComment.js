'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TaskComment extends Model {
    static associate(models) {
      TaskComment.belongsTo(models.Task, {
        foreignKey: 'taskId',
        as: 'task'
      });
      TaskComment.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'author'
      });
    }
  }

  TaskComment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'task_id',
      references: {
        model: 'tasks',
        key: 'id'
      }
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'author_id',
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'TaskComment',
    tableName: 'task_comments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return TaskComment;
};