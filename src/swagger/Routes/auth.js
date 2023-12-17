/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API to manage auth
 */



/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Authenticate user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       '200':
 *         description: Login Successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       '500':
 *         description: Error Authenticating User
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Create a new User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       '200':
 *         description: User Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       '500':
 *         description: Error Creating New User
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *
 *     Register:
 *       type: object
 *       required:
 *         - full_name
 *         - username
 *         - email
 *         - gender
 *         - password
 *         - dob
 *         - bio
 *         - profile_picture_url
 *         - account_type
 *       properties:
 *         full_name:
 *           type: string
 *           maxLength: 255
 *         username:
 *           type: string
 *           maxLength: 255
 *         bio:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 320
 *         gender:
 *           type: string
 *           enum:
 *             - Male
 *             - Female
 *             - Others
 *         password:
 *           type: string
 *           maxLength: 255
 *         dob:
 *           type: string
 *           format: date
 *         profile_picture_url:
 *           type: string
 *           format: uri
 *           nullable: true
 *         account_type:
 *           type: string
 *           enum:
 *             - admin
 *             - user
 */
