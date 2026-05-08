const slugify = require("slugify");
const generateSlug = async (Model, name, id = null) => {
  let baseSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    // Check If Slug Already Exists
    const existing = await Model.findOne({ slug });

    if (!existing || (id && existing._id.toString() === id.toString())) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

module.exports = generateSlug;
