import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import passportConfig from "./config/passport.js";

import { db } from "./config/db.js";

import routes from "./routes/index.js";
import { initializeDatabase, initProcedures } from "./models/_init_models.js";

import swaggerUi from 'swagger-ui-express';
import {specs} from "./swagger/swagger.js";

// Load config
dotenv.config();

// Passport config`
passportConfig(passport);

try {
  db.authenticate();
  console.log("Postgres connected successfully");
} catch (error) {
  console.error("Error", error);
}

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

//Session

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

//Passport middleware

app.use(passport.initialize());
app.use(passport.session());

//initialize or alter database

app.use("/api", routes);
app.get("/db/force", initializeDatabase);
app.get("/db/procedures", initProcedures);

// Swagger 

app.use("/reward-system", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on port ${process.env.PORT}`));
