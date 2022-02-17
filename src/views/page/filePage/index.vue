<template>
  <div class="file-page-bg">
    <div class="file-title-model">
      <div style="height: 20px;">&nbsp;</div>
      <div class="file-title-item"> 资料中心 > {{ category }}</div>
      <h2 class="file-title">{{ fileTitle }}</h2>
    </div>
    <div id="fileContent" class="file-content"></div>
    <div style="height: 80px;">&nbsp;</div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      category: '',
      fileTitle: ''
    }
  },
  created () {
    const queryTitle = this.$route.query.title
    this.fileTitle = queryTitle
    const queryCategory = this.$route.query.category
    this.category = queryCategory
    const queryData = this.$route.query.path
    this.$post('/main/materials/file', {path: queryData}).then(res => {
      let dom = document.getElementById('fileContent')
      dom.innerHTML = res.content.replaceAll('%##%', '<br>')
    })
  }
}
</script>

<style scoped>
.file-page-bg {
  background-color: #eee;
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 15px 0 0;
}
.file-content {
  line-height: 25px;
  font-size: 16px;
  margin: 0px auto;
  width: 60%;
  text-align: left;
  background: #ffffff;
  padding: 10px;
}
.file-title-model {
  margin: 0px auto;
  width: 60%;
  text-align: left;
  background: #f3f5f7;
  height: 150px;
  padding: 0 10px;
}
.file-title-item {
  height: 20px;
  line-height: 20px;
  color: #333;
  font-size: 14px;
}
</style>
