<template>
  <div>
    <button-group>
      <el-row>
        <el-button size="small" type="success" @click="addMenu()"><i class="el-icon-plus"></i> 新增</el-button>
      </el-row>
    </button-group>

    <el-table
      :data="tableData"
      :height="tableHeight"
      v-loading="loading"
      row-key="id"
      border
      :default-expand-all="false"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :stripe="true"
      style="width: 100%">
      <!--<el-table-column type="index" label="序号" align="center"></el-table-column>-->
      <el-table-column prop="id" label="ID" align="center" width="100"></el-table-column>
      <el-table-column prop="label" label="名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.icon!==null && scope.row.icon!==''"><i :class="scope.row.icon" /></span>
        </template>
      </el-table-column>
      <el-table-column prop="parentId" label="上级ID" align="center" width="100"></el-table-column>
      <el-table-column prop="orderBy" label="排序" align="center" width="100"></el-table-column>
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
        <el-form-item label="ID">
          <el-input v-model="editForm.id" readonly></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="editForm.label"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="editForm.path"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="editForm.icon">
            <template slot="prepend">
              <el-popover
                placement="bottom"
                title=""
                width="200"
                trigger="click"
                style="text-align: center;"
                content="">
                <span v-for="(icon, i) in iconList" :key="i" :class='["icon-style", editForm.icon === icon.item ? "icon-style-background" : ""]' @click="checkIcon(icon.item)">
                  <i :class="icon.item" />
                </span>
                <el-button slot="reference"><span style="cursor: pointer; font-size: 14px;"><i :class="editForm.icon" /></span></el-button>
              </el-popover>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select placeholder="请选择" v-model="selectLabel" style="width: 100%;" ref="menuSelect">
           <el-option class="option-style" :label="selectLabel" :value="selectValue">
             <el-input class="search" size="small" clearable placeholder="输入关键字进行过滤" v-model="filterText" @click.stop.native></el-input>
             <el-tree
              ref="menuTree"
              :data="treeDate"
              :props="defaultProps"
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              @node-click="nodeClick">
              <div slot-scope="{node, data}">
               <span :class="[{'tree-click': selectValue==data.id}]">{{data.label}}</span>
              </div>
             </el-tree>
           </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="editForm.orderBy"></el-input>
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
        <el-form-item label="路径" required>
          <el-input v-model="addForm.path"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="addForm.icon">
            <template slot="prepend">
              <el-popover
                placement="bottom"
                title=""
                width="200"
                trigger="click"
                style="text-align: center;"
                content="">
                <span v-for="(icon, i) in iconList" :key="i" :class='["icon-style", addForm.icon === icon.item ? "icon-style-background" : ""]' @click="checkIcon(icon.item)">
                  <i :class="icon.item" />
                </span>
                <el-button slot="reference"><span style="cursor: pointer; font-size: 14px;"><i :class="addForm.icon" /></span></el-button>
              </el-popover>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select placeholder="请选择" v-model="selectLabel" style="width: 100%;" ref="menuSelect">
            <el-option class="option-style" :label="selectLabel" :value="selectValue">
              <el-input class="search" size="small" clearable placeholder="输入关键字进行过滤" v-model="filterText" @click.stop.native></el-input>
              <el-tree
                ref="menuTree"
                :data="treeDate"
                :props="defaultProps"
                default-expand-all
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                @node-click="nodeClick">
                <div slot-scope="{node, data}">
                  <span :class="[{'tree-click': selectValue==data.id}]">{{data.label}}</span>
                </div>
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="addForm.orderBy"></el-input>
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
import { list } from './icon'

export default {
  components: {
    ButtonGroup
  },
  data () {
    return {
      param: {
        page: 1,
        limit: 20,
        parentId: 0
      },
      loading: false,
      tableData: [],
      totalCount: 0,
      editForm: {
        id: 0,
        label: '',
        path: '',
        icon: '',
        parentId: 0,
        orderBy: 0
      },
      editDialog: false,
      addForm: {
        label: '',
        path: '',
        icon: '',
        parentId: 0,
        orderBy: 0
      },
      addDialog: false,
      iconList: list,
      selectValue: 0,
      selectLabel: '',
      filterText: '',
      treeDate: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapState({
      tableHeight: (state) => state.menu.deviceHeight - 120
    })
  },
  created () {
    this.loadData()
    this.loadTreeData()
  },
  watch: {
    filterText (val) {
      this.$refs.menuTree.filter(val)
    }
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
      this.$post('/main/menu/list', this.param).then(res => {
        this.tableData = res.records
        this.totalCount = res.total
        this.loading = false
      })
    },
    loadTreeData () {
      this.$post('/main/menu/tree', {parentId: 0}).then(res => {
        this.treeDate = res.data
      })
    },
    addMenu () {
      this.selectValue = 0
      this.selectLabel = '顶级'
      this.addForm.label = ''
      this.addForm.path = ''
      this.addForm.parentId = 0
      this.addForm.orderBy = 0
      this.addForm.icon = ''
      this.filterText = ''
      this.addDialog = true
    },
    trueAdd () {
      if (this.addForm.label === '') {
        this.$notify({ title: '提示', message: '菜单名称必填!', type: 'error' })
        return
      }
      if (this.addForm.path === '') {
        this.$notify({ title: '提示', message: '菜单路径必填!', type: 'error' })
        return
      }
      this.$post('/main/menu/add', this.addForm).then(res => {
        this.loadData()
        this.loadTreeData()
        this.$notify({ title: '提示', message: '添加成功!', type: 'success' })
        this.addDialog = false
      })
    },
    handleEdit (index, row) {
      this.editForm.id = row.id
      this.editForm.label = row.label
      this.editForm.path = row.path
      this.editForm.icon = row.icon
      this.editForm.parentId = row.parentId
      this.editForm.orderBy = row.orderBy
      this.selectValue = row.parentId
      this.filterText = ''
      this.treeDate.forEach((item) => {
        if (item.id === row.parentId) {
          this.selectLabel = item.label
        } else {
          if (item.children && item.children.length > 0) {
            item.children.forEach((item1) => {
              if (item1.id === row.parentId) {
                this.selectLabel = item1.label
              } else {
                if (item1.children && item1.children.length > 0) {
                  item1.children.forEach((item2) => {
                    if (item2.id === row.parentId) {
                      this.selectLabel = item2.label
                    } else {
                      if (item2.children && item2.children.length > 0) {
                        item2.children.forEach((item3) => {
                          if (item3.id === row.parentId) {
                            this.selectLabel = item3.label
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        }
      })
      this.editDialog = true
    },
    trueEdit () {
      this.$post('/main/menu/edit', this.editForm).then(res => {
        this.loadData()
        this.loadTreeData()
        this.$notify({ title: '提示', message: '修改成功!', type: 'success' })
        this.editDialog = false
      })
    },
    checkIcon (icon) {
      this.editForm.icon = icon
      this.addForm.icon = icon
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick (obj, node) {
      this.selectLabel = obj.label
      this.selectValue = obj.id
      this.editForm.parentId = obj.id
      this.addForm.parentId = obj.id
      this.$refs.menuSelect.blur()
    },
    handleDelete (index, row) {
      if (row.children && row.children.length > 0) {
        this.$notify({ title: '提示', message: '当前菜单包含子菜单，不可删除!', type: 'error' })
      } else {
        this.$confirm('您确认删除该记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('/main/menu/delete', {id: row.id}).then(res => {
            this.loadData()
            this.loadTreeData()
            this.$notify({ title: '提示', message: '删除成功!', type: 'success' })
          })
        }).catch(() => {})
      }
    }
  }
}
</script>

<style scoped>
.cell i {
  font-size: 12px;
}
.icon-style {
  width: 25px;
  height: 25px;
  align-content: center;
  line-height: 25px;
  display:inline-block;
  cursor: pointer;
}
.icon-style-background {
  background: #e6e6e6;
}
.iconfont {
  font-size: 14px;
  margin-right: 0px;
}
.el-select-dropdown__item {
  height: 300px;
}
.search{
 width: calc(100% - 8px - 0.5rem);
 margin: 0 0.5rem;
}
.option-style{
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
.tree-click{
  color: #4D74D6;
  font-weight: 600;
}
</style>
