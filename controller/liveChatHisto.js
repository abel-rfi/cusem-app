const Op = require('sequelize').Op;

const models = require('../models');

const excel = require("exceljs");

// Middlewares
const { update, fetchAll, fetchOne } = require('../middlewares/CRUD');

const render = async (req, res) => {
	try {
		return res.render('DownloadTicketRating', {layout: 'liveChatHistoLayouts', query: {query: req.query}});
	} catch(err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
};

const downloadTicket = async (req, res) => {
	try {
		models.Ticket.findAll({raw: true, include: [
			{
				model: models.User,
				as: 'user'
			}, {
				model: models.Employee,
				as: 'employee'
			}
		]}).then((objs) => {
			let Tickets = [];
			objs.forEach((obj) => {
			  Tickets.push({
				id: obj.id,
				emploName: obj['employee.name'],
				userName: obj['user.name'],
				complaintStatus: obj.complaintStatus,
				complaintCategory: obj.complaintCategory,
				createdAt: obj.createdAt,
				updatedAt: obj.updatedAt,
			  });
			});
		
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Ticket_data");
		
			worksheet.columns = [
			  { header: "Id", key: "id", width: 5 },
			  { header: "emploName", key: "emploName", width: 5 },
			  { header: "userName", key: "userName", width: 25 },
			  { header: "complaintStatus", key: "complaintStatus", width: 25 },
			  { header: "complaintCategory", key: "complaintCategory", width: 25 },
			  { header: "createAt", key: "createdAt", width: 10 },
			  { header: "updateAt", key: "updatedAt", width: 10 },
			];
		
			// Add Array Rows
			worksheet.addRows(Tickets);
		
			res.setHeader(
			  "Content-Type",
			  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			);
			res.setHeader(
			  "Content-Disposition",
			  "attachment; filename=" + "Tickets.xlsx"
			);
		
			return workbook.xlsx.write(res).then(function () {
			  res.status(200).end();
			});
		  });

	} catch(err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

const downloadRating = async (req, res) => {
	try {
		models.Rating.findAll().then((objs) => {
			let Ratings = [];
		
			objs.forEach((obj) => {
			  Ratings.push({
				id: obj.id,
				ticketId: obj.ticketId,
				score: obj.score,
				comment: obj.comment,
				createdAt: obj.createdAt,
				updatedAt: obj.updatedAt,
			  });
			});
		
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Ratings");
		
			worksheet.columns = [
			  { header: "Id", key: "id", width: 5 },
			  { header: "ticketId", key: "ticketId", width: 5 },
			  { header: "Score", key: "score", width: 5 },
			  { header: "Comment", key: "comment", width: 30 },
			  { header: "createAt", key: "createdAt", width: 10 },
			  { header: "updateAt", key: "updatedAt", width: 10 },
			];
		
			// Add Array Rows
			worksheet.addRows(Ratings);
		
			res.setHeader(
			  "Content-Type",
			  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			);
			res.setHeader(
			  "Content-Disposition",
			  "attachment; filename=" + "Ratings.xlsx"
			);
		
			return workbook.xlsx.write(res).then(function () {
			  res.status(200).end();
			});
		  });

	} catch(err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
}

module.exports = {
    render,
	downloadTicket,
	downloadRating
};