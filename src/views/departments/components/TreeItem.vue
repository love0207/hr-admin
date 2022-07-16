<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; padding: 30px 140px; font-size: 14px; width: 100%"
    >
      <el-col>
        <span>{{ node.data ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="onCommand">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      title="新增部门"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="handleClose"
      @click.native.stop
    >
      <el-form label-width="100px">
        <el-form-item label="部门名称">
          <el-input placeholder="1-50个字符"></el-input>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input placeholder="1-50个字符"></el-input>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input placeholder="1-50个字符"></el-input>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input placeholder="1-50个字符"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delDepartment } from '@/api/departments'
export default {
  filters: {},
  components: {},
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      addDialogVisible: false,
      addDepartmentForm: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: ''// 部门介绍
      }
    }
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    async onCommand (key) {
      if (key === 'a') {
        this.addDialogVisible = true
      } else if (key === 'b') {
        console.log('查看')
      } else {
        try {
          await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          console.log('用户确认了')
          await delDepartment(this.node.data.id)
          this.$emit('delDepartment')
        } catch (err) {
          console.log(err)
          this.$notify({
            message: '取消了删除',
            duration: 1000
          })
          console.log(1)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
