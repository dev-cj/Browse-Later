document.addEventListener('DOMContentLoaded', documentEvents, false)

let storage = chrome.storage.sync
//www.devcj.in
function documentEvents() {
  console.log('Suppp! ping me, would love to talk with another Geek :-)')
  let add = document.getElementById('add')
  let clearAll = document.getElementById('clearAll')
  let linksDiv = document.getElementById('links')
  let linkCount = document.getElementById('linkNo')
  let collapsible = document.querySelector('.collapsible')
  let links = []
  let count = 0
  M.AutoInit()

  let instance = new M.Collapsible(collapsible, open)
  collapsible.onmouseenter = () => instance.open()
  collapsible.onmouseleave = () => instance.close()
  clearAll.onclick = () => setStore([], 0)
  add.onclick = () => getLink()

  const getStorage = async () => {
    links.length = 0
    count = 0
    while (linksDiv.firstChild) linksDiv.removeChild(linksDiv.firstChild)
    await storage.get(null, function(object) {
      for (key in object.store) {
        if (key == 'count') {
          count = object.store.count
          continue
        }
        links.push.apply(links, object.store.links)
      }
      badgeNo(count)
      if (count != 0) lists()
    })
  }
  const badgeNo = count => {
    chrome.browserAction.setBadgeText({ text: count == 0 ? '' : '' + count })
    linkCount.innerHTML = count == 0 ? count : '' + count
  }
  const createLinkHTML = (title, url) =>
    (returnHTML = `<a target='_blank' class='listAnchor' href='${url}'>${title}</a>`)

  const delButton = id =>
    (buttonHTML = `<button id='deleteIcon' class='secondary-content waves-effect waves-light btn-small red accent-3' data-key="${id}"><i class='material-icons left'>delete</i>Delete</button>`)

  const createList = (title, url, id) => {
    let list = document.createElement('li')
    list.setAttribute('class', 'collection-item')
    list.innerHTML = createLinkHTML(title, url) + delButton(id)
    return list
  }
  const lists = () => {
    for (key in links) {
      linksDiv.appendChild(
        createList(links[key]['title'], links[key]['link'], links[key]['id'])
      )
    }

    let deleteButton = document.querySelectorAll('#deleteIcon')
    deleteButton.forEach(item => {
      item.addEventListener('click', e => {
        removeLink(links, e.target.getAttribute('data-key'))
      })
    })
  }
  const removeLink = (array, id) => {
    newArr = array.filter(ele => {
      return ele.id != id
    })
    let removeNode = document.querySelector(`li button[data-key='${id}']`)
    if (removeNode) {
      li = removeNode.closest('li')
      li.parentNode.removeChild(li)
      setStore(newArr, -1)
    }
  }
  const getLink = () => {
    chrome.tabs.getSelected(null, tab => {
      createLink(tab)
    })
  }
  const createLink = tabin => {
    url = tabin.url
    title = tabin.title
    let link = document.createElement('a')
    link.setAttribute('class', 'link')
    link.setAttribute('style', 'color: blue')
    link.setAttribute('href', url)
    link.setAttribute('target', '_blank')
    link.innerHTML = title
    checkLink(url, tabin)
  }
  const checkLink = (url, tabin) => {
    const found = links.some(el => el.link === url)
    if (!found) {
      storeLink(tabin)
    } else {
      M.toast({ html: 'Link already added' })
    }
  }

  const setStore = (arr, change) => {
    newCount = count + change
    if (change == 0) newCount = 0
    newStore = {
      links: arr,
      count: newCount
    }
    storage.set({ store: newStore }, async function(items) {
      await getStorage(items)
    })
  }
  const storeLink = tabin => {
    const ID = () =>
      '_' +
      Math.random()
        .toString(36)
        .substr(2, 9)

    let newLink = { title: tabin.title, link: tabin.url, id: ID() }
    links.push(newLink)
    setStore(links, 1)
  }
  getStorage()
}
