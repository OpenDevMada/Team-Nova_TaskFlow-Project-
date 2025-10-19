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

    // Table task_statuses
    await queryInterface.createTable('task_statuses', {
      id: {
        type: Sequelize.SMALLINT,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      color: {
        type: Sequelize.STRING(7),
        allowNull: false
      },
      display_order: {
        type: Sequelize.SMALLINT,
        allowNull: false
      }
    });

    // Table priority_levels
    await queryInterface.createTable('priority_levels', {
      id: {
        type: Sequelize.SMALLINT,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      weight: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      color: {
        type: Sequelize.STRING(7),
        allowNull: false
      }
    });

    // Données initiales pour task_statuses
    await queryInterface.bulkInsert('task_statuses', [
      { id: 1, name: 'todo', description: 'À faire', color: '#FF6B6B', display_order: 1 },
      { id: 2, name: 'in_progress', description: 'En cours', color: '#4ECDC4', display_order: 2 },
      { id: 3, name: 'done', description: 'Terminé', color: '#45B7D1', display_order: 3 }
    ]);

    // Données initiales pour priority_levels
    await queryInterface.bulkInsert('priority_levels', [
      { id: 1, name: 'low', weight: 1, color: '#95E1D3' },
      { id: 2, name: 'medium', weight: 2, color: '#FCE38A' },
      { id: 3, name: 'high', weight: 3, color: '#F38181' }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('priority_levels');
    await queryInterface.dropTable('task_statuses');
  }
};
