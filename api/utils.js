const admin = require('./firebase');

// Function to delete existing data in Firebase
async function deleteExistingData(path) {
    try {
        await admin.database().ref(path).remove();
        console.log(`Data successfully deleted from: ${path}`);
    } catch (error) {
        console.error(`Error deleting data from ${path}:`, error.message);
    }
}

module.exports = { deleteExistingData };
