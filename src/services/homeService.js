import sqlHelper from "../utils/sqlHelper.js";

class HomeService extends sqlHelper {
  async saveHumiture(params) {
    let sql = `
      INSERT INTO humiture 
        (time_str, humiture_val)
      VALUES
        (?, ?)
    `;
    return await this.query(sql, [params.time_str, params.humiture_val]);
  }

  async getHistoryHum(params) {
    let sql = `SELECT * FROM humiture WHERE time_str = ?`;
    return await this.query(sql, [params.timeStr]);
  }
}

export default new HomeService();
