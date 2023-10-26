document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task");
    const taskList = document.getElementById("task-list");
    let taskCounter = 1; // Initialize a counter for the task numbers

    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const taskText = taskInput.value;
        if (taskText.trim() !== "") {
            addTask(taskText);
            taskInput.value = "";
            saveTasksToLocalStorage();
        }
    });

    taskList.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete-btn")) {
            // Handle task deletion
            deleteTask(e.target.parentElement);
            saveTasksToLocalStorage();
        } else if (e.target.tagName === "LI") {
            e.target.classList.toggle("completed");
            saveTasksToLocalStorage();
        }
    });

    // Function to add a new task to the list
    function addTask(text) {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
            <span class="task-number">${taskCounter}.</span>
            <span class="task-text">${text}</span>
            <button class="delete-btn">Delete</button>
        `;
        taskList.appendChild(taskItem);
        taskCounter++;
    }

    // Function to delete a task
    function deleteTask(taskItem) {
        taskList.removeChild(taskItem);
        // Re-number the tasks after deletion
        const allTasks = taskList.children;
        for (let i = 0; i < allTasks.length; i++) {
            allTasks[i].querySelector('.task-number').textContent = `${i + 1}.`;
        }
    }

    // Function to save tasks to Local Storage
    function saveTasksToLocalStorage() {
        const tasks = [...taskList.children];
        const taskData = tasks.map(task => ({
            text: task.querySelector('.task-text').textContent,
            completed: task.classList.contains("completed"),
        }));
        localStorage.setItem("tasks", JSON.stringify(taskData));
    }

    // Function to load tasks from Local Storage on page load
    function loadTasksFromLocalStorage() {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);

            // Clear the existing task list
            taskList.innerHTML = "";

            // Reset the taskCounter
            taskCounter = 1;

            tasks.forEach(task => {
                addTask(task.text);
                if (task.completed) {
                    taskList.lastChild.classList.add("completed");
                }
            });
        }
    }

    // Call loadTasksFromLocalStorage() when the page loads
    loadTasksFromLocalStorage();
});
