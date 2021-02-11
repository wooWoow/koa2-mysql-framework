import sqlHelper from "../utils/sqlHelper.js";

class InfoService extends sqlHelper {
  async saveNode(params) {
    if (params.nodeId) {
      let sql = `
        UPDATE nodes 
        SET
          node_title = ?,
          node_content = ?,
          node_date = NOW()
        WHERE
          user_id = ? AND node_id = ?
      `;
      return await this.query(sql, [
        params.title,
        params.content,
        params.userId,
        params.nodeId,
      ]);
    } else {
      let sql = `
        INSERT INTO nodes 
        (node_title, node_date, node_content, user_id, node_type, node_display)
        VALUES
        (?, NOW(), ?, ?, ?, '1')
      `;
      return await this.query(sql, [
        params.title,
        params.content,
        params.userId,
        params.type,
      ]);
    }
  }

  async queryNode(params) {
    let sql = `
      SELECT 
      node_id, node_title, node_type, node_date
      FROM 
      nodes
      WHERE user_id = ${params.userId} AND node_display = ${params.display}
      GROUP BY node_date DESC
    `;

    if (params.nodeId) {
      sql = `
        SELECT 
        node_id, node_title, node_type, node_content
        FROM 
        nodes
        WHERE user_id = ${params.userId} AND node_id = ${params.nodeId}
      `;
    }
    return await this.query(sql);
  }

  async moveNodeToTrash(params) {
    let sql = "";
    console.log(params)
    if (params.display !== undefined) { // 存在dispaly字段则是移出/移入垃圾桶
      sql = `
        UPDATE nodes 
        SET
          node_display = ${params.display}
        WHERE
          user_id = ${params.user_id} AND node_id = ${params.node_id}
      `;
      console.log('1')
    } else { // 删除
      sql = `
        DELETE FROM
          nodes
        WHERE
          user_id = ${params.user_id} AND node_id = ${params.node_id};
      `;
      console.log(2)
    }
    return await this.query(sql);
  }
}

export default new InfoService();
