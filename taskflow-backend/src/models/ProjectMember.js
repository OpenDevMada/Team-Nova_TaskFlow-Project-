module.exports = (sequelize, DataTypes) => {
  const ProjectMember = sequelize.define('ProjectMember', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'member', 'viewer'),
      defaultValue: 'member'
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'joined_at'
    }
  }, {
    tableName: 'project_members',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['project_id', 'user_id']
      }
    ]
  });

  ProjectMember.associate = function(models) {
    ProjectMember.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
    ProjectMember.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    ProjectMember.belongsTo(models.User, { foreignKey: 'invitedBy', as: 'inviter' });
  };

  return ProjectMember;
};