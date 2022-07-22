import request from '@/utils/request'
// 获取员工列表
export const getEmployee = ({ page, size }) => {
  return request({
    url: 'sys/user',
    params: { page, size }
  })
}

// 批量从excel中导入员工列表
export const importEmployee = data => {
  return request({
    method: 'POST',
    url: '/sys/user/batch',
    data
  })
}

// 根据id删除角色
export const delEmployee = id => {
  return request({
    method: 'DELETE',
    url: `/sys/user/${id}`
  })
}

// 获取角色信息
export function getRoleList (id) {
  return request({
    url: `/sys/user/${id}`
  })
}
// 获取所有角色列表
export function getRoleList2 () {
  return request({
    url: `/sys/role`
  })
}
/** *
 * 给用户分配角色
 * ***/
export function assignRoles (data) {
  return request({
    method: 'PUT',
    url: '/sys/user/assignRoles',
    data
  })
}
