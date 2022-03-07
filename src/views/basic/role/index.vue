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
      <el-table-column prop="id" label="角色id" align="center"></el-table-column>
      <el-table-column prop="label" label="角色名称"></el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button size="small" type="text" @click="handlePower(scope.$index, scope.row)"><i class="el-icon-s-tools"></i>设置权限</el-button>
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
        <el-form-item label="角色id" required>
          <el-input v-model="editForm.id" readonly></el-input>
        </el-form-item>
        <el-form-item label="角色名称" required>
          <el-input v-model="editForm.label"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="editDialog = false" plain>取 消</el-button>
        <el-button type="primary" @click="trueEdit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增" :visible.sync="addDialog" width="600px">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="角色名称" required>
          <el-input v-model="addForm.userCode"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="addDialog = false" plain>取 消</el-button>
        <el-button type="primary" @click="trueAdd">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="'权限设置-' + roleName" :visible.sync="powerDialog" width="450px">
      <el-tree
        class="col-tree"
        ref="powerTree"
        :props="props"
        :data="treeData"
        :show-checkbox="true"
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="keys"
        :expand-on-click-node="false">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="powerDialog = false" plain>取 消</el-button>
        <el-button type="primary" @click="truePower">确 定</el-button>
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
      editForm: {
        id: 0,
        label: ''
      },
      editDialog: false,
      addForm: {
        label: ''
      },
      addDialog: false,
      powerDialog: false,
      treeData: [],
      props: {
        label: 'label',
        children: 'children'
      },
      keys: [],
      roleName: ''
    }
  },
  computed: {
    ...mapState({
      tableHeight: (state) => state.menu.deviceHeight - 120
    })
  },
  created () {
    this.loadData()
    this.loadTree()
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
      this.$post('/main/role/list', this.param).then(res => {
        this.tableData = res.records
        this.totalCount = res.total
        this.loading = false
      })
    },
    loadTree () {
      this.$post('/main/menu/tree', {parentId: 0}).then(res => {
        this.treeData = res.data[0].children
      })
    },
    addItem () {
      this.addForm.label = ''
      this.addDialog = true
    },
    trueAdd () {
      if (this.addForm.label === '') {
        this.$notify({ title: '提示', message: '角色名称必填!', type: 'error' })
        return
      }
      this.$post('/main/role/add', this.addForm).then(res => {
        this.loadData()
        this.$notify({ title: '提示', message: '添加成功，请继续设置角色权限！', type: 'success' })
        this.addDialog = false
      })
    },
    handleEdit (index, row) {
      this.editForm.id = row.id
      this.editForm.label = row.label
      this.editDialog = true
    },
    trueEdit () {
      if (this.editForm.label === '') {
        this.$notify({ title: '提示', message: '姓名必填!', type: 'error' })
        return
      }
      this.$post('/main/role/edit', this.editForm).then(res => {
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
        this.$post('/main/role/delete', {id: row.id}).then(res => {
          this.loadData()
          this.$notify({ title: '提示', message: '删除成功!', type: 'success' })
        })
      }).catch(() => {})
    },
    handlePower (index, row) {
      this.$nextTick(() => {
        this.$refs.powerTree.setCheckedKeys([])
      })
      this.editForm.id = row.id
      this.roleName = row.label
      this.$post('/main/role/loadTree', { roleId: row.id }).then(res => {
        this.keys = res.data
        this.powerDialog = true
      })
    },
    truePower () {
      const data = this.$refs.powerTree.getCheckedKeys().concat(this.$refs.powerTree.getHalfCheckedKeys())
      const tree = this.$refs.powerTree.getCheckedKeys()
      this.$post('/main/role/saveMenu', { id: this.editForm.id, menuIds: data, treeIds: tree }).then(res => {
        this.$notify({ title: '提示', message: '操作成功', type: 'success' })
        this.powerDialog = false
      })
    }
  }
}
</script>

<style scoped>
</style>
