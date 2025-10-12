module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
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
    }
  }, {
    tableName: 'projects',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Project.associate = function(models) {
    Project.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
    Project.hasMany(models.ProjectMember, { foreignKey: 'projectId', as: 'members' });
    Project.hasMany(models.TaskList, { foreignKey: 'projectId', as: 'taskLists' });
    Project.hasMany(models.Task, { foreignKey: 'projectId', as: 'tasks' });
    Project.hasMany(models.ActivityLog, { foreignKey: 'projectId', as: 'activities' });
  };

  return Project;
};