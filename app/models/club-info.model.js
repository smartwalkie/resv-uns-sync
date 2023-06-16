module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            name: String,
            slug: String,
            description: String,
            twitter: String,
            website: String,
            chat: String,
            logo: String,
            source:String,
            sourceLink: String,
            totalNames: Number,
            availableNames: Number,
            type: String,
            uniqueOwners: Number,
            inGraceNames: Number,
            averageExpirationDate: Number,
            hasScore: {
                type: Boolean,
                default: false
            },
            longDescription: String,
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const ClubInfo = mongoose.model("club-info", schema);
    return ClubInfo;
};
