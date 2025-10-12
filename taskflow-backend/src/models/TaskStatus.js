module.exports = (sequelize, DataTypes) => {
  const TaskStatus = sequelize.define('TaskStatus', {
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
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false
    },
    displayOrder: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      field: 'display_order'
    }
  }, {
    tableName: 'task_statuses',
    underscored: true,
    timestamps: false
  });

  TaskStatus.associate = function(models) {
    TaskStatus.hasMany(models.Task, { foreignKey: 'statusId', as: 'tasks' });
    TaskStatus.hasMany(models.TaskList, { foreignKey: 'statusId', as: 'taskLists' });
  };

  // Données initiales
  TaskStatus.initData = async function() {
    const statuses = [
      { id: 1, name: 'todo', description: 'À faire', color: '#FF6B6B', displayOrder: 1 },
      { id: 2, name: 'in_progress', description: 'En cours', color: '#4ECDC4', displayOrder: 2 },
      { id: 3, name: 'done', description: 'Terminé', color: '#45B7D1', displayOrder: 3 }
    ];

    for (const status of statuses) {
      await this.findOrCreate({
        where: { id: status.id },
        defaults: status
      });
    }
  };

  return TaskStatus;
};