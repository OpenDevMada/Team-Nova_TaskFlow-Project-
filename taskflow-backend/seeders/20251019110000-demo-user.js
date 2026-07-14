'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('Admin123', 12);

    await queryInterface.bulkInsert('users', [{
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@taskflow.com',
      password_hash: passwordHash,
      first_name: 'Admin',
      last_name: 'TaskFlow',
      role_global: 'admin',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'member@taskflow.com',
      password_hash: passwordHash,
      first_name: 'Membre',
      last_name: 'Test',
      role_global: 'member',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: { [Sequelize.Op.in]: ['admin@taskflow.com', 'member@taskflow.com'] }
    });
  }
};
