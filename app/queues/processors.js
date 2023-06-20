


const {
    ASSIGN_LOWEST_FLAG,
    queues,
} = require("./queue.js");

const processorInitialisers = {
    [ASSIGN_LOWEST_FLAG]: () => async (job, done) => {
        try {
            console.log("Job Done");
            done();
        } catch (error) {
            Promise.reject(error);
        }
    }
};

module.exports = { processorInitialisers };
