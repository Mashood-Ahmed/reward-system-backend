/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: API to manage groups
 */


/**
 * @swagger
 * definitions:
 *   Group:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         format: uuid
 *       name:
 *         type: string
 *       description:
 *         type: string
 */

/**
 * @swagger
 * /api/group/picture/{id}:
 *   put:
 *     summary: Update a group's image by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group
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
 *         description: Group image updated successfully
 *       401:
 *         description: Not authorized as group admin
 *       404:
 *         description: Group not found
 */

/**
 * @swagger
 * /api/group/{id}:
 *   get:
 *     summary: Get a group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: Group not found
 */

/**
 * @swagger
 * /api/group:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *               - description
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /api/group/{id}:
 *   put:
 *     summary: Update a group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *               - description
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Not authorized as group admin
 *       404:
 *         description: Group not found
 */

/**
 * @swagger
 * /api/group/{id}:
 *   delete:
 *     summary: Delete a group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       401:
 *         description: Not authorized as group admin
 *       404:
 *         description: Group not found
 */

