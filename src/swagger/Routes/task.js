/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API to manage tasks
 */

/**
 * @swagger
 * definitions:
 *   Task:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         format: uuid
 *       title:
 *         type: string
 *         required: true
 *       description:
 *         type: string
 *       start_date:
 *         type: string
 *         format: date
 *       end_date:
 *         type: string
 *         format: date
 *       start_time:
 *         type: string
 *         format: time
 *       end_time:
 *         type: string
 *         format: time
 *         reward:
 *           type: string
 *           description: The reward associated with the task.
 *         assigned_to:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of users assigned to the task.
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of tags associated with the task.
 *         file_urls:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *         status:
 *           type: string
 *           enum: [Pending, Assigned, Completed, Rewarded]
 *           default: Pending
 *   Participant:
 *     type: object
 *     properties:
 *       user_id:
 *         type: string
 *         description: ID of the user.
 *       task_id:
 *         type: string
 *         format: uuid
 *         description: ID of the associated task.
 */


/**
 * @swagger
 * /api/task/member/1:
 *   get:
 *     summary: Get tasks assigned to a user
 *     description: Retrieve tasks assigned to a specific user.
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks assigned to the user.
 *       404:
 *         description: No tasks found for the user.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/task/:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               title:
 *                 type: string
 *                 description: Title of the task
 *               description:
 *                 type: string
 *                 description: Description of the task
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date of the task
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: End date of the task
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: Start time of the task
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: End time of the task
 *               reward:
 *                 type: number
 *                 description: Reward for the task
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for the task (e.g., ["Sample", "Test"])
 *               assigned_to:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Participants assigned to the task (e.g., ["user1", "user2"])
 *     responses:
 *       '200':
 *         description: Successful response with the created task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Task'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid input data
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */


/**
 * @swagger
 * /api/task/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /api/task/creator/1:
 *   get:
 *     summary: Get tasks created by the user
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Successful operation
 */

/**
 * @swagger
 * /api/task/participant/{id}:
 *   get:
 *     summary: Get tasks assigned to the user
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: List of tasks assigned to the user
 *       401:
 *         description: Not a participant of the task or unauthorized
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/task/participants/{id}:
 *   get:
 *     summary: Get participants of a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: List of participants of the task
 *       401:
 *         description: Not authorized as task creator
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/task/approve/{id}:
 *   put:
 *     summary: Approve a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participant_id:
 *                 type: string
 *                 format: uuid
 *             required:
 *               - participant_id
 *     responses:
 *       200:
 *         description: Task approved successfully
 *       401:
 *         description: Not authorized as task creator
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/task/status/{id}:
 *   put:
 *     summary: Update task status
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       401:
 *         description: Not authorized as task creator
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/task/submit/{id}:
 *   put:
 *     summary: Submit a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: file
 *     responses:
 *       200:
 *         description: Task submitted successfully
 *       401:
 *         description: Not a participant of the task or unauthorized
 *       402:
 *         description: No attachments found
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/task/status/{id}:
 *   put:
 *     summary: Update task status by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Assigned, Completed]
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Not authorized as task admin
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /api/task/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *               image_urls:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [Pending, Assigned, Completed]
 *             required:
 *               - title
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Not authorized as task admin
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /api/task/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Not authorized as task admin
 *       404:
 *         description: Task not found
 */
