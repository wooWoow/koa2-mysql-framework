import sqlHelper from "../utils/sqlHelper.js";

class InfoService extends sqlHelper {
  async saveNode(params) {
    if (params.nodeId) {
      let sql = `
        UPDATE
          nodes
        SET
          node_title = ?,
          node_content = ?,
          node_date = NOW(),
          node_type_id = ?
        WHERE
          user_id = ? AND node_id = ?
      `;
      return await this.query(sql, [
        params.title,
        params.content,
        params.nodeTypeId,
        params.userId,
        params.nodeId,
      ]);
    } else {
      let sql = `
        INSERT INTO nodes 
          (node_title, node_date, node_content, user_id, node_type_id, node_display)
        VALUES
          (?, NOW(), ?, ?, ?, '1')
      `;
      return await this.query(sql, [
        params.title,
        params.content,
        params.userId,
        params.nodeTypeId,
      ]);
    }
  }

  async queryNode(params) {
    let sql = `
      SELECT
        nodes.node_id, nodes.node_title, node_type.node_type_str, node_type.node_type_id, nodes.node_date
      FROM
        nodes LEFT JOIN node_type ON nodes.node_type_id = node_type.node_type_id
      WHERE
        user_id = ${params.userId} AND node_display = ${params.display}
      GROUP BY node_date DESC
    `;

    if (params.nodeId) {
      sql = `
        SELECT
          nodes.node_id, nodes.node_title, node_type.node_type_str, node_type.node_type_id, nodes.node_content
        FROM
          nodes LEFT JOIN node_type ON nodes.node_type_id = node_type.node_type_id
        WHERE
          user_id = ${params.userId} AND node_id = ${params.nodeId}
      `;
    }
    return await this.query(sql);
  }

  async moveNodeToTrash(params) {
    let sql = "";
    if (params.display !== undefined) {
      // 存在dispaly字段则是移出/移入垃圾桶
      sql = `
        UPDATE nodes 
        SET
          node_display = ${params.display}
        WHERE
          user_id = ${params.user_id} AND node_id = ${params.node_id}
      `;
    } else {
      // 删除
      sql = `
        DELETE FROM
          nodes
        WHERE
          user_id = ${params.user_id} AND node_id = ${params.node_id};
      `;
    }
    return await this.query(sql);
  }

  async queryNodeType() {
    let sql = `
      SELECT * FROM node_type
    `;
    return await this.query(sql);
  }

  async delNodeType(id) {
    let sql = `
      CALL delNodeType(?)
    `;
    return await this.query(sql, [id]);
  }

  async addNodeType(params) {
    let sql = `
      CALL addNodeType(?)
    `;
    return await this.query(sql, [params.nodeTypeStr]);
  }
}

export default new InfoService();
