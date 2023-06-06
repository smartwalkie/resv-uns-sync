module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            type: { type: String, enum: ['sold', 'listing'] },
            lastFetched: Date,
            lastSaved: Date
        },
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Timestamp = mongoose.model("Timestamp", schema);
    return Timestamp;
};
