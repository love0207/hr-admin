<template>
  <div>
    <el-button type="primary" size="mini" @click="roleDialogVisible = true"
      >添加角色</el-button
    >
    <el-table :data="roleList" border>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column
        label="角色名"
        prop="name"
        width="160px"
        sortable
      ></el-table-column
      ><el-table-column
        label="描述"
        prop="description"
        sortable
      ></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="showRightDialog(scope.row.id)"
            >分配权限</el-button
          >
          <el-button type="text">修改</el-button>
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-pagination
        :current-page="paramsobj.page"
        :page-size="paramsobj.pagesize"
        :page-sizes="[2, 3, 4, 5, 6]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="rightVisible">
      <el-tree
        v-if="rightVisible"
        ref="myTree"
        :data="premissions"
        :props="{ label: 'name' }"
        node-key="id"
        :default-checked-keys="selectedPermissions"
        default-expand-all
        show-checkbox
      ></el-tree>
      <template #footer>
        <el-button type="primary" @click="save">确认</el-button>
        <el-button @click="rightVisible = false">取消</el-button>
      </template></el-dialog
    >
    <!-- 新增和编辑对话框 -->
    <el-dialog title="新增" :visible.sync="roleDialogVisible" @close="reset">
      <el-form ref="myForm" label-width="80px" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onClick">确认</el-button>
        <el-button @click="roleDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole } from '@/api/setting'
import { getPermissions, getPermissionsById, assignPermission } from '@/api/premission'
import { tranferListToTree } from '@/utils/index'
export default {
  filters: {},
  components: {},
  data () {
    return {
      paramsobj: {
        page: 1, // 默认拿第一页数据
        pagesize: 4// 每页数量
      },
      roleList: [],
      total: null,
      rightVisible: false,
      premissions: [],
      selectedPermissions: [],
      id: null,
      roleDialogVisible: false,
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', tigger: 'blur' }]
      }

    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsobj)
      console.log(res)
      this.roleList = res.rows
      this.total = res.total// 用于做分页
    },
    handleSizeChange (pagesize) {
      this.paramsobj.pagesize = pagesize
      this.getRoleList()
    },
    handleCurrentChange (page) {
      this.paramsobj.page = page
      this.getRoleList()
    },
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        if (this.roleList.length === 1 && this.paramsobj.page > 1) { this.paramsobj.page-- }
        this.getRoleList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async showRightDialog (id) {
      this.id = id
      const res = await getPermissions()
      console.log(res)
      this.premissions = tranferListToTree(res, '0')
      const res1 = await getPermissionsById(id)
      this.selectedPermissions = res1.permIds
      this.rightVisible = true
    },
    async save () {
      const res = await assignPermission(this.id, this.$refs.myTree.getCheckedKeys())
      console.log(res)
      this.rightVisible = false // 关闭弹出层
    },
    onClick () {
      this.$refs.myForm.validate(async bool => {
        if (!bool) return this.$message.error('表单数据错误')
        await addRole(this.form)
        this.getRoleList()
      })
    },
    reset () {
      this.$refs.myForm.resetFields()
    }
  }
}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
