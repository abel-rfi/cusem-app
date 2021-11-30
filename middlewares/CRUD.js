function create (model, data) {
	return model.create(data)
}

function update(model, data, requirement) {
	return model.update(data, {where: requirement})
}

function del(id, model) {
	return model.destroy({where: {id}})
}

function fetchOne(model, requirement) {
	return model.findOne({raw: true, where: requirement})
}

function fetchAll(model, requirement) {
	return model.findAll({raw: true, where: requirement})
}

module.exports = {
	create,
	update,
	del,
	fetchOne,
	fetchAll
}