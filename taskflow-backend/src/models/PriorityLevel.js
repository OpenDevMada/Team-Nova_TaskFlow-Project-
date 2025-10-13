'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PriorityLevel extends Model {
    static associate(models) {
      PriorityLevel.hasMany(models.Task, {
        foreignKey: 'priorityId',
        as: 'tasks'
      });
    }

    static async initData() {
      const priorities = [
        { id: 1, name: 'low', weight: 1, color: '#95E1D3' },
        { id: 2, name: 'medium', weight: 2, color: '#FCE38A' },
        { id: 3, name: 'high', weight: 3, color: '#F38181' }
      ];

      for (const priority of priorities) {
        await this.findOrCreate({
          where: { id: priority.id },
          defaults: priority
        });
      }
    }
  }

  PriorityLevel.init({
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    weight: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PriorityLevel',
    tableName: 'priority_levels',
    underscored: true,
    timestamps: false
  });

  return PriorityLevel;
};