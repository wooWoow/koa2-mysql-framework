import sqlHelper from "../utils/sqlHelper.js";

class usersService extends sqlHelper {
  async getUserInfo(params, getAll) {
    if (params.userId) {
      if (getAll) {
        return await this.query(
          "SELECT * FROM users where user_id = ?",
          params.userId
        );
      }
      return await this.query(
        "SELECT user_id,user_name,user_status,user_email,user_phone,user_address,user_roles FROM users where user_id = ?",
        params.userId
      );
    } else if (params.userName) {
      if (getAll) {
        return await this.query(
          "SELECT * FROM users where user_name = ?",
          params.userName
        );
      }
      return await this.query(
        "SELECT user_id,user_name,user_status,user_email,user_phone,user_address,user_roles FROM users where user_name = ?",
        params.userName
      );
    }
  }

  async changeUserPassword(params) {
    return await this.query(
      "UPDATE users SET user_password = ? WHERE user_id = ?",
      [params.passWord, params.userId]
    );
  }

  async addUser(params) {
    return await this.query(
      `
      INSERT INTO users 
        (user_name, user_password, user_phone, user_email, user_address, user_status, user_roles)
      VALUES
        (?, ?, ?, ?, ?, ?, ?)`,
      [params.name, params.passWord, params.phone , params.email , params.address , params.status, params.roles ]
    );
  }

  async getUser() {
    return await this.query(
      "SELECT user_id,user_name,user_status,user_email,user_phone,user_address,user_roles FROM users WHERE user_status != 2"
    );
  }

  async userStatusChange(params) {
    return await this.query(
      "UPDATE users SET user_status = ? WHERE user_id = ?",
      [params.status, params.userId]
    );
  }
}

export default new usersService();
