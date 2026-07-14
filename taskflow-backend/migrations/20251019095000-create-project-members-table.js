'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_members', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      role: {
        type: Sequelize.ENUM('admin', 'member', 'viewer'),
        defaultValue: 'member'
      },
      joined_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      invited_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('project_members', ['project_id']);
    await queryInterface.addIndex('project_members', ['user_id']);
    await queryInterface.addIndex('project_members', ['role']);
    await queryInterface.addConstraint('project_members', {
      fields: ['project_id', 'user_id'],
      type: 'unique',
      name: 'unique_project_user'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('project_members');
  }
};
