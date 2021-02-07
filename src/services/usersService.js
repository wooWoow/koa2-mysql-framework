import sqlHelper from "../utils/sqlHelper.js";

class usersService extends sqlHelper {
  async getUserInfoByUserId(username) {
    return await this.query(
      "SELECT * FROM users where user_name = ?",
      username
    );
  }
}

export default new usersService();
