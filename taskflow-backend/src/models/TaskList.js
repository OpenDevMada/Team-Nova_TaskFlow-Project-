module.exports = (sequelize, DataTypes) => {
  const TaskList = sequelize.define('TaskList', {
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
    statusId: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      field: 'status_id'
    }
  }, {
    tableName: 'task_lists',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  TaskList.associate = function(models) {
    TaskList.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
    TaskList.belongsTo(models.TaskStatus, { foreignKey: 'statusId', as: 'status' });
    TaskList.hasMany(models.Task, { foreignKey: 'listId', as: 'tasks' });
  };

  return TaskList;
};