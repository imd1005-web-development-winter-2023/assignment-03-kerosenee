const mylistCont = document.querySelector('[data-lists]')
const createlist = document.querySelector('[data-new-list-form]')
const newlist = document.querySelector('[data-new-list-input]')
const deletelist = document.querySelector('[data-delete-list-button]')
const alllistCont = document.querySelector('[data-list-display-container]')
const listtitles = document.querySelector('[data-list-title]')
const numberoflists = document.querySelector('[data-list-count]')
const alltasks = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const userTasksForm = document.querySelector('[data-new-task-form]')
const userInput = document.querySelector('[data-new-task-input]')
const deleteFinishedTasks = document.querySelector('[data-clear-complete-tasks-button]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

mylistCont.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

alltasks.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
    renderTaskCount(selectedList)
  }
})

deleteFinishedTasks.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
})

deletelist.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveAndRender()
})

createlist.addEventListener('submit', e => {
  e.preventDefault()
  const listName = newlist.value
  if (listName == null || listName === '') return
  const list = createList(listName)
  newlist.value = null
  lists.push(list)
  saveAndRender()
})

userTasksForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = userInput.value
  if (taskName == null || taskName === '') return
  const task = createTask(taskName)
  userInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks.push(task)
  saveAndRender()
})

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
  clearElement(mylistCont)
  renderLists()

  const selectedList = lists.find(list => list.id === selectedListId)
  if (selectedListId == null) {
    alllistCont.style.display = 'none'
  } else {
    alllistCont.style.display = ''
    listtitles.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(alltasks)
    renderTasks(selectedList)
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    alltasks.appendChild(taskElement)
  })
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  numberoflists.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name
    if (list.id === selectedListId) {
      listElement.classList.add('active-list')
    }
    mylistCont.appendChild(listElement)
  })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

render()
