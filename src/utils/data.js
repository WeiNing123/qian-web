export const D2T = (data, rootid = 0) => {
  var hashMap = {}
  for (let i = 0; i < data.length; i++) {
    if (data[i]['parentId'] === undefined) data[i]['parentId'] = 0
    if (!hashMap[data[i]['parentId']]) {
      hashMap[data[i]['parentId']] = []
    }
    hashMap[data[i]['parentId']].push(data[i])
  }
  // const level = 0
  var root = { id: rootid, children: [] }
  var func = function (top, f) {
    // top._level = level
    // level++
    if (hashMap[top.id]) {
      top.children = hashMap[top.id]
      for (let j = 0; j < top.children.length; j++) {
        // if (top.id !== 0) top.children[j].parent = top
        func(top.children[j], f)
      }
    } else top.children = []
  }
  func(root, func)
  return root.children
}
