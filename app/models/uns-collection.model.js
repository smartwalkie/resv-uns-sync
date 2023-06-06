module.exports = (mongoose) => {
    var schema = mongoose.Schema(
      {
        name: String,
        token: { type: String, index: true },
        clubName: String,
        slug: String,
        registration: {
          registrationDate: Date,
          owner: String,
          isAvailable: Boolean,
        },
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function () {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const EnsCollections = mongoose.model("ens-collections", schema);
    return EnsCollections;
  };
  