// let sql = [
//   {
//     table: 'product',
//     column: '*',
//     where: ['product.title LIKE "%可口可乐%"'],
//     sort: 'create_time'
//   },
//   {
//     table: 'admin_userinfo',
//     column: ['nickname', 'id as user_id'],
//     where: ['admin_userinfo.id = product.operator'],
//     sort: { id:'desc', create_time:'asc' }
//   },
//   {
//     table: 'admin_role',
//     column: ['name', 'id as role_id'],
//     where: ['admin_userinfo.role = admin_role.id']
//   }
// ]
/**  
 * 表查询(可多表)
 * @param {Object} option
 * @param {String} option.table
 * @param {Array || String} option.column
 * @param {Array} option.where
 * @param {Array || String} option.sort
 * --------------------------------------
 * @param {Object} pageOption
 * @param {Number} pageOption.current
 * @param {Number} pageOption.pageSize
 * --------------------------------------
 * @return {String}
 */
const QUERY_TABLES = (option, pageOption) => {
  let table = [];
  let column = [];
  let where = [];
  let sort = [];
  let page = '';
  for (let item of option) {
    if (item.hasOwnProperty('table')) {
      table.push(`\`${item.table}\``);
    }
    if (item.hasOwnProperty('column') && item.column) {
      if (Array.isArray(item.column)) {
        for (let col of item.column) {
          column.push(`\`${item.table}\`.${col}`)
        }
      } else {
        column.push(`\`${item.table}\`.${item.column}`)
      }
    }
    if (item.hasOwnProperty('where') && item.where) {
      if (typeof item.where !== 'string') {
        for (let whereKey in item.where) {
          where.push(`\`${item.table}\`.${whereKey} = ${item.where[whereKey]}`);
        }
      } else {
        where.push(item.where)
      }
    }
    if (item.hasOwnProperty('sort') && item.sort) {
      if (typeof item.sort !== 'string') {
        for (let sortKey in item.sort) {
          const sortValue = item.sort[sortKey] === 'desc' ? 'desc' : 'asc';
          sort.push(`\`${item.table}\`.${sortKey} ${sortValue}`);
        }
      } else {
        // 默认倒叙
        sort.push(`\`${item.table}\`.${item.sort} desc`);
      }
    }
  }
  if (pageOption) {
    const { current = 0, pageSize = 10 } = pageOption;
    page = `LIMIT ${current * pageSize}, ${pageSize}`
  }
  return `
    SELECT ${column ? column.join(' , ') : '*'} FROM ${table.join(' , ')} WHERE ${where ? where.join(' AND ') : 1} ${sort.length > 0 ? `order by ${sort.join(' , ')}` : ''} ${page}
  `;
}

/**  
 * 总数查询(可多表)
 * @param {Object} option
 * @param {String} option.table
 * @param {Array} option.where
 * --------------------------------------
 * @param {Object} pageOption
 * @param {Number} pageOption.current
 * @param {Number} pageOption.pageSize
 * --------------------------------------
 * @return {String}
 */
const QUERY_COUNT = (option) => {
  let table = [];
  let where = [];
  for (let item of option) {
    if (item.hasOwnProperty('table')) {
      table.push(`\`${item.table}\``);
    }
    if (item.hasOwnProperty('where') && item.where) {
      if (typeof item.where !== 'string') {
        for (let whereKey in item.where) {
          where.push(`\`${item.table}\`.${whereKey} = ${item.where[whereKey]}`)
        }
      } else {
        where.push(item.where)
      }
    }
  }
  return `SELECT COUNT(*) AS total FROM ${table.join(' , ')} WHERE ${where ? where.join(' AND ') : 1}`
}

module.exports = {
  QUERY_TABLES,
  QUERY_COUNT
}