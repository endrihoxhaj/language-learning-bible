window.LessonController = {
    currentView: '',

    onViewLoaded: function(viewName) {
        this.currentView = viewName;
        console.log('LessonController initialized for', viewName);

        if (viewName === 'biblos_lesson__user_speaking.html') {
             // Simulate listening automatically if entered
             this.simulateListening();
        }
    },

    handleMic: function() {
        console.log('Mic handled in', this.currentView);
        if (this.currentView.includes('tutor_speaking')) {
             // Go to user speaking
             if (window.loadView && window.routes) {
                 window.loadView(window.routes['lesson_user']);
             }
        } else if (this.currentView.includes('user_speaking')) {
             // Stop listening and show feedback
             this.finishListening();
        }
    },

    simulateListening: function() {
        // Visualize or just wait
        console.log('Simulating listening...');
        setTimeout(() => {
            this.finishListening();
        }, 3000);
    },

    finishListening: function() {
        if (window.loadView && window.routes) {
            const isCorrect = Math.random() > 0.3; // 70% chance correct
            if (isCorrect) {
                window.loadView(window.routes['lesson_feedback']);
            } else {
                window.loadView(window.routes['lesson_correction']);
            }
        }
    }
};
