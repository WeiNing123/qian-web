<template>
  <div>
    <search-bar>
      <el-form :inline="true" :model="param" class="demo-form-inline">
        <el-form-item label="名称：">
          <el-input v-model="param.label" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn"><i class="el-icon-search"></i></el-button>
        </el-form-item>
      </el-form>
    </search-bar>
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
      <el-table-column prop="label" label="名称"></el-table-column>
      <el-table-column prop="account" label="账号" align="center"></el-table-column>
      <el-table-column label="密码" align="center" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.password === '-'">-</span>
          <span v-if="scope.row.password !== '-'">
            <span v-if="scope.row.iconCode === 1">●●●●●●  <i class="el-icon-view" @click="view(scope.row)" style="cursor:pointer;"></i></span>
            <span v-if="scope.row.iconCode === 2">{{ scope.row.password }}  <i class="icon iconfont icon-eye-close" style="font-size: 12px; cursor:pointer;" @click="view(scope.row)"></i></span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i>删除</el-button>
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
        <el-form-item label="名称" required>
          <el-input v-model="editForm.label"></el-input>
        </el-form-item>
        <el-form-item label="账号" required>
          <el-input v-model="editForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="editDialog = false" plain>取 消</el-button>
        <el-button type="primary" @click="trueEdit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增" :visible.sync="addDialog" width="600px">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="名称" required>
          <el-input v-model="addForm.label"></el-input>
        </el-form-item>
        <el-form-item label="账号" required>
          <el-input v-model="addForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" type="textarea"></el-input>
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
import SearchBar from '@/components/SearchBar'

export default {
  components: {
    ButtonGroup,
    SearchBar
  },
  data () {
    return {
      param: {
        page: 1,
        limit: 20,
        label: ''
      },
      loading: false,
      tableData: [],
      totalCount: 0,
      editForm: {
        id: 0,
        label: '',
        account: '',
        password: '',
        remark: ''
      },
      editDialog: false,
      addForm: {
        label: '',
        account: '',
        password: '',
        remark: ''
      },
      addDialog: false
    }
  },
  computed: {
    ...mapState({
      tableHeight: (state) => state.menu.deviceHeight - 220
    })
  },
  created () {
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
      this.$post('/main/passwordManagement/list', this.param).then(res => {
        res.records.forEach((item) => {
          item['iconCode'] = 1
        })
        this.tableData = res.records
        this.totalCount = res.total
        this.loading = false
      })
    },
    searchBtn () {
      this.loadData()
    },
    view (row) {
      if (row.iconCode === 1) {
        row.iconCode = 2
      } else {
        row.iconCode = 1
      }
    },
    addItem () {
      this.addForm.label = ''
      this.addForm.account = ''
      this.addForm.password = ''
      this.addForm.remark = ''
      this.addDialog = true
    },
    trueAdd () {
      if (this.addForm.label === '') {
        this.$notify({ title: '提示', message: '名称必填!', type: 'error' })
        return
      }
      if (this.addForm.account === '') {
        this.$notify({ title: '提示', message: '账号必填!', type: 'error' })
        return
      }
      if (this.addForm.password === '') {
        this.$notify({ title: '提示', message: '密码必填!', type: 'error' })
        return
      }
      this.$post('/main/passwordManagement/add', this.addForm).then(res => {
        this.loadData()
        this.$notify({ title: '提示', message: '添加成功!', type: 'success' })
        this.addDialog = false
      })
    },
    handleEdit (index, row) {
      this.editForm.id = row.id
      this.editForm.label = row.label
      this.editForm.account = row.account
      this.editForm.password = row.password
      this.editForm.remark = row.remark
      this.editDialog = true
    },
    trueEdit () {
      if (this.editForm.label === '') {
        this.$notify({ title: '提示', message: '名称必填!', type: 'error' })
        return
      }
      if (this.editForm.account === '') {
        this.$notify({ title: '提示', message: '账号必填!', type: 'error' })
        return
      }
      if (this.editForm.password === '') {
        this.$notify({ title: '提示', message: '密码必填!', type: 'error' })
        return
      }
      this.$post('/main/passwordManagement/edit', this.editForm).then(res => {
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
        this.$post('/main/passwordManagement/delete', {id: row.id}).then(res => {
          this.loadData()
          this.$notify({ title: '提示', message: '删除成功!', type: 'success' })
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
