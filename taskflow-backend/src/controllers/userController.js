const { asyncHandler } = require('../middleware/errorHandler');
const UserService = require('../services/userService');

class UserController {
    static searchUsers = asyncHandler(async (req, res) => {
        try {
            const currentUser = req.user;
            const { q } = req.query;

            const users = await UserService.searchUsers(q, currentUser);

            res.json({
                success: true,
                data: users,
                count: users.length
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    });

    static getAllUsers = asyncHandler(async (req, res) => {
        try {
            const currentUser = req.user;

            const users = await UserService.getAllUsers(currentUser);

            res.json({
                success: true,
                data: users,
                count: users.length
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    });
}

module.exports = UserController;