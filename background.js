let storage = chrome.storage.sync
let count = 0

const onload = () => {
  storage.get(null, function(object) {
    for (key in object.store) {
      if (key == 'count') {
        count = object.store.count
        continue
      }
    }

    if (count != 0) {
      chrome.browserAction.setBadgeText({ text: '' + count })
    }
  })
}

onload()
