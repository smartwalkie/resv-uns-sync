module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        type: { type: String, enum: ['availability'] },
        lastFetched: Number,
        lastFetchedId: mongoose.Schema.Types.ObjectId
      },
    );
  
    schema.method("toJSON", function () {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const CronFetchIndex = mongoose.model("cron-fetch-index", schema);
    return CronFetchIndex;
  };
  