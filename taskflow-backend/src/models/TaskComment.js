module.exports = (sequelize, DataTypes) => {
  const TaskComment = sequelize.define('TaskComment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'task_comments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  TaskComment.associate = function(models) {
    TaskComment.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task' });
    TaskComment.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
  };

  return TaskComment;
};