const Op = require('sequelize').Op;

const models = require('../models');

const excel = require("exceljs");

// Middlewares
const { update, fetchAll, fetchOne } = require('../middlewares/CRUD');

const render = async (req, res) => {
	try {
		return res.render('liveChatHisto', {layout: 'liveChatHistoLayouts', query: {query: req.query}});
	} catch(err) {
		console.log(`msg: ${err.message}`);
		return res.status(500).json({msg: err.message});
	}
};

const download = async (req, res) => {
	try {
		models.Chat.findAll().then((objs) => {
			let Chats = [];
		
			objs.forEach((obj) => {
			  Chats.push({
				id: obj.id,
				ticketId: obj.ticketId,
				sender: obj.sender,
				message: obj.message,
				createdAt: obj.createdAt,
				updatedAt: obj.updatedAt,
			  });
			});
		
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Chats");
		
			worksheet.columns = [
			  { header: "Id", key: "id", width: 5 },
			  { header: "ticketId", key: "ticketId", width: 5 },
			  { header: "Sender", key: "sender", width: 25 },
			  { header: "Message", key: "message", width: 25 },
			  { header: "createAt", key: "createdAt", width: 10 },
			  { header: "updateAt", key: "updatedAt", width: 10 },
			];
		
			// Add Array Rows
			worksheet.addRows(Chats);
		
			res.setHeader(
			  "Content-Type",
			  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			);
			res.setHeader(
			  "Content-Disposition",
			  "attachment; filename=" + "Chats.xlsx"
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
	download
};