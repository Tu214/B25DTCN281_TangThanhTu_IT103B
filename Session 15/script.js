// một “state” chứa mảng task và id đang sửa (không dùng JSON, không lưu)
const state = {
    tasks: [],
    editing: null,
};

document.addEventListener('DOMContentLoaded', init);

function init() {
    document.getElementById('addBtn').addEventListener('click', onAdd);
    document.getElementById('taskInput').addEventListener('keydown', e => {
        if (e.key === 'Enter') onAdd();
    });
    document.getElementById('taskList').addEventListener('click', handleListClick);
    render();
}

const onAdd = () => {
    const input = document.getElementById('taskInput');
    const name = input.value.trim();
    if (!name) return alert('Nhập tên đi!');
    state.tasks.push({ id: Date.now(), name, completed: false });
    persist();
    input.value = '';
    input.focus();
    render();
};

const handleListClick = e => {
    const id = +e.target.closest('.task-item')?.dataset.id;
    if (!id) return;

    if (e.target.matches('.task-checkbox')) {
        toggle(id, e.target.checked);
    } else if (e.target.matches('.btn-edit')) {
        state.editing = id;
        render();
    } else if (e.target.matches('.btn-save')) {
        saveEdit(id);
    } else if (e.target.matches('.btn-cancel')) {
        state.editing = null;
        render();
    } else if (e.target.matches('.btn-delete')) {
        deleteTask(id);
    }
};

const toggle = (id, done) => {
    const t = state.tasks.find(t => t.id === id);
    if (t) { t.completed = done; persist(); render(); }
};

const saveEdit = id => {
    const input = document.querySelector('.task-edit-input');
    const name = input.value.trim();
    if (!name) return alert('Không để trống!');
    const t = state.tasks.find(t => t.id === id);
    if (t) { t.name = name; }
    state.editing = null;
    persist(); render();
};

const deleteTask = id => {
    if (confirm('Xóa?')) {
        state.tasks = state.tasks.filter(t => t.id !== id);
        persist(); render();
    }
};

const render = () => {
    const list = document.getElementById('taskList');
    if (state.tasks.length === 0) {
        list.innerHTML = `
         <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">
                    Chưa có công việc nào. Hãy thêm công việc mới!
                </div>
            </div>
        `;
    } else {
        list.innerHTML = state.tasks.map(task =>
            state.editing === task.id
                ? `<div class="task-item editing" data-id="${task.id}">
                       <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} disabled>
                       <input type="text" class="task-edit-input" value="${task.name}">
                       <button class="btn-save">💾</button><button class="btn-cancel">❌</button>
                   </div>`
                : `<div class="task-item${task.completed ? ' completed' : ''}" data-id="${task.id}">
                       <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                       <span class="task-text${task.completed ? ' completed' : ''}">${task.name}</span>
                       <div class="task-actions">
                           <button class="btn-edit">✏️</button>
                           <button class="btn-delete">🗑️</button>
                       </div>
                   </div>`
        ).join('');
    }
    updateFooter();
};

const updateFooter = () => {
    const done = state.tasks.filter(t => t.completed).length;
    const total = state.tasks.length;
    document.getElementById('completedCount').textContent = done;
    document.getElementById('totalCount').textContent = total;
    document.querySelector('.completion-badge')?.remove();
    if (total && done === total) {
        const badge = document.createElement('div');
        badge.className = 'completion-badge';
        badge.innerHTML = '✅ Hoàn thành tất cả!';
        badge.style.animation = 'fadeInScale .5s';
        document.querySelector('.footer').appendChild(badge);
    }
};

// persist is a no-op since we aren't using storage or JSON
const persist = () => {

};