'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.TaskList, {
        foreignKey: 'listId',
        as: 'list'
      });
      Task.belongsTo(models.Project, {
        foreignKey: 'projectId',
        as: 'project'
      });
      Task.belongsTo(models.TaskStatus, {
        foreignKey: 'statusId',
        as: 'status'
      });
      Task.belongsTo(models.PriorityLevel, {
        foreignKey: 'priorityId',
        as: 'priority'
      });
      Task.belongsTo(models.User, {
        foreignKey: 'assigneeId',
        as: 'assignee'
      });
      Task.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator'
      });
      Task.hasMany(models.TaskComment, {
        foreignKey: 'taskId',
        as: 'comments'
      });
    }
  }

  Task.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'due_date'
    },
    dueTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'due_time'
    },
    position: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completed_at'
    },
    listId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'list_id'
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'project_id'
    },
    statusId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      field: 'status_id',
      defaultValue: 1
    },
    priorityId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      field: 'priority_id',
      defaultValue: 2
    },
    assigneeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assignee_id'
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by'
    }
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['project_id', 'status_id']
      },
      {
        fields: ['assignee_id', 'status_id']
      },
      {
        fields: ['due_date']
      }
    ]
  });

  return Task;
};