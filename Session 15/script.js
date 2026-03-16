let tasks = [];

let input = document.getElementById('taskInput');
let mainContent = document.getElementById('taskList');
let btn = document.getElementById('addBtn');

btn.addEventListener('click', addTasks)

input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        addTasks();
    }
})

function addTasks() {
    let newTask = input.value.trim()
    tasks.push({
        id: Date.now(),
        name: newTask,
        completed: false
    })
    input.value = '';
    input.focus();
    render();
}
render()
function render() {
    if (tasks.length === 0) {
        mainContent.innerHTML = `
        <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">
                    Chưa có công việc nào. Hãy thêm công việc mới!
                </div>
            </div>
        `
        return;
    }
    let htmlContent = '';

    tasks.forEach((task) => {
        htmlContent += `
        <div class="task-item" data-id="${task.id}">
            <input type="checkbox" class="task-checkbox" />
            <span class="task-text">${task.name}</span>
            <div class="task-actions">
                <button class="btn-edit">✏️ Sửa</button>
                <button class="btn-delete">🗑️ Xóa</button>
            </div>
        </div>`;
    });

    mainContent.innerHTML = htmlContent;
}

