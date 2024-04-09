const Compositor = require('../models/compositor');

module.exports.list = () => {
    return Compositor
        .find()
        .exec();
}

module.exports.findById = id => {
    return Compositor
        .findOne({_id: id})
        .exec();
}

module.exports.findByPeriodo = periodo => {
    return Compositor
        .find({periodo: periodo})
        .exec();
}

module.exports.insert = compositor => {
    return Compositor.create(compositor);
}

module.exports.removeById = id => {
    return Compositor.deleteOne({_id: id});
}

module.exports.update = (id, compositor) => {
    return Compositor.findByIdAndUpdate(id, compositor);
}
