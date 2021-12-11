const models = require('../models');
const faqs = models.FAQ;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const test = (req, res) => {
	try {
		res.send("Send Login");
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}
const render = async (req, res) => {
	try {
		const faqss = await faqs.findAll({raw: true})
		res.render('FAQlist', { faqss, layout: "FAQlistLayout"})
		
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const renderUnsolvedFAQ = async (req, res) => {
	try {
		const faqss = await faqs.findAll({
			raw: true,
			where: {
				id: req.params.id
			}
		});
		res.render('FAQunSolved',{faqss, layout: 'FAQunSolvedLayout'})
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const search =  async (req, res) => {
	let { term, kategory } = req.query;

	// Make lowercase
	term = term.toLowerCase();
	kategory = kategory.toLowerCase();
	try {
		const faqss = await faqs.findAll({
			raw: true,
			where: { question: { [Op.like]: '%' + term + '%' }, probCategory: { [Op.like]: '%' + kategory + '%' }}
		});
		res.render('FAQlist', { faqss, layout: "FAQlistLayout"})
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
};

const jawabAgent = async (req, res) => {
	try {
		await faqs.update(req.body, {
			where: {
				id: req.params.id
			}
		});
		res.redirect('/faq-list-page');
	} catch (err) {
		console.log(err);
	}
}

const renderSolvedFAQ =  async (req, res) => {
	try {
		const faqss = await faqs.findAll({
			raw: true, where: { id: req.params.id}
		})
		res.render('FAQSolved', {faqss, layout: 'FAQSolvedLayout'})
	}
	catch (err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const create = async (req, res) => {
	try {
		res.render('createFAQ', { layout: 'FAQunSolvedLayout' });
	} catch (err) {
		console.log(err);
	}
}

const createFAQ = async (req, res) => {

	try {
		await faqs.create({
			question: req.body.question,
			probCategory: req.body.probCategory,
			solution: req.body.solution
		});
		res.redirect('/faq-list-page');
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
	test,
	render,
	search,
	create,
	createFAQ,
	renderUnsolvedFAQ,
	jawabAgent,
	renderSolvedFAQ
}
