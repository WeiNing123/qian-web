<template>
  <div>
    <search-bar>
      <el-form :inline="true" :model="param" class="demo-form-inline">
        <el-form-item label="标题：">
          <el-input v-model="param.title" clearable></el-input>
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
      <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
      <el-table-column prop="path" label="路径" show-overflow-tooltip></el-table-column>
      <el-table-column label="类型" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">上传文件</span>
          <span v-if="scope.row.type === 2">外部路径</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="lookOver(scope.$index, scope.row)"><i class="el-icon-document"></i>查看</el-button>
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

    <el-dialog title="编辑" :visible.sync="editDialog" width="600px" :show-close="false" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="标题" required>
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="editForm.path"></el-input>
        </el-form-item>
        <el-form-item label="类型" required>
          <el-select v-model="editForm.type" placeholder="请选择" style="width: 100%;" @change="editChange">
            <el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件" v-show="this.editForm.type === 1">
          <el-upload
            :action="action"
            :show-file-list="false"
            accept="text/plain"
            :on-success="handleAvatarSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <span style="font-size: 12px;margin-left: 10px; color: #666666;">只能上传txt文件，且不超过5M</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="editDialog = false" plain>取 消</el-button>
        <el-button type="primary" @click="trueEdit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增" :visible.sync="addDialog" width="600px" :show-close="false" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="标题" required>
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="addForm.path"></el-input>
        </el-form-item>
        <el-form-item label="类型" required>
          <el-select v-model="addForm.type" placeholder="请选择" style="width: 100%;" @change="addChange">
            <el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件" v-show="this.addForm.type === 1">
          <el-upload
            :action="action"
            :show-file-list="false"
            accept="text/plain"
            :on-success="handleAvatarSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <span style="font-size: 12px;margin-left: 10px; color: #666666;">只能上传txt文件，且不超过5M</span>
          </el-upload>
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
import { baseUrl } from '@/api/base'
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
        title: '',
        category: ''
      },
      loading: false,
      tableData: [],
      totalCount: 0,
      editForm: {
        id: 0,
        title: '',
        path: '',
        type: 0
      },
      editDialog: false,
      addForm: {
        title: '',
        path: '',
        category: '',
        type: 0
      },
      addDialog: false,
      typeList: [
        {id: 0, label: '请选择'},
        {id: 1, label: '上传文件'},
        {id: 2, label: '外部路径'}
      ],
      action: baseUrl.url + '/main/materials/upload',
      pathBak: ''
    }
  },
  computed: {
    ...mapState({
      tableHeight: (state) => state.menu.deviceHeight - 220
    })
  },
  created () {
    const catalog = this.$route.query.catalog
    this.param.category = catalog
    this.addForm.category = catalog
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
      this.$post('/main/materials/list', this.param).then(res => {
        this.tableData = res.records
        this.totalCount = res.total
        this.loading = false
      })
    },
    searchBtn () {
      this.loadData()
    },
    addItem () {
      this.addForm.title = ''
      this.addForm.path = ''
      this.addForm.type = 0
      this.pathBak = ''
      this.addDialog = true
    },
    trueAdd () {
      if (this.addForm.title === '') {
        this.$notify({ title: '提示', message: '标题必填!', type: 'error' })
        return
      }
      if (this.addForm.type === 0) {
        this.$notify({ title: '提示', message: '类型必选!', type: 'error' })
        return
      }
      if (this.addForm.type === 2 && this.addForm.path === '') {
        this.$notify({ title: '提示', message: '请填写路径!', type: 'error' })
        return
      }
      if (this.addForm.type === 1 && this.addForm.path === '') {
        this.$notify({ title: '提示', message: '请上传文件!', type: 'error' })
        return
      }
      this.$post('/main/materials/add', this.addForm).then(res => {
        this.loadData()
        this.$notify({ title: '提示', message: '添加成功!', type: 'success' })
        this.addDialog = false
      })
    },
    handleEdit (index, row) {
      this.editForm.id = row.id
      this.editForm.title = row.title
      this.editForm.path = row.path
      this.editForm.type = row.type
      this.pathBak = row.path
      this.editDialog = true
    },
    trueEdit () {
      if (this.editForm.title === '') {
        this.$notify({ title: '提示', message: '标题必填!', type: 'error' })
        return
      }
      if (this.editForm.type === 0) {
        this.$notify({ title: '提示', message: '类型必选!', type: 'error' })
        return
      }
      if (this.editForm.type === 2 && this.editForm.path === '') {
        this.$notify({ title: '提示', message: '请填写路径!', type: 'error' })
        return
      }
      if (this.editForm.type === 1 && this.editForm.path === '') {
        this.$notify({ title: '提示', message: '请上传文件!', type: 'error' })
        return
      }
      this.$post('/main/materials/edit', this.editForm).then(res => {
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
        this.$post('/main/materials/delete', row).then(res => {
          this.loadData()
          this.$notify({ title: '提示', message: '删除成功!', type: 'success' })
        })
      }).catch(() => {})
    },
    lookOver (index, row) {
      if (row.type === 1) {
        const routeData = this.$router.resolve({
          name: 'seeFile',
          query: {
            path: row.path,
            category: row.category,
            title: row.title
          }
        })
        window.open(routeData.href, '_blank')
      } else {
        window.open(row.path, '_blank')
      }
    },
    handleAvatarSuccess (res, file) {
      if (res.code === 200) {
        this.$notify({ title: '提示', message: '文件上传成功!', type: 'success' })
        this.addForm.path = '/upfile/qian/' + res.path
        this.editForm.path = '/upfile/qian/' + res.path
        this.pathBak = '/upfile/qian/' + res.path
      } else if (res.code === 500) {
        this.$notify({ title: '提示', message: '文件上传失败!', type: 'error' })
      }
    },
    addChange () {
      if (this.addForm.type === 1) {
        this.addForm.path = this.pathBak
      }
    },
    editChange () {
      if (this.editForm.type === 1) {
        this.editForm.path = ''
      }
      if (this.editForm.type === 2) {
        this.editForm.path = this.pathBak
      }
    }
  }
}
</script>

<style scoped>
</style>
