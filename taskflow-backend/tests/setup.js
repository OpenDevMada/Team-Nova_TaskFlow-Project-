const { app } = require('../src/app');
const { sequelize, TaskStatus, PriorityLevel } = require('../src/models');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  await TaskStatus.initData();
  await PriorityLevel.initData();
});

afterAll(async () => {
  await sequelize.close();
});

module.exports = { app };
