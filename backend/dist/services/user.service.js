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
exports.findUserById = exports.findOrCreateUser = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const findOrCreateUser = (provider, profile) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_config_1.default.connect();
    try {
        yield client.query("BEGIN");
        const providerId = `${provider}_id`;
        const { rows } = yield client.query(`SELECT * FROM users WHERE ${providerId} = $1`, [profile.id]);
        if (rows.length > 0) {
            yield client.query("COMMIT");
            return rows[0];
        }
        const newUser = {
            username: profile.displayName || profile.username,
            email: profile.email || (profile.emails && profile.emails[0].value),
            [providerId]: profile.id,
            status_type: "offline",
        };
        const { rows: newRows } = yield client.query(`INSERT INTO users (username, email, ${providerId}, status_type) 
       VALUES ($1, $2, $3, $4) RETURNING *`, [
            newUser.username,
            newUser.email,
            newUser[providerId],
            newUser.status_type,
        ]);
        yield client.query("COMMIT");
        return newRows[0];
    }
    catch (e) {
        yield client.query("ROLLBACK");
        throw e;
    }
    finally {
        client.release();
    }
});
exports.findOrCreateUser = findOrCreateUser;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield db_config_1.default.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0];
});
exports.findUserById = findUserById;
