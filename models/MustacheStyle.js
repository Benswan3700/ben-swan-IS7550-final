const mongoose = require('mongoose');
const slugify = require('slugify');

const mustacheStyleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\.(jpg|png)$/.test(v.toLowerCase());
            },
            message: props => `${props.value} is not a valid image URL. It must end with .jpg or .png`
        }
    },
    description: {
        type: String,
        required: true
    },
    titleSlug: {
        type: String,
        required: true,
    }
});

mustacheStyleSchema.pre('save', function(next) {
    this.titleSlug = slugify(this.title, { lower: true, trim: true });
    next();
});

const MustacheStyle = mongoose.model('MustacheStyle', mustacheStyleSchema);

module.exports = MustacheStyle;
