<template>
  <div>
    <button-group>
      <el-row>
        <el-button size="small" type="success" @click="addItem()"><i class="el-icon-plus"></i> 新增</el-button>
      </el-row>
    </button-group>

    <el-table
      :data="tableData"
      :height="tableHeight"
      v-loading="loading"
      border
      :stripe="true"
      style="width: 100%">
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column prop="userCode" label="用户名" align="center"></el-table-column>
      <el-table-column prop="userName" label="姓名"></el-table-column>
      <el-table-column label="性别" :show-overflow-tooltip="true" align="center" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.sex === 1">男</span>
          <span v-if="scope.row.sex === 2">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
      <el-table-column prop="mail" label="邮箱" align="center"></el-table-column>
      <el-table-column label="用户角色" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ getRole(scope.row.roleId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ $dateFormat(scope.row.addTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i>删除</el-button>
          <el-button size="small" type="text" @click="handleReset(scope.$index, scope.row)"><i class="el-icon-s-tools"></i>重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="param.page"
      :page-sizes="[20, 30, 50, 100, 200]"
      :page-size="param.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>

    <el-dialog title="编辑" :visible.sync="editDialog" width="600px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="用户名" required>
          <el-input v-model="editForm.userCode" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.sex" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in sexs" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" required>
          <el-select v-model="editForm.roleId" placeholder="请选择" style="width: 100%;">
            <el-option :key="0" :label="'请选择'" :value="0"></el-option>
            <el-option v-for="item in roleList" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="editDialog = false" plain>取 消</el-button>
        <el-button type="primary" @click="trueEdit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增" :visible.sync="addDialog" width="600px">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="用户名" required>
          <el-input v-model="addForm.userCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="addForm.sex" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in sexs" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" required>
          <el-select v-model="addForm.roleId" placeholder="请选择" style="width: 100%;">
            <el-option :key="0" :label="'请选择'" :value="0"></el-option>
            <el-option v-for="item in roleList" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="addDialog = false" plain>取 消</el-button>
        <el-button type="primary" @click="trueAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ButtonGroup from '@/components/ButtonGroup'

export default {
  components: {
    ButtonGroup
  },
  data () {
    return {
      param: {
        page: 1,
        limit: 20
      },
      loading: false,
      tableData: [],
      totalCount: 0,
      sexs: [
        {id: 1, label: '男'},
        {id: 2, label: '女'}
      ],
      editForm: {
        id: 0,
        userCode: '',
        userName: '',
        sex: 1,
        phone: '',
        mail: '',
        roleId: 0
      },
      editDialog: false,
      addForm: {
        userCode: '',
        userName: '',
        sex: 1,
        phone: '',
        mail: '',
        roleId: 0
      },
      addDialog: false,
      roleList: []
    }
  },
  computed: {
    ...mapState({
      tableHeight: (state) => state.menu.deviceHeight - 120
    })
  },
  created () {
    this.loadRole()
    this.loadData()
  },
  methods: {
    handleSizeChange (val) {
      this.limit = val
      this.loadData()
    },
    handleCurrentChange (val) {
      this.page = val
      this.loadData()
    },
    loadData () {
      this.loading = true
      this.$post('/main/user/list', this.param).then(res => {
        this.tableData = res.records
        this.totalCount = res.total
        this.loading = false
      })
    },
    loadRole () {
      this.$post('/main/role/list', {page: 1, limit: 100}).then(res => {
        this.roleList = res.records
      })
    },
    addItem () {
      this.addForm.userCode = ''
      this.addForm.userName = ''
      this.addForm.sex = 1
      this.addForm.phone = ''
      this.addForm.mail = ''
      this.addForm.roleId = 0
      this.addDialog = true
    },
    trueAdd () {
      if (this.addForm.userCode === '') {
        this.$notify({ title: '提示', message: '用户名必填!', type: 'error' })
        return
      }
      if (this.addForm.userName === '') {
        this.$notify({ title: '提示', message: '姓名必填!', type: 'error' })
        return
      }
      if (this.addForm.roleId === 0) {
        this.$notify({ title: '提示', message: '用户角色必选!', type: 'error' })
        return
      }
      this.$post('/main/user/add', this.addForm).then(res => {
        if (res.state === 'failed') {
          this.$notify({ title: '提示', message: '创建失败，用户名已存在！', type: 'error' })
        } else {
          this.loadData()
          this.$notify({ title: '提示', message: '创建成功。初始密码为123456，请及时登录修改密码！', type: 'success' })
          this.addDialog = false
        }
      })
    },
    handleEdit (index, row) {
      this.editForm.id = row.id
      this.editForm.userCode = row.userCode
      this.editForm.userName = row.userName
      this.editForm.sex = row.sex
      this.editForm.phone = row.phone
      this.editForm.mail = row.mail
      this.editForm.roleId = row.roleId
      this.editDialog = true
    },
    trueEdit () {
      if (this.editForm.userName === '') {
        this.$notify({ title: '提示', message: '姓名必填!', type: 'error' })
        return
      }
      if (this.editForm.roleId === 0) {
        this.$notify({ title: '提示', message: '用户角色必选!', type: 'error' })
        return
      }
      this.$post('/main/user/edit', this.editForm).then(res => {
        this.loadData()
        this.$notify({ title: '提示', message: '修改成功!', type: 'success' })
        this.editDialog = false
      })
    },
    handleDelete (index, row) {
      this.$confirm('您确认删除该记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post('/main/user/delete', {id: row.id}).then(res => {
          this.loadData()
          this.$notify({ title: '提示', message: '删除成功!', type: 'success' })
        })
      }).catch(() => {})
    },
    handleReset (index, row) {
      this.$confirm('您确认该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post('/main/user/reset', {id: row.id}).then(res => {
          this.$notify({ title: '提示', message: '操作成功。密码重置为初始密码123456', type: 'success' })
        })
      }).catch(() => {})
    },
    getRole (rid) {
      let label = ''
      this.roleList.forEach((item) => {
        if (item.id === rid) {
          label = item.label
        }
      })
      return label
    }
  }
}
</script>

<style scoped>
</style>
