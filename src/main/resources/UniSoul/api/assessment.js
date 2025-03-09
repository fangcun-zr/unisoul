const AssessmentAPI = {

    getAssessmentList(categoryId) {
        return $.ajax({
            url: '/assessment/list',
            data: { category_id: categoryId }
        });
    },

    startAssessment(id) {
        return $.ajax({
            url: '/assessment/start',
            data: { id }
        });
    },

    getQuestions(sessionId, assessmentId) {
        return $.ajax({
            url: '/assessment/questions',
            data: {
                assessment_session_id: sessionId,
                id: assessmentId
            }
        });
    },

    submitAnswers(submitData) {
        return $.ajax({
            method: 'POST',
            url: '/assessment/submit',
            data: JSON.stringify(submitData),
            contentType: 'application/json'
        });
    },

    saveReport(data) {
        return $.ajax({
            method: 'POST',
            url: '/assessment/save',
            contentType: 'application/json',
            data: JSON.stringify(data)
        });
    },

    getHistory() {
        return $.ajax({
            url: '/assessment/history',
            method: 'GET',
            dataType: 'json'
        });
    },
};