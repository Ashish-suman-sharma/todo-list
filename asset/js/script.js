// Modern Todo App JavaScript
document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task");
    const taskList = document.getElementById("task-list");
    const emptyState = document.getElementById("empty-state");
    const totalTasksElement = document.getElementById("total-tasks");
    const completedTasksElement = document.getElementById("completed-tasks");
    
    let taskCounter = 1;

    // Initialize app
    init();

    function init() {
        loadTasksFromLocalStorage();
        updateStats();
        updateEmptyState();
        
        // Add event listeners
        taskForm.addEventListener("submit", handleAddTask);
        taskList.addEventListener("click", handleTaskClick);
        
        // Add input focus animation
        taskInput.addEventListener("focus", () => {
            taskInput.parentElement.style.transform = "translateY(-2px)";
        });
        
        taskInput.addEventListener("blur", () => {
            if (!taskInput.value) {
                taskInput.parentElement.style.transform = "translateY(0)";
            }
        });
    }

    function handleAddTask(e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        
        if (taskText) {
            addTask(taskText);
            taskInput.value = "";
            taskInput.parentElement.style.transform = "translateY(0)";
            saveTasksToLocalStorage();
            updateStats();
            updateEmptyState();
            
            // Add pulse animation to add button
            const addBtn = document.querySelector('.add-btn');
            addBtn.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                addBtn.style.animation = '';
            }, 300);
        }
    }

    function handleTaskClick(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        if (e.target.closest('.delete-btn')) {
            deleteTask(taskItem);
        } else if (e.target.closest('.task-text') || e.target.closest('.task-number')) {
            toggleTaskCompletion(taskItem);
        }
    }

    function addTask(text) {
        const taskItem = document.createElement("li");
        taskItem.className = "task-item";
        taskItem.style.opacity = "0";
        taskItem.style.transform = "translateX(30px)";
        
        taskItem.innerHTML = `
            <div class="task-number">${taskCounter}</div>
            <div class="task-text">${escapeHtml(text)}</div>
            <button class="delete-btn" title="Delete task">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        `;
        
        taskList.appendChild(taskItem);
        taskCounter++;
        
        // Animate in
        requestAnimationFrame(() => {
            taskItem.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
            taskItem.style.opacity = "1";
            taskItem.style.transform = "translateX(0)";
        });
    }

    function deleteTask(taskItem) {
        // Add deletion animation
        taskItem.style.transition = "all 0.3s ease-out";
        taskItem.style.transform = "translateX(100%)";
        taskItem.style.opacity = "0";
        
        setTimeout(() => {
            if (taskItem.parentNode) {
                taskList.removeChild(taskItem);
                renumberTasks();
                saveTasksToLocalStorage();
                updateStats();
                updateEmptyState();
            }
        }, 300);
    }

    function toggleTaskCompletion(taskItem) {
        taskItem.classList.toggle("completed");
        
        // Add completion animation
        const taskNumber = taskItem.querySelector('.task-number');
        const taskText = taskItem.querySelector('.task-text');
        
        if (taskItem.classList.contains("completed")) {
            taskNumber.style.transform = "scale(0.9)";
            taskText.style.transform = "scale(0.98)";
        } else {
            taskNumber.style.transform = "scale(1)";
            taskText.style.transform = "scale(1)";
        }
        
        saveTasksToLocalStorage();
        updateStats();
    }

    function renumberTasks() {
        const allTasks = taskList.querySelectorAll('.task-item');
        allTasks.forEach((task, index) => {
            const numberElement = task.querySelector('.task-number');
            numberElement.textContent = index + 1;
        });
        taskCounter = allTasks.length + 1;
    }

    function updateStats() {
        const allTasks = taskList.querySelectorAll('.task-item');
        const completedTasks = taskList.querySelectorAll('.task-item.completed');
        
        const total = allTasks.length;
        const completed = completedTasks.length;
        
        totalTasksElement.textContent = `${total} task${total !== 1 ? 's' : ''}`;
        completedTasksElement.textContent = `${completed} completed`;
    }

    function updateEmptyState() {
        const hasActiveTasks = taskList.querySelectorAll('.task-item').length > 0;
        
        if (hasActiveTasks) {
            emptyState.style.display = 'none';
        } else {
            emptyState.style.display = 'block';
        }
    }

    function saveTasksToLocalStorage() {
        const tasks = [...taskList.querySelectorAll('.task-item')];
        const taskData = tasks.map(task => ({
            text: task.querySelector('.task-text').textContent,
            completed: task.classList.contains("completed"),
        }));
        localStorage.setItem("focusTasks", JSON.stringify(taskData));
    }

    function loadTasksFromLocalStorage() {
        const savedTasks = localStorage.getItem("focusTasks");
        if (savedTasks) {
            try {
                const tasks = JSON.parse(savedTasks);
                
                // Clear existing tasks
                taskList.innerHTML = "";
                taskCounter = 1;
                
                tasks.forEach(task => {
                    addTask(task.text);
                    if (task.completed) {
                        const lastTask = taskList.lastElementChild;
                        if (lastTask) {
                            lastTask.classList.add("completed");
                        }
                    }
                });
            } catch (error) {
                console.error("Error loading tasks from localStorage:", error);
                localStorage.removeItem("focusTasks");
            }
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Add keyboard shortcuts
    document.addEventListener("keydown", (e) => {
        // Escape key to clear input
        if (e.key === "Escape" && taskInput === document.activeElement) {
            taskInput.value = "";
            taskInput.blur();
        }
        
        // Ctrl/Cmd + Enter to add task
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            if (taskInput.value.trim()) {
                handleAddTask(e);
            }
        }
    });

    // Add smooth scroll behavior for better UX
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add intersection observer for fade-in animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe task items as they're added
        const observeElement = (element) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        };

        // Observer for dynamically added elements
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('task-item')) {
                        setTimeout(() => observeElement(node), 100);
                    }
                });
            });
        });

        mutationObserver.observe(taskList, { childList: true });
    }
});
