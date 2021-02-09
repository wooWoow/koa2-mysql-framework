import sqlHelper from "../utils/sqlHelper.js";

class InfoService extends sqlHelper {
  async saveNode(params) {
    let sql = `
      INSERT INTO nodes 
      (node_title, node_date, node_content, user_id, node_type, node_display)
      VALUES
      ('${params.title}', NOW(), '${params.content}', '${params.userId}', '${params.type}', '1')
    `;

    if (params.nodeId) {
      sql = `
        UPDATE nodes 
        SET
          node_title = '${params.title}',
          node_content = '${params.content}',
          node_date = NOW()
        WHERE
          user_id = ${params.userId} AND node_id = ${params.nodeId}
      `;
    }

    return await this.query(sql);
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
    const sql = `
      UPDATE nodes 
      SET
        node_display = 0
      WHERE
        user_id = ${params.user_id} AND node_id = ${params.node_id}
    `;
    return await this.query(sql);
  }
}

export default new InfoService();
