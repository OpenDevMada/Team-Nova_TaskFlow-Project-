const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, projectController.create);
router.get('/', authenticate, projectController.findAll);
router.get('/:id', authenticate, projectController.findById);
router.put('/:id', authenticate, projectController.update);
router.delete('/:id', authenticate, projectController.delete);

module.exports = router;