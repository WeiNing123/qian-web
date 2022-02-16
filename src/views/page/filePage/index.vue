<template>
  <p id="fileContent" class="file-content"></p>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  created () {
    const queryData = this.$route.query.path
    this.$post('/main/materials/file', {path: queryData}).then(res => {
      let dom = document.getElementById('fileContent')
      dom.innerHTML = res.content.replaceAll('%##%', '<br>')
    })
  }
}
</script>

<style scoped>
.file-content {
  line-height: 25px;
  font-size: 16px;
  margin: 0 10px;
}
</style>
