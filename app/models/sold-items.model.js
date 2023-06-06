module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        token: String,
        name: String,
        price: Number,
        currency: String,
        soldData: String,
        date: Date,
        from: String,
        to: String,
        orderKind: String,
        source: String,
        club: [{
          type: String
        }],
        category: String
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function () {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const SoldItems = mongoose.model("sold-items", schema);
    return SoldItems;
  };
  