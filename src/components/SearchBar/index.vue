<template>
  <div class="searchBar">
    <div class="search-bar-header">
      <i class="el-icon-info"></i>{{ title }}
    </div>
    <div class="search-bar-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    title: {
      type: String,
      default: '查询条件'
    }
  }
}
</script>

<style>
.searchBar{
  height: 100px;
  width: 100%;
  border-bottom: #e8e8e8 1px solid;
}
.search-bar-header{
  height: 39px;
  line-height: 39px;
  border-bottom: #e8e8e8 1px solid;
  padding-left: 10px;
  font-size: 12px;
  color: #666;
}
.search-bar-body{
  height: 59px;
  line-height: 59px;
  padding-left: 10px;
}
.el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label {
  line-height: 59px;
}
</style>
