/**
 * Lab Activity 3 — Kanban Board
 * Fill in the TODO sections. Keep UI updates flowing through render().
 */

const state = {
	tasks: [
		{ id: "t1", title: "Read the lab README", status: "todo" },
		{ id: "t2", title: "Implement render()", status: "doing" },
		{ id: "t3", title: "Demo add / move / edit / delete", status: "done" },
	],
};

const STATUSES = ["todo", "doing", "done"];

function uid() {
	return `t${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Paint every task into the correct column from state.tasks.
 * Also update the count badges ([data-count="todo|doing|done"]).
 */

function render() {
	// TODO 1: for each status in STATUSES, clear [data-column-body="{status}"]
	STATUSES.forEach(status => {
		const columnBody = document.querySelector(`[data-column-body="${status}"]`);
		if (columnBody) {
			columnBody.innerHTML = "";
		}
	});

	// TODO 2: loop state.tasks — create a .card with:
	//         - <h3> task.title
	//         - .card-actions with buttons:
	//             Move → To Do   data-action="move" data-id data-status="todo"
	//             Move → Doing  data-action="move" data-id data-status="doing"
	//             Move → Done   data-action="move" data-id data-status="done"
	//             Edit          data-action="edit" data-id
	//             Delete        data-action="delete" data-id
	//         append card into the matching column body
	state.tasks.forEach(task => {
		const card = document.createElement("div");
		card.className = "card";

		const title = document.createElement("h3");
		title.textContent = task.title;
		card.appendChild(title);

		const actions = document.createElement("div");
		actions.className = "card-actions";

		const moveStatuses = STATUSES.filter(s => s !== task.status);
		moveStatuses.forEach(moveStatus => {
			const moveBtn = document.createElement("button");
			moveBtn.dataset.action = "move";
			moveBtn.dataset.id = task.id;
			moveBtn.dataset.status = moveStatus;
			const statusLabels = {
				todo: "To Do",
				doing: "Doing",
				done: "Done"
			};
			moveBtn.textContent = `→ ${statusLabels[moveStatus]}`;
			actions.appendChild(moveBtn);
		});

		const editBtn = document.createElement("button");
		editBtn.dataset.action = "edit";
		editBtn.dataset.id = task.id;
		editBtn.textContent = "Edit";
		actions.appendChild(editBtn);

		const deleteBtn = document.createElement("button");
		deleteBtn.dataset.action = "delete";
		deleteBtn.dataset.id = task.id;
		deleteBtn.textContent = "Delete";
		actions.appendChild(deleteBtn);

		card.appendChild(actions);

		const columnBody = document.querySelector(`[data-column-body="${task.status}"]`);
		if (columnBody) {
			columnBody.appendChild(card);
		}
	});

	// TODO 3: if a column has no cards, show <p class="empty">No tasks</p>
	STATUSES.forEach(status => {
		const columnBody = document.querySelector(`[data-column-body="${status}"]`);
		if (columnBody) {
			const tasksInColumn = state.tasks.filter(t => t.status === status);
			if (tasksInColumn.length === 0) {
				const emptyMsg = document.createElement("p");
				emptyMsg.className = "empty";
				emptyMsg.textContent = "No tasks";
				columnBody.appendChild(emptyMsg);
			}
		}
	});

	// TODO 4: set each [data-count] text to how many tasks have that status
	STATUSES.forEach(status => {
		const countElement = document.querySelector(`[data-count="${status}"]`);
		if (countElement) {
			const count = state.tasks.filter(t => t.status === status).length;
			countElement.textContent = count;
		}
	});
}

function addTask(title) {
	// TODO: push { id: uid(), title, status: "todo" } onto state.tasks
	state.tasks.push({ id: uid(), title: title.trim(), status: "todo" });
}

function moveTask(id, status) {
	// TODO: find task by id; if found and status is in STATUSES, set task.status
	const task = state.tasks.find(t => t.id === id);
	if (task && STATUSES.includes(status)) {
		task.status = status;
	}
}

function editTask(id, title) {
	// TODO: if title is non-empty, update that task's title
	const task = state.tasks.find(t => t.id === id);
	if (task && title && title.trim().length > 0) {
		task.title = title.trim();
	}
}

function deleteTask(id) {
	// TODO: confirm("Delete this task?"); if OK, filter it out of state.tasks
	if (confirm("Delete this task?")) {
		state.tasks = state.tasks.filter(t => t.id !== id);
	}
}

function init() {
	const form = document.querySelector("#task-form");
	const board = document.querySelector("#board");

	form?.addEventListener("submit", (e) => {
		e.preventDefault(); // keep the page from reloading
		const input = document.querySelector("#task-title");
		const title = input?.value.trim();
		if (!title) return;
		// TODO: addTask(title); input.value = ""; render();
		addTask(title);
		input.value = "";
		render();
	});

	// Event delegation: one listener handles all card buttons
	board?.addEventListener("click", (e) => {
		const btn = e.target.closest("button[data-action]");
		if (!btn) return;

		const { action, id, status } = btn.dataset;

		// TODO: switch on action:
		//   "move"   → moveTask(id, status); render();
		//   "edit"   → ask for a new title with prompt(), then editTask + render
		//   "delete" → deleteTask(id); render();
		switch (action) {
			case "move":
				moveTask(id, status);
				render();
				break;
			case "edit":
				const task = state.tasks.find(t => t.id === id);
				if (task) {
					const newTitle = prompt("Edit task title:", task.title);
					if (newTitle !== null && newTitle.trim().length > 0) {
						editTask(id, newTitle);
						render();
					}
				}
				break;
			case "delete":
				deleteTask(id);
				render();
				break;
		}
	});

	render();
}

document.addEventListener("DOMContentLoaded", init);