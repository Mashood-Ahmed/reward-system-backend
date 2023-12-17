/**
 * @swagger
 * tags:
 *   name: User
 *   description: API to manage users
 */
/**
 * @swagger
 * /api/user/pfp:
 *   put:
 *     summary: Upload a user's profile picture
 *     description: Upload a profile picture for a user.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully.
 *       402:
 *         description: No attachments found.
 *       500:
 *         description: Internal server error.
 */



/**
 * @swagger
 * /api/user/app:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of users.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a user by its ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: A user object.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update a user by ID
 *     description: Update a user's information by its ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: body
 *         name: user
 *         description: User object that needs to be updated.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 full_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 password:
 *                   type: string
 *                 account_type:
 *                   type: string
 *                   enum: [admin, user]
 *               required:
 *                 - full_name
 *                 - email
 *                 - gender
 *                 - password
 *     responses:
 *       200:
 *         description: Updated user object.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Delete a user by its ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
