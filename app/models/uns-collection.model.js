module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      name: String,
      token: { type: String, index: true },
      namehash: String,
      slug: String,
      tld: String,
      registration: {
        contract:String,
        registrationDate: Date,
        owner: String,
        isAvailable: { type: Boolean, default: false },
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.virtual('clubInfo', {
    ref: 'club-infos',
    localField: 'slug',
    foreignField: 'slug',
    justOne: true,
  });

  const UnsCollections = mongoose.model("uns-collections", schema);
  return UnsCollections;
};
