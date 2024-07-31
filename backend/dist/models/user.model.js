"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsersTable = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const createUsersTable = () => __awaiter(void 0, void 0, void 0, function* () {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE,
      email VARCHAR(255) UNIQUE,
      status_text TEXT,
      status_type VARCHAR(50) CHECK (status_type IN ('offline', 'online', 'busy')),
      google_id VARCHAR(255) UNIQUE,
      discord_id VARCHAR(255) UNIQUE,
      github_id VARCHAR(255) UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
    try {
        yield db_config_1.default.query(createTableQuery);
        console.log("Users table created successfully");
    }
    catch (error) {
        console.error("Error creating users table", error);
    }
});
exports.createUsersTable = createUsersTable;
