'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TaskList extends Model {
    static associate(models) {
      TaskList.belongsTo(models.Project, {
        foreignKey: 'projectId',
        as: 'project'
      });
      TaskList.belongsTo(models.TaskStatus, {
        foreignKey: 'statusId',
        as: 'status'
      });
      TaskList.hasMany(models.Task, {
        foreignKey: 'listId',
        as: 'tasks'
      });
    }

    // Méthode utilitaire pour récupérer avec les tâches triées
    static async getListWithTasks(listId) {
      return await TaskList.findByPk(listId, {
        include: [{
          model: Task,
          as: 'tasks',
          include: [
            { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
            { model: TaskStatus, as: 'status' },
            { model: PriorityLevel, as: 'priority' }
          ],
          order: [['position', 'ASC']]
        }]
      });
    }
  }

  TaskList.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    position: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'project_id',
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    statusId: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      field: 'status_id',
      references: {
        model: 'task_statuses',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'TaskList',
    tableName: 'task_lists',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return TaskList;
};