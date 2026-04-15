const VocabBuilder = require("../controllers/vocabController");
const { requireAuth } = require("../middleware/authMiddleware");

module.exports = (app) => {
  app
    .route("/words")
    .get(requireAuth, VocabBuilder.list_all_words)
    .post(requireAuth, VocabBuilder.create_a_word);

  app
    .route("/words/:wordId")
    .get(requireAuth, VocabBuilder.read_a_word)
    .put(requireAuth, VocabBuilder.update_a_word)
    .delete(requireAuth, VocabBuilder.delete_a_word);
};
