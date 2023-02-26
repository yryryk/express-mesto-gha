const router = require('express').Router();
const { getCards, deleteCard, createCard } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);

module.exports = router;
