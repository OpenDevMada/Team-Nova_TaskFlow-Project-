'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      due_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      position: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      list_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'task_lists',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      status_id: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        references: {
          model: 'task_statuses',
          key: 'id'
        },
        defaultValue: 1
      },
      priority_id: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        references: {
          model: 'priority_levels',
          key: 'id'
        },
        defaultValue: 2
      },
      assignee_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Index critiques pour les performances
    await queryInterface.addIndex('tasks', ['project_id', 'status_id']);
    await queryInterface.addIndex('tasks', ['assignee_id', 'status_id']);
    await queryInterface.addIndex('tasks', ['due_date']);
    await queryInterface.addIndex('tasks', ['position']);
    await queryInterface.addIndex('tasks', ['created_by']);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('tasks');
  }
};
