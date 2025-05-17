const express = require("express");
const router = express.Router();
const { addFillBlank, bulkFillBlank } = require("../controllers/FillBlankController");
const { getRandomFillBlank } = require("../controllers/FillBlankRandomizeController");


router.post("/fill/:level", express.json(), addFillBlank);
router.post("/fill/bulk/:level", express.json(), bulkFillBlank);
router.get("/fill/:level", getRandomFillBlank);//               WYSYŁAMY NA FRONT POPRAW TO POTEM W KAZDYM ROUTSIE!!!!!


module.exports = router;
