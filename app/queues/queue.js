const Queue = require("bull");
const opts = require("../config/redisConnection");

const ASSIGN_LOWEST_FLAG = "assign-lowest-flag";

const queues = {
    [ASSIGN_LOWEST_FLAG]: new Queue(ASSIGN_LOWEST_FLAG, opts),
};

module.exports = {
    ASSIGN_LOWEST_FLAG,
    queues,
};
