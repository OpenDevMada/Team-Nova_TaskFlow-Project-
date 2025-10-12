module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
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
    }
  }, {
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

  Task.associate = function(models) {
    Task.belongsTo(models.TaskList, { foreignKey: 'listId', as: 'list' });
    Task.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
    Task.belongsTo(models.TaskStatus, { foreignKey: 'statusId', as: 'status' });
    Task.belongsTo(models.PriorityLevel, { foreignKey: 'priorityId', as: 'priority' });
    Task.belongsTo(models.User, { foreignKey: 'assigneeId', as: 'assignee' });
    Task.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    Task.hasMany(models.TaskComment, { foreignKey: 'taskId', as: 'comments' });
  };

  return Task;
};