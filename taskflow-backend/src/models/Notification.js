module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM(
        'task_assigned', 
        'status_changed', 
        'new_comment', 
        'project_invite', 
        'due_date_reminder', 
        'mention'
      ),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_read'
    },
    relatedEntity: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'related_entity'
    },
    relatedEntityId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'related_entity_id'
    }
  }, {
    tableName: 'notifications',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        fields: ['user_id', 'is_read', 'created_at']
      }
    ]
  });

  Notification.associate = function(models) {
    Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Notification;
};